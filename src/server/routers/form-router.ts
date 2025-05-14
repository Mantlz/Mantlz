import { z } from "zod";
import { j, privateProcedure } from "../jstack";
import { db } from "@/lib/db";
import { HTTPException } from "hono/http-exception";
import { NotificationStatus, NotificationType, FormType } from "@prisma/client";
import { Resend } from 'resend';
import { FormSubmissionEmail } from '@/emails/form-submission';
import { render } from '@react-email/components';
import { Prisma } from "@prisma/client";
import { enhanceDataWithAnalytics, extractAnalyticsFromSubmissions, Submission } from "@/lib/analytics-utils";
import { exportFormSubmissions } from "@/services/export-service";
import { QuotaService } from "@/services/quota-service";


const resend = new Resend(process.env.RESEND_API_KEY);

// interface EmailSettings {
//   enabled: boolean;
//   fromEmail?: string;
//   subject?: string;
//   template?: string;
//   replyTo?: string;
//   // Developer notification settings
//   developerNotificationsEnabled?: boolean;
//   developerEmail?: string;
//   maxNotificationsPerHour?: number;
//   notificationConditions?: {
//     field: string;
//     operator: string;
//     value: string;
//   }[];
//   lastNotificationSentAt?: Date;
// }

// Define available form templates
const formTemplates = {
  feedback: {
    name: "Feedback Form",
    description: "Collect user feedback",
    schema: z.object({
      rating: z.number().min(1).max(5),
      feedback: z.string().min(10),
      email: z.string().email().optional(),
    }),
  },
  waitlist: {
    name: "Waitlist Form",
    description: "Collect waitlist signups",
    schema: z.object({
      email: z.string().email(),
      name: z.string().min(2),
    }),
  },
  contact: {
    name: "Contact Form",
    description: "Simple contact form for inquiries",
    schema: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      message: z.string().min(10),
    }),
  },
  // Add more templates as needed
} as const;

// Add this helper function near the top of the file with other utility functions
const detectFormType = (schema: string): FormType => {
  try {
    const schemaLower = schema.toLowerCase();
    
    // 1. First check explicit form type indicators in schema
    if (schemaLower.includes('waitlist')) return FormType.WAITLIST;
    if (schemaLower.includes('feedback')) return FormType.FEEDBACK;
    if (schemaLower.includes('contact')) return FormType.CONTACT;
    
    // 2. Check for field combinations
    const hasEmail = schema.includes('"email"') || schema.includes('email:');
    const hasName = schema.includes('"name"') || schema.includes('name:');
    const hasRating = schema.includes('"rating"') || schema.includes('rating:');
    const hasFeedback = schema.includes('"feedback"') || schema.includes('feedback:');
    const hasMessage = schema.includes('"message"') || schema.includes('message:');
    
    if (hasRating && hasFeedback) return FormType.FEEDBACK;
    if (hasEmail && hasName && !hasMessage && !hasRating) return FormType.WAITLIST;
    if (hasEmail && hasName && hasMessage) return FormType.CONTACT;
    
    // 3. Default to custom if no patterns match
    return FormType.CUSTOM;
  } catch (error) {
    console.error('Error detecting form type:', error);
    return FormType.CUSTOM;
  }
};

// Helper to update form quota metrics
async function updateFormQuotaMetrics(userId: string, updates: {
  incrementForms?: boolean;
  incrementSubmissions?: boolean;
}) {
  await QuotaService.updateQuota(userId, updates);
}

export const formRouter = j.router({
  // Get all forms created by the authenticated user
  getUserForms: privateProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.string().optional(),
    }).optional())
    .query(async ({ c, input, ctx }) => {
      if (!ctx.user) {
        throw new HTTPException(401, { message: "User not authenticated" });
      }
      
      // Get forms with pagination
      const take = input?.limit ?? 10;
      const cursor = input?.cursor;
      
      const forms = await db.form.findMany({
        where: { userId: ctx.user.id },
        take: take + 1, // Get one extra to determine if there's a next page
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { 
              submissions: true,
              campaigns: true // Add campaigns count
            }
          },
          submissions: {
            where: {
              unsubscribed: true
            },
            select: {
              id: true
            }
          }
        }
      });
      
      // Check if we have more results
      const hasMore = forms.length > take;
      const data = hasMore ? forms.slice(0, take) : forms;
      
      return c.superjson({
        forms: data.map(form => ({
          id: form.id,
          name: form.name,
          description: form.description,
          submissionCount: form._count.submissions,
          campaignCount: form._count.campaigns, // Add campaign count
          unsubscribedCount: form.submissions.length,
          createdAt: form.createdAt,
          updatedAt: form.updatedAt,
        })),
        nextCursor: hasMore && data.length > 0 ? data[data.length - 1]?.id : undefined,
      });
    }),

  // Create form from template
  createFromTemplate: privateProcedure
    .input(z.object({
      templateId: z.enum(['feedback', 'waitlist', 'contact'] as const),
      name: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ c, input, ctx }) => {
      const { user } = ctx;
      if (!user) throw new HTTPException(401, { message: "Unauthorized" });

      // Check quota before creating form
      await QuotaService.canCreateForm(user.id);

      const template = formTemplates[input.templateId];
      
      // Map the template ID to a FormType enum value
      const formTypeMap: Record<string, FormType> = {
        'waitlist': FormType.WAITLIST,
        'feedback': FormType.FEEDBACK,
        'contact': FormType.CONTACT,
      };
      
      const formType = formTypeMap[input.templateId] || FormType.CUSTOM;
      
      // Store form type in settings for backward compatibility
      const settings = {
        formType: input.templateId
      };
      
      const form = await db.form.create({
        data: {
          name: input.name || template.name,
          description: input.description || template.description,
          schema: template.schema.toString(), // Serialize the schema
          userId: user.id,
          formType, // Use the enum value
          settings, // Keep settings for backward compatibility
          emailSettings: {
            create: {
              enabled: false
            }
          }
        },
      });

      // After form is created successfully
      await updateFormQuotaMetrics(user.id, { incrementForms: true });

      return c.superjson({
        id: form.id,
        name: form.name,
        description: form.description,
      });
    }),

  // Create custom form
  createForm: privateProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      schema: z.string(),
      formType: z.nativeEnum(FormType).optional(),
    }))
    .mutation(async ({ c, input, ctx }) => {
      const { user } = ctx;
      if (!user) throw new HTTPException(401, { message: "Unauthorized" });

      // Check quota before creating form
      await QuotaService.canCreateForm(user.id);
      
      // Determine form type: Prioritize provided type, fallback to detection
      const finalFormType = input.formType || detectFormType(input.schema);
      
      // Create settings object with form type string for backward compatibility
      const formTypeStrings = {
        [FormType.WAITLIST]: 'waitlist',
        [FormType.FEEDBACK]: 'feedback',
        [FormType.CONTACT]: 'contact',
        [FormType.CUSTOM]: 'custom'
      };
      const settings = {
        formType: formTypeStrings[finalFormType] || 'custom'
      };
      
      const form = await db.form.create({
        data: {
          name: input.name,
          description: input.description,
          schema: input.schema,
          userId: user.id,
          formType: finalFormType,
          settings,
          emailSettings: {
            create: {
              enabled: false,
              fromEmail: process.env.RESEND_FROM_EMAIL || 'contact@mantlz.app',
              subject: `Form Submission Confirmation - ${input.name}`,
              template: `
                <h1>Thank you for your submission!</h1>
                <p>We have received your submission for the form "${input.name}".</p>
                <p>We will review your submission and get back to you soon.</p>
              `.trim(),
            }
          }
        },
      });

      // After form is created successfully
      await updateFormQuotaMetrics(user.id, { incrementForms: true });

      return c.superjson({
        id: form.id,
        name: form.name,
        description: form.description,
        schema: form.schema,
        formType: finalFormType,
      });
    }),

  // Get form by ID
  getFormById: privateProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ c, input, ctx }) => {
      const { id } = input;
      const userId = ctx.user.id;
      
      const form = await db.form.findUnique({
        where: {
          id,
          userId,
        },
        include: {
          _count: {
            select: {
              submissions: true,
            },
          },
          emailSettings: true,
          user: {
            select: {
              plan: true
            }
          }
        },
      });
      
      if (!form) {
        throw new Error('Form not found');
      }
      
      // Use the formType field directly from the database
      const formType = form.formType; 
      
      // Get the users joined settings
      interface UsersJoinedSettings {
        enabled: boolean;
        count: number;
      }
      
      const usersJoinedSettings = ((form.settings as Record<string, unknown>)?.usersJoined || { enabled: false, count: 0 }) as UsersJoinedSettings;
      // Track if any settings were updated to determine if we need to save changes
      let settingsUpdated = false;
      
      // Check user's plan status
      const isFreeUser = form.user.plan === 'FREE';
      
      // If user is on FREE plan, automatically disable both premium features
      if (isFreeUser) {
        // 1. Disable users joined counter if it was enabled
        if (usersJoinedSettings.enabled) {
          usersJoinedSettings.enabled = false;
          settingsUpdated = true;
        }
        
        // 2. Disable email notifications if they were enabled
        if (form.emailSettings?.enabled) {
          // Update email settings in the database
          await db.emailSettings.update({
            where: { formId: id },
            data: { enabled: false }
          });
        }
      }
      
      // Save form settings if they were updated
      if (settingsUpdated) {
        await db.form.update({
          where: { id },
          data: {
            settings: {
              ...(form.settings as Record<string, unknown> || {}),
              usersJoined: {
                enabled: false, // Force disable for FREE users
              }
            }
          },
        });
      }
      
      // Get the submissions count if needed
      const submissionsCount = form._count.submissions;
      usersJoinedSettings.count = submissionsCount;
      
      return c.superjson({
        id: form.id,
        name: form.name,
        description: form.description,
        formType, // Include the form type
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
        submissionCount: form._count.submissions,
        emailSettings: {
          ...(form.emailSettings || { fromEmail: process.env.RESEND_FROM_EMAIL || 'contact@mantlz.app' }),
          // If user is on FREE plan, force disable email notifications
          enabled: isFreeUser ? false : (form.emailSettings?.enabled || false)
        },
        usersJoinedSettings,
        userPlan: form.user.plan, // Include the user's plan in the response
      });
    }),
    
  // Get form submissions
  getFormSubmissions: privateProcedure
    .input(z.object({
      formId: z.string(),
    }))
    .query(async ({ c, ctx, input }) => {
      const { formId } = input;
      const userId = ctx.user.id;
      
      // Verify form ownership
      const form = await db.form.findUnique({
        where: {
          id: formId,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              plan: true,
              email: true
            }
          },
          emailSettings: true
        }
      });
      
      if (!form) {
        throw new Error('Form not found');
      }
      
      const submissions = await db.submission.findMany({
        where: {
          formId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          createdAt: true,
          data: true,
        },
      });
      
      return c.superjson({
        submissions,
      });
    }),

  // Get form analytics data
  getFormAnalytics: privateProcedure
    .input(z.object({
      formId: z.string(),
      timeRange: z.enum(['day', 'week', 'month']).default('day'),
    }))
    .query(async ({ c, ctx, input }) => {
      const { formId, timeRange } = input;
      const userId = ctx.user.id;
      
      // Verify form ownership
      const form = await db.form.findUnique({
        where: {
          id: formId,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              plan: true
            }
          }
        }
      });
      
      if (!form) {
        throw new Error('Form not found');
      }

      // Get user plan
      const userPlan = form.user.plan;
      
      // Get all submissions for this form
      const submissions = await db.submission.findMany({
        where: { formId },
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          createdAt: true,
          data: true,
          email: true,
        }
      });
      
      const now = new Date();
      const formCreatedAt = new Date(form.createdAt);
      
      // Calculate daily submission rate
      const daysSinceCreation = Math.max(1, (now.getTime() - formCreatedAt.getTime()) / (1000 * 60 * 60 * 24));
      const dailySubmissionRate = submissions.length / daysSinceCreation;
      
      // Calculate week-over-week growth
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const twoWeeksAgo = new Date(now);
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      
      const lastWeekSubmissions = submissions.filter(sub => 
        new Date(sub.createdAt) >= oneWeekAgo
      );
      const previousWeekSubmissions = submissions.filter(sub => 
        new Date(sub.createdAt) >= twoWeeksAgo && new Date(sub.createdAt) < oneWeekAgo
      );
      
      const weekOverWeekGrowth = previousWeekSubmissions.length === 0
        ? lastWeekSubmissions.length > 0 ? 1 : 0
        : (lastWeekSubmissions.length - previousWeekSubmissions.length) / previousWeekSubmissions.length;
      
      // Calculate last 24 hours submissions
      const oneDayAgo = new Date(now);
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const last24HoursSubmissions = submissions.filter(sub => 
        new Date(sub.createdAt) >= oneDayAgo
      );
      
      // Calculate engagement score
      const engagementScore = Math.min(10, submissions.length / 10);
      
      // Peak hour calculation
      const submissionHours = submissions.map(sub => new Date(sub.createdAt).getHours());
      const hourCounts = submissionHours.reduce((acc, hour) => {
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      
      const peakHour = Object.entries(hourCounts).reduce((max, [hour, count]) => 
        count > (hourCounts[parseInt(max[0])] || 0) ? [hour, count] : max
      , ['0', 0])[0];
      
      // Calculate completion rate based on actual form abandonment data
      const abandonedSubmissions = submissions.filter(sub => {
        const data = sub.data as Record<string, unknown>;
        return data?.isAbandoned === true;
      });
      
      const completionRate = submissions.length > 0 
        ? (submissions.length - abandonedSubmissions.length) / submissions.length 
        : 0.9; // Default if no submissions
      
      // Calculate average response time between submissions
      const sortedSubmissions = [...submissions].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      // Calculate time differences between consecutive submissions
      const responseTimes = sortedSubmissions.slice(1).map((sub, i) => {
        const currentTime = new Date(sub.createdAt).getTime();
        const previousTime = new Date(sortedSubmissions[i]!.createdAt).getTime();
        return currentTime - previousTime;
      });
      
      // Calculate average response time in minutes
      // Filter out any unreasonable gaps (e.g., > 24 hours) to avoid skewing the average
      const reasonableResponseTimes = responseTimes.filter(time => 
        time <= 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      );
      
      const avgResponseTime = reasonableResponseTimes.length > 0
        ? reasonableResponseTimes.reduce((a, b) => a + b, 0) / reasonableResponseTimes.length
        : 150000; // Default 2.5 minutes if no submissions
      
      // Convert to minutes and round to 1 decimal place
      const avgResponseTimeInMinutes = Math.round((avgResponseTime / (1000 * 60)) * 10) / 10;
      
      // Generate time series data
      interface TimeSeriesPoint {
        time: string;
        submissions: number;
      }
      
      const timeSeriesData: TimeSeriesPoint[] = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      if (timeRange === 'day') {
        // Hourly data for the last 24 hours
        for (let i = 0; i < 24; i++) {
          const hour = new Date(now);
          hour.setHours(now.getHours() - 23 + i);
          hour.setMinutes(0, 0, 0);
          
          const nextHour = new Date(hour);
          nextHour.setHours(hour.getHours() + 1);
          
          const hourSubmissions = submissions.filter(sub => {
            const subDate = new Date(sub.createdAt);
            return subDate >= hour && subDate < nextHour;
          });
          
          timeSeriesData.push({
            time: `${hour.getHours()}:00`,
            submissions: hourSubmissions.length,
          });
        }
      } else if (timeRange === 'week') {
        // Daily data for the last 7 days
        for (let i = 0; i < 7; i++) {
          const day = new Date(now);
          day.setDate(day.getDate() - 6 + i);
          day.setHours(0, 0, 0, 0);
          
          const nextDay = new Date(day);
          nextDay.setDate(day.getDate() + 1);
          
          const daySubmissions = submissions.filter(sub => {
            const subDate = new Date(sub.createdAt);
            return subDate >= day && subDate < nextDay;
          });
          
          timeSeriesData.push({
            time: dayNames[day.getDay() % 7] || '',
            submissions: daySubmissions.length,
          });
        }
      } else if (timeRange === 'month') {
        // Daily data for the last 30 days
        for (let i = 0; i < 30; i++) {
          const day = new Date(now);
          day.setDate(day.getDate() - 29 + i);
          day.setHours(0, 0, 0, 0);
          
          const nextDay = new Date(day);
          nextDay.setDate(day.getDate() + 1);
          
          const daySubmissions = submissions.filter(sub => {
            const subDate = new Date(sub.createdAt);
            return subDate >= day && subDate < nextDay;
          });
          
          timeSeriesData.push({
            time: `${day.getMonth() + 1}/${day.getDate()}`,
            submissions: daySubmissions.length,
          });
        }
      }
      
      // Latest data point
      let latestDataPoint: TimeSeriesPoint = { time: '', submissions: 0 };
      if (timeSeriesData.length > 0) {
        const lastItem = timeSeriesData[timeSeriesData.length - 1];
        if (lastItem) {
          latestDataPoint = {
            time: lastItem.time,
            submissions: lastItem.submissions
          };
        }
      }
      
      // Use our utility function to extract browser and location stats
      const { browserStats, locationStats } = extractAnalyticsFromSubmissions(
        submissions as unknown as Submission[]
      );
      
      // Empty user insights array (we're not using this anymore)
      const userInsights: unknown[] = [];
      
      return c.superjson({
        totalSubmissions: submissions.length,
        dailySubmissionRate,
        weekOverWeekGrowth,
        last24HoursSubmissions: last24HoursSubmissions.length,
        engagementScore,
        peakSubmissionHour: parseInt(peakHour),
        completionRate,
        averageResponseTime: avgResponseTimeInMinutes,
        timeSeriesData,
        latestDataPoint,
        timeRange,
        userPlan,
        userInsights,
        browserStats,
        locationStats,
      });
    }),

  // Submit form
  submitForm: privateProcedure
    .input(z.object({
      formId: z.string(),
      data: z.record(z.any()),
    }))
    .mutation(async ({ c, input, ctx }) => {
      const { user } = ctx;
      if (!user) throw new HTTPException(401, { message: "Unauthorized" });

      const form = await db.form.findUnique({
        where: { id: input.formId },
        include: { 
          user: true,
          emailSettings: true
        }
      });

      if (!form) throw new HTTPException(404, { message: "Form not found" });

      // Check quota before submitting
      await QuotaService.canSubmitForm(form.user.id);
      
      // Validate file uploads if present
      const data = input.data;
      console.log('Form submission data:', data);
      
      // Process the data to ensure file fields are strings
      const processedData = { ...data };
      for (const [key, value] of Object.entries(data)) {
        if (value instanceof File) {
          console.log('Converting File object to URL for field:', key);
          // If it's a File object, we should have already uploaded it and have a URL
          processedData[key] = value.name; // Store the filename as a fallback
        } else if (typeof value === 'string' && value.startsWith('https://ucarecdn.com/')) {
          console.log('Found file URL for field:', key);
          processedData[key] = value; // Keep the URL as is
        }
      }
      
      // Use our utility function to enhance data with analytics info
      const enhancedData = enhanceDataWithAnalytics(processedData, {
        userAgent: c.req.header('user-agent'),
        cfCountry: c.req.header('cf-ipcountry'),
        acceptLanguage: c.req.header('accept-language'),
        ip: c.req.header('x-forwarded-for')
      });

      const submission = await db.submission.create({
        data: {
          formId: input.formId,
          data: enhancedData as unknown as Prisma.InputJsonValue,
          email: processedData.email, 
        },
      });

      // Send confirmation email for STANDARD and PRO users
      if (
        (form.user.plan === 'STANDARD' || form.user.plan === 'PRO') && 
        form.emailSettings?.enabled &&
        processedData.email && 
        typeof processedData.email === 'string'
      ) {
        try {
          const htmlContent = await render(
            FormSubmissionEmail({
              formName: form.name,
              submissionData: processedData,
            })
          );

          await resend.emails.send({
            from: form.emailSettings?.fromEmail || 'contact@mantlz.app',
            to: processedData.email,
            subject: form.emailSettings?.subject || `Confirmation: ${form.name} Submission`,
            replyTo: 'contact@mantlz.app',
            html: htmlContent
          });

          // Create notification log for successful email
          await db.notificationLog.create({
            data: {
              type: 'SUBMISSION_CONFIRMATION',
              status: 'SENT',
              submissionId: submission.id,
              formId: form.id,
            },
          });
        } catch (error) {
          // Log error and create notification log for failed email
          console.error('Failed to send confirmation email:', error);
          await db.notificationLog.create({
            data: {
              type: 'SUBMISSION_CONFIRMATION',
              status: 'FAILED',
              error: error instanceof Error ? error.message : 'Unknown error',
              submissionId: submission.id,
              formId: form.id,
            },
          });
        }
      } else {
        // Create a SKIPPED notification log if email was not sent
        await db.notificationLog.create({
          data: {
            type: 'SUBMISSION_CONFIRMATION',
            status: 'SKIPPED',
            error: 'Email not sent - plan or settings not configured',
            submissionId: submission.id,
            formId: form.id,
          },
        });
      }

      // Update quota after successful submission
      await updateFormQuotaMetrics(form.user.id, { incrementSubmissions: true });

      return c.superjson({ success: true });
    }),

  // Add this new procedure
  toggleEmailSettings: privateProcedure
    .input(z.object({
      formId: z.string(),
      enabled: z.boolean(),
      // Add new fields for developer notifications
      developerNotifications: z.object({
        enabled: z.boolean(),
        digestFrequency: z.enum(['realtime', 'hourly', 'daily', 'weekly']),
        // Notification conditions
        conditions: z.array(z.object({
          field: z.string(),
          operator: z.enum(['equals', 'contains', 'greaterThan', 'lessThan']),
          value: z.string()
        })).optional(),
        maxNotificationsPerHour: z.number().min(1).max(100).default(10),
      }).optional(),
    }))
    .mutation(async ({ c, input, ctx }) => {
      const { formId, enabled } = input;
      
      await db.form.update({
        where: {
          id: formId,
          userId: ctx.user.id, // Ensure user owns the form
        },
        data: {
          emailSettings: {
            update: {
              enabled,
            }
          }
        },
      });

      return c.superjson({ success: true });
    }),

  delete: privateProcedure
    .input(z.object({
      formId: z.string()
    }))
    .mutation(async ({ c, input, ctx }) => {
      const { formId } = input;

      try {
        // First verify the user owns this form
        const form = await db.form.findFirst({
          where: {
            id: formId,
            userId: ctx.user.id,
          },
        });

        if (!form) {
          throw new Error('Form not found or you do not have permission to delete it');
        }

        // Delete everything in a transaction to ensure data consistency
        await db.$transaction([
          // 1. Delete notification logs first (they reference both form and submissions)
          db.notificationLog.deleteMany({
            where: { formId }
          }),

          // 2. Delete submissions
          db.submission.deleteMany({
            where: { formId }
          }),

          // 3. Delete email settings
          db.emailSettings.deleteMany({
            where: { formId }
          }),

          // 4. Finally delete the form itself
          db.form.delete({
            where: {
              id: formId,
              userId: ctx.user.id,
            },
          })
        ]);

        return c.superjson({ success: true });
      } catch (error) {
        console.error('Error deleting form:', error);
        
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new Error(`Database error: ${error.message}`);
        }
        
        throw new Error('Failed to delete form and its related data');
      }
    }),

  // Delete a single submission
  deleteSubmission: privateProcedure
    .input(z.object({
      submissionId: z.string()
    }))
    .mutation(async ({ c, input, ctx }) => {
      const { submissionId } = input;
      const userId = ctx.user.id;

      try {
        // First get the submission to verify ownership
        const submission = await db.submission.findUnique({
          where: { id: submissionId },
          include: {
            form: {
              select: {
                userId: true
              }
            }
          }
        });

        if (!submission) {
          throw new HTTPException(404, { message: 'Submission not found' });
        }

        // Check if the user owns the form associated with this submission
        if (submission.form.userId !== userId) {
          throw new HTTPException(403, { message: 'You do not have permission to delete this submission' });
        }

        // Delete notifications first, then the submission
        await db.notificationLog.deleteMany({
          where: { submissionId }
        });

        await db.submission.delete({
          where: { id: submissionId }
        });

        return c.superjson({ success: true });
      } catch (error) {
        console.error('Error deleting submission:', error);
        if (error instanceof HTTPException) {
          throw error;
        }
        throw new HTTPException(500, { message: 'Failed to delete submission' });
      }
    }),

  // Get email settings for a form
  getEmailSettings: privateProcedure
    .input(z.object({
      formId: z.string(),
    }))
    .query(async ({ c, input, ctx }) => {
      const { formId } = input;
      const userId = ctx.user.id;
      
      // First verify the user owns this form
      const form = await db.form.findFirst({
        where: {
          id: formId,
          userId, // Ensure user owns the form
        },
        include: {
          emailSettings: true,
        }
      });

      if (!form) {
        throw new HTTPException(404, { message: 'Form not found or you do not have permission to access it' });
      }

      return c.superjson(form.emailSettings || {
        id: '',
        formId,
        enabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        fromEmail: null,
        subject: null,
        template: null,
        replyTo: null,
        developerNotificationsEnabled: false,
        developerEmail: null,
        maxNotificationsPerHour: 10,
        notificationConditions: null,
        lastNotificationSentAt: null,
      });
    }),

  // Update email settings for a form
  updateEmailSettings: privateProcedure
    .input(z.object({
      formId: z.string(),
      developerNotificationsEnabled: z.boolean().optional(),
      maxNotificationsPerHour: z.number().min(1).max(100).optional(),
    }))
    .mutation(async ({ c, input, ctx }) => {
      const { formId, ...settings } = input;
      const userId = ctx.user.id;
      
      try {
        // If formId is 'global', update user's global settings
        if (formId === 'global') {
          const globalSettings = await db.globalSettings.upsert({
            where: {
              userId,
            },
            update: {
              developerNotificationsEnabled: settings.developerNotificationsEnabled,
              maxNotificationsPerHour: settings.maxNotificationsPerHour,
            },
            create: {
              userId,
              developerNotificationsEnabled: settings.developerNotificationsEnabled ?? false,
              maxNotificationsPerHour: settings.maxNotificationsPerHour ?? 10,
            },
          });

          return c.superjson({ 
            success: true, 
            data: {
              developerNotificationsEnabled: globalSettings.developerNotificationsEnabled,
              maxNotificationsPerHour: globalSettings.maxNotificationsPerHour,
            }
          });
        }

        // Otherwise, update form-specific settings
        const emailSettings = await db.emailSettings.upsert({
          where: {
            formId,
          },
          update: {
            developerNotificationsEnabled: settings.developerNotificationsEnabled,
            maxNotificationsPerHour: settings.maxNotificationsPerHour,
          },
          create: {
            formId,
            enabled: false,
            developerNotificationsEnabled: settings.developerNotificationsEnabled ?? false,
            maxNotificationsPerHour: settings.maxNotificationsPerHour ?? 10,
          },
        });

        return c.superjson({ success: true, data: emailSettings });
      } catch (error) {
        console.error('Error updating email settings:', error);
        throw new HTTPException(500, { message: 'Failed to update email settings' });
      }
    }),

  // Update global settings
  updateGlobalSettings: privateProcedure
    .input(z.object({
      maxNotificationsPerHour: z.number().min(1).max(100),
      developerNotificationsEnabled: z.boolean(),
    }))
    .mutation(async ({ c, input, ctx }) => {
      const { user } = ctx;
      if (!user) throw new HTTPException(401, { message: "Unauthorized" });

      // Get user with plan
      const userWithPlan = await db.user.findUnique({
        where: { id: user.id },
        select: { 
          plan: true,
          id: true
        }
      });

      if (!userWithPlan) throw new HTTPException(404, { message: "User not found" });

      // Update settings
      const settings = await db.globalSettings.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          maxNotificationsPerHour: input.maxNotificationsPerHour,
          developerNotificationsEnabled: input.developerNotificationsEnabled,
        },
        update: {
          maxNotificationsPerHour: input.maxNotificationsPerHour,
          developerNotificationsEnabled: input.developerNotificationsEnabled,
        },
      });

      return c.superjson(settings);
    }),

  // Get global settings
  getGlobalSettings: privateProcedure
    .query(async ({ c, ctx }) => {
      const { user } = ctx;
      if (!user) throw new HTTPException(401, { message: "Unauthorized" });

      const settings = await db.globalSettings.findUnique({
        where: { userId: user.id },
      });

      if (!settings) {
        return c.superjson({
          maxNotificationsPerHour: 10,
          developerNotificationsEnabled: false,
        });
      }

      return c.superjson(settings);
    }),

  getSubmissionLogs: privateProcedure
    .input(z.object({
      formId: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(10),
      status: z.string().optional(),
      type: z.string().optional(),
      search: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .query(async ({ ctx, c, input }) => {
      const { user } = ctx;
      if (!user) {
        throw new HTTPException(401, { message: "User not authenticated" });
      }

      const { formId, page, limit, status, type, search, startDate, endDate } = input;
      const skip = (page - 1) * limit;

      try {

        // Get user's plan
        const userWithPlan = await db.user.findUnique({
          where: { id: user.id },
          select: { plan: true }
        });

        if (!userWithPlan) {
          throw new HTTPException(404, { message: "User not found" });
        }

        // Check if date filtering is requested but user isn't on PRO plan
        if ((startDate || endDate) && userWithPlan.plan !== 'PRO') {
          throw new HTTPException(403, { 
            message: "Date filtering is only available with the PRO plan" 
          });
        }

        // Build the where clause for submissions
        const where: Prisma.SubmissionWhereInput = {
          form: {
            userId: user.id,
          },
          ...(formId ? { formId } : {}),
          ...(search ? {
            OR: [
              { id: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
              { data: { path: ['$.email'], string_contains: search, mode: 'insensitive' as const } },
            ]
          } : {}),
        };

        // Add date range filtering only for PRO users
        if ((startDate || endDate) && userWithPlan.plan === 'PRO') {
          where.createdAt = {};
          
          if (startDate) {
            where.createdAt.gte = new Date(startDate);
          }
          
          if (endDate) {
            // Add one day to endDate to include the full day
            const endDateObj = new Date(endDate);
            endDateObj.setDate(endDateObj.getDate() + 1);
            where.createdAt.lt = endDateObj;
          }
        }

        // Build the where clause for notification logs
        const notificationLogsWhere: Prisma.NotificationLogWhereInput = {
          ...(status ? { status: status as NotificationStatus } : {}),
          ...(type ? { type: type as NotificationType } : {}),
        };


        const [submissions, total] = await Promise.all([
          db.submission.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip,
            select: {
              id: true,
              createdAt: true,
              email: true,
              data: true,
              form: {
                select: {
                  id: true,
                  name: true,
                  emailSettings: {
                    select: {
                      enabled: true,
                      developerNotificationsEnabled: true,
                    }
                  }
                }
              },
              notificationLogs: {
                where: notificationLogsWhere,
                select: {
                  id: true,
                  type: true,
                  status: true,
                  error: true,
                  createdAt: true,
                },
                orderBy: { createdAt: 'desc' }
              }
            }
          }),
          db.submission.count({ where })
        ]);

        // Enhance submissions with analytics data and format notification logs
        const enhancedSubmissions = submissions.map(submission => {
          const data = submission.data as Record<string, unknown>;
          interface MetaData {
            browser?: string;
            country?: string;
            [key: string]: unknown;
          }
          const meta = (data?._meta || {}) as MetaData;
          
          // Format notification logs to ensure consistent structure
          const formattedLogs = submission.notificationLogs.map(log => ({
            ...log,
            createdAt: log.createdAt.toISOString(),
            type: log.type as NotificationType,
            status: log.status as NotificationStatus,
            error: log.error || null
          }));

          // Add default notification logs if they don't exist
          const hasUserEmailLog = formattedLogs.some(log => log.type === 'SUBMISSION_CONFIRMATION');
          const hasDevEmailLog = formattedLogs.some(log => log.type === 'DEVELOPER_NOTIFICATION');

          // Only add default logs if there are no logs of that type
          if (!hasUserEmailLog && submission.email) {
            formattedLogs.push({
              id: `temp-${submission.id}-user-email`,
              type: 'SUBMISSION_CONFIRMATION' as NotificationType,
              status: 'SKIPPED' as NotificationStatus,
              error: 'Email not sent - plan or settings not configured',
              createdAt: submission.createdAt.toISOString()
            });
          }

          // Add developer email log if it doesn't exist and developer notifications are enabled
          if (!hasDevEmailLog) {
            formattedLogs.push({
              id: `temp-${submission.id}-dev-email`,
              type: 'DEVELOPER_NOTIFICATION' as NotificationType,
              status: submission.form.emailSettings?.developerNotificationsEnabled ? 'SKIPPED' as NotificationStatus : 'FAILED' as NotificationStatus,
              error: submission.form.emailSettings?.developerNotificationsEnabled 
                ? 'Developer notification not sent' 
                : 'Developer notifications are disabled',
              createdAt: submission.createdAt.toISOString()
            });
          }

          // Sort logs by type and creation date
          formattedLogs.sort((a, b) => {
            if (a.type === b.type) {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return a.type.localeCompare(b.type);
          });
          
          return {
            ...submission,
            analytics: {
              browser: meta.browser || 'Unknown',
              location: meta.country || 'Unknown',
            },
            notificationLogs: formattedLogs
          };
        });



        return c.superjson({
          submissions: enhancedSubmissions,
          pagination: {
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
          }
        });
      } catch (error) {
        console.error('❌ Error in getSubmissionLogs:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.error('Prisma error details:', {
            code: error.code,
            meta: error.meta,
            message: error.message
          });
        }
        throw new HTTPException(500, { 
          message: error instanceof Error ? error.message : 'Failed to fetch submission logs'
        });
      }
    }),

  export: privateProcedure
    .input(z.object({
      formId: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .mutation(async ({ c, input, ctx }) => {
      const { formId, startDate, endDate } = input;

      // Verify form ownership
      const form = await db.form.findFirst({
        where: {
          id: formId,
          userId: ctx.user.id,
        },
      });

      if (!form) {
        throw new HTTPException(404, { message: "Form not found" });
      }

      const result = await exportFormSubmissions({
        formId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      });

      return c.json(result);
    }),

  // New endpoint for searching submissions
  searchSubmissions: privateProcedure
    .input(z.object({
      query: z.string(),
      formId: z.string().optional()
    }))
    .query(async ({ c, ctx, input }) => {
      const { user } = ctx;
      if (!user) {
        throw new HTTPException(401, { message: "User not authenticated" });
      }

      // Verify user is premium
      const userWithPlan = await db.user.findUnique({
        where: { id: user.id },
        select: { plan: true }
      });

      if (!userWithPlan || (userWithPlan.plan !== 'PRO' && userWithPlan.plan !== 'STANDARD')) {
        throw new HTTPException(403, { message: "Premium feature" });
      }

      const { query, formId } = input;
      
      // Check if query follows the @id format
      const isIdSearch = query.startsWith('@');
      const searchValue = isIdSearch ? query.substring(1) : query;

      // Build the where clause based on search type and optional formId
      const whereClause: Prisma.SubmissionWhereInput = {
        form: {
          userId: user.id
        }
      };
      
      // Add formId to the query if specified
      if (formId) {
        whereClause.formId = formId;
      }
      
      // Add search conditions based on search type
      if (isIdSearch) {
        whereClause.id = { contains: searchValue };
      } else {
        whereClause.OR = [
          { email: { contains: searchValue, mode: 'insensitive' } },
          { data: { path: ['$.email'], string_contains: searchValue, mode: 'insensitive' } }
        ];
      }

      // Build the search query with complete submission data
      const submissions = await db.submission.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: 50, // Increased from 10 to provide more results
        select: {
          id: true,
          createdAt: true,
          email: true,
          data: true, // Include the actual submission data
          formId: true,
          form: {
            select: {
              id: true,
              name: true,
              description: true,
              emailSettings: {
                select: {
                  enabled: true,
                  developerNotificationsEnabled: true
                }
              }
            }
          },
          notificationLogs: {
            select: {
              id: true,
              type: true,
              status: true,
              error: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      // Enhance submissions with analytics data and format notification logs
      const enhancedSubmissions = submissions.map(submission => {
        const data = submission.data as Record<string, unknown>;
        interface MetaData {
          browser?: string;
          country?: string;
          [key: string]: unknown;
        }
        const meta = (data?._meta || {}) as MetaData;
        
        // Format notification logs to ensure consistent structure
        const formattedLogs = submission.notificationLogs.map(log => ({
          ...log,
          createdAt: log.createdAt.toISOString(),
          type: log.type,
          status: log.status,
          error: log.error || null
        }));

        // Add default logs if they don't exist
        const hasUserEmailLog = formattedLogs.some(log => log.type === 'SUBMISSION_CONFIRMATION');
        const hasDevEmailLog = formattedLogs.some(log => log.type === 'DEVELOPER_NOTIFICATION');

        if (!hasUserEmailLog && submission.email) {
          formattedLogs.push({
            id: `temp-${submission.id}-user-email`,
            type: 'SUBMISSION_CONFIRMATION',
            status: 'SKIPPED',
            error: 'Email not sent - plan or settings not configured',
            createdAt: submission.createdAt.toISOString()
          });
        }

        if (!hasDevEmailLog) {
          formattedLogs.push({
            id: `temp-${submission.id}-dev-email`,
            type: 'DEVELOPER_NOTIFICATION',
            status: submission.form.emailSettings?.developerNotificationsEnabled ? 'SKIPPED' : 'FAILED',
            error: submission.form.emailSettings?.developerNotificationsEnabled 
              ? 'Developer notification not sent' 
              : 'Developer notifications are disabled',
            createdAt: submission.createdAt.toISOString()
          });
        }

        return {
          id: submission.id,
          createdAt: submission.createdAt,
          email: submission.email,
          formId: submission.formId,
          formName: submission.form?.name || "Unknown Form",
          formDescription: submission.form?.description || "",
          data: submission.data,
          notificationLogs: formattedLogs,
          analytics: {
            browser: meta.browser || 'Unknown',
            location: meta.country || 'Unknown',
          }
        };
      });

      return c.superjson({
        submissions: enhancedSubmissions
      });
    }),

  // Toggle users joined settings for a form
  toggleUsersJoinedSettings: privateProcedure
    .input(z.object({
      formId: z.string(),
      enabled: z.boolean(),
    }))
    .mutation(async ({ c, input, ctx }) => {
      const { formId, enabled } = input;
      const userId = ctx.user.id;
      
      try {
        // First, check that the user owns this form
        const form = await db.form.findFirst({
          where: {
            id: formId,
            userId,
          },
        });

        if (!form) {
          throw new Error('Form not found or you do not have permission to update it');
        }

        // Check if the user's plan allows this feature
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { plan: true }
        });

        if (enabled && user?.plan === 'FREE') {
          throw new Error('This feature is only available on STANDARD and PRO plans');
        }

        // Update the form settings to enable/disable users joined counter
        await db.form.update({
          where: { id: formId },
          data: {
            settings: {
              ...(form.settings as Record<string, unknown> || {}),
              usersJoined: {
                enabled,
              }
            }
          },
        });

        return c.superjson({ 
          success: true, 
          data: {
            enabled,
          }
        });
      } catch (error) {
        console.error('Error updating users joined settings:', error);
        
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        
        throw new Error('Failed to update users joined settings');
      }
    }),

  // Get users joined count for a form
  getFormUsersJoinedCount: j.procedure
    .input(z.object({
      formId: z.string(),
    }))
    .query(async ({ c, input }) => {
      const { formId } = input;
      
      // Find the form by ID
      const form = await db.form.findUnique({
        where: { id: formId },
        select: {
          id: true,
          formType: true,
          settings: true,
          _count: {
            select: {
              submissions: true
            }
          }
        },
      });

      if (!form) {
        throw new HTTPException(404, { message: 'Form not found' });
      }

      // Get users joined settings
      interface UsersJoinedSettings {
        enabled: boolean;
      }
      const usersJoined = ((form.settings as Record<string, unknown>)?.usersJoined || { enabled: false }) as UsersJoinedSettings;
      const submissionCount = form._count.submissions;
      
      // Only return the count if the feature is enabled
      return c.json({
        formId: form.id,
        count: usersJoined.enabled ? submissionCount : 0
      });
    }),

});

