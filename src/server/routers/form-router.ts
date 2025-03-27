import { z } from "zod";
import { j, privateProcedure } from "../jstack";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { HTTPException } from "hono/http-exception";
import { User } from "@prisma/client";
import { getQuotaByPlan } from "@/config/usage";
import { startOfMonth } from "date-fns";
import { Resend } from 'resend';
import { FormSubmissionEmail } from '@/emails/form-submission';
import { render } from '@react-email/components';
import { Prisma } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailSettings {
  enabled: boolean;
  fromEmail?: string;
  subject?: string;
  template?: string;
  replyTo?: string;
  // Developer notification settings
  developerNotificationsEnabled?: boolean;
  developerEmail?: string;
  maxNotificationsPerHour?: number;
  notificationConditions?: any;
  lastNotificationSentAt?: Date;
}

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
      referralSource: z.string().optional(),
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

type FormTemplateType = 'feedback' | 'waitlist' | 'contact';

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
            select: { submissions: true }
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
          createdAt: form.createdAt,
          updatedAt: form.updatedAt,
        })),
        nextCursor: hasMore && data.length > 0 ? data[data.length - 1]?.id : undefined,
      });
    }),

  // Get available templates
  getTemplates: j.procedure.query(({ c }) => {
    return c.superjson(
      Object.entries(formTemplates).map(([id, template]) => ({
        id,
        name: template.name,
        description: template.description,
      }))
    );
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

      // Get user with plan
      const userWithPlan = await db.user.findUnique({
        where: { id: user.id },
        select: { 
          plan: true,
          id: true
        }
      });

      if (!userWithPlan) throw new HTTPException(404, { message: "User not found" });

      // Get form count
      const formCount = await db.form.count({
        where: { userId: user.id }
      });

      // Check form limits based on plan
      const quota = getQuotaByPlan(userWithPlan.plan);
      
      if (formCount >= quota.maxForms) {
        throw new HTTPException(403, { 
          message: `Form limit reached (${formCount}/${quota.maxForms}) for your plan`
        });
      }

      const template = formTemplates[input.templateId];
      
      const form = await db.form.create({
        data: {
          name: input.name || template.name,
          description: input.description || template.description,
          schema: template.schema.toString(), // Serialize the schema
          userId: userWithPlan.id,
          emailSettings: {
            create: {
              enabled: false
            }
          }
        },
      });

      return c.superjson({
        id: form.id,
        name: form.name,
        description: form.description,
      });
    }),

  // Create custom form (existing create endpoint)
  create: privateProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      schema: z.string(),
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

      // Get form count
      const formCount = await db.form.count({
        where: { userId: user.id }
      });

      // Check form limits based on plan
      const quota = getQuotaByPlan(userWithPlan.plan);
      
      if (formCount >= quota.maxForms) {
        throw new HTTPException(403, { 
          message: `Form limit reached (${formCount}/${quota.maxForms}) for your plan`
        });
      }
      
      const form = await db.form.create({
        data: {
          name: input.name,
          description: input.description,
          schema: input.schema,
          userId: userWithPlan.id,
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

      return c.superjson({
        id: form.id,
        name: form.name,
        description: form.description,
        schema: form.schema,
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
        },
      });
      
      if (!form) {
        throw new Error('Form not found');
      }
      
      return c.superjson({
        id: form.id,
        name: form.name,
        description: form.description,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
        submissionCount: form._count.submissions,
        emailSettings: form.emailSettings || { enabled: false, fromEmail: process.env.RESEND_FROM_EMAIL || 'contact@mantlz.app' },
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
    }))
    .query(async ({ c, ctx, input }) => {
      const { formId } = input;
      const userId = ctx.user.id;
      
      // Verify form ownership
      const form = await db.form.findUnique({
        where: {
          id: formId,
          userId,
        }
      });
      
      if (!form) {
        throw new Error('Form not found');
      }
      
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
      
      // Calculate response rate (submissions in last 24 hours)
      const oneDayAgo = new Date(now);
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const last24HoursSubmissions = submissions.filter(sub => 
        new Date(sub.createdAt) >= oneDayAgo
      );
      
      // Calculate engagement score (based on submission frequency)
      const submissionFrequency = submissions.length / daysSinceCreation;
      const recentActivity = last24HoursSubmissions.length > 0 ? 1 : 0;
      const engagementScore = (submissionFrequency * 0.7) + (recentActivity * 0.3);

      // Calculate peak submission times
      const submissionHours = submissions.map(sub => new Date(sub.createdAt).getHours());
      const hourCounts = submissionHours.reduce((acc, hour) => {
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      
      const peakHour = Object.entries(hourCounts).reduce((max, [hour, count]) => 
        count > (hourCounts[parseInt(max[0])] || 0) ? [hour, count] : max
      , ['0', 0])[0];

      // Calculate completion rate (if we have abandonment data)
      const abandonedSubmissions = submissions.filter(sub => {
        const data = sub.data as any;
        return data.isAbandoned === true;
      });
      const completionRate = submissions.length > 0 
        ? (submissions.length - abandonedSubmissions.length) / submissions.length 
        : 0;

      // Calculate average response time (time between submissions)
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
        : 0;

      // Convert to minutes and round to 1 decimal place
      const avgResponseTimeInMinutes = Math.round((avgResponseTime / (1000 * 60)) * 10) / 10;

      // Create time series data (hourly for the last 24 hours)
      const timeSeriesData = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(now);
        hour.setHours(now.getHours() - 23 + i);
        hour.setMinutes(0, 0, 0);
        
        const nextHour = new Date(hour);
        nextHour.setHours(hour.getHours() + 1);
        
        const hourSubmissions = submissions.filter(sub => {
          const subDate = new Date(sub.createdAt);
          return subDate >= hour && subDate < nextHour;
        });
        
        return {
          time: `${hour.getHours()}:00`,
          submissions: hourSubmissions.length,
        };
      });
      
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
      });
    }),

  // Get public form
  getPublicForm: j.procedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ c, input }) => {
      const { id } = input;
      
      const form = await db.form.findUnique({
        where: { id },
      });
      
      if (!form) {
        throw new Error('Form not found');
      }
      
      // Parse the schema to get form fields
      const schemaObj = JSON.parse(form.schema);
      const fields = Object.entries(schemaObj).map(([name, fieldSchema]: [string, any]) => {
        return {
          name,
          label: name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1'),
          type: fieldSchema.type === 'string' && fieldSchema.format === 'email' ? 'email' : 
                fieldSchema.type === 'string' ? 'text' : 
                'textarea',
          required: !fieldSchema.optional
        };
      });
      
      return c.superjson({
        id: form.id,
        name: form.name,
        description: form.description,
        fields
      });
    }),

  // Submit form
  submit: privateProcedure
    .input(z.object({
      formId: z.string(),
      data: z.record(z.any())
    }))
    .mutation(async ({ c, input, ctx }) => {
      const { formId, data } = input;
      
      // Get the form to validate the submission
      const form = await db.form.findUnique({
        where: { id: formId },
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
        throw new HTTPException(404, { message: 'Form not found' });
      }

      // Check if user has reached their monthly submission limit
      const currentDate = startOfMonth(new Date());
      
      // Count the submissions for the current month for all user forms
      const monthlySubmissionsCount = await db.submission.count({
        where: {
          form: {
            userId: form.user.id
          },
          createdAt: {
            gte: currentDate
          }
        }
      });
      
      // Get the quota for the user's plan
      const quota = getQuotaByPlan(form.user.plan);
      
      if (monthlySubmissionsCount >= quota.maxSubmissionsPerMonth) {
        throw new HTTPException(403, { 
          message: `Monthly submission limit reached (${monthlySubmissionsCount}/${quota.maxSubmissionsPerMonth}) for this plan`
        });
      }
      
      // Create the submission
      const submission = await db.submission.create({
        data: {
          formId,
          data: data,
          email: data.email, // Store email if provided in form
        },
      });

      // Send confirmation email for STANDARD and PRO users
      if (
        (form.user.plan === 'STANDARD' || form.user.plan === 'PRO') && 
        (form.emailSettings as unknown as EmailSettings)?.enabled &&
        data.email && 
        typeof data.email === 'string'
      ) {
        try {
          const htmlContent = await render(
            FormSubmissionEmail({
              formName: form.name,
              submissionData: data,
            })
          );

          await resend.emails.send({
            from: (form.emailSettings as unknown as EmailSettings)?.fromEmail || 'contact@mantlz.app',
            to: data.email,
            subject: (form.emailSettings as unknown as EmailSettings)?.subject || `Confirmation: ${form.name} Submission`,
            replyTo: 'contact@mantlz.app',
            html: htmlContent,
          });
        } catch (error) {
          // Log error but don't fail the submission
          console.error('Failed to send confirmation email:', error);
        }
      }

      return c.superjson({
        id: submission.id,
        message: 'Form submitted successfully'
      });
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
      
      const form = await db.form.update({
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
      debugMode: z.object({
        enabled: z.boolean(),
        webhookUrl: z.string().nullable(),
        logLevel: z.enum(['basic', 'detailed', 'verbose']),
        includeMetadata: z.boolean(),
      }),
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

      // Only PRO users can modify debug settings
      if (userWithPlan.plan !== 'PRO') {
        throw new HTTPException(403, { 
          message: 'Debug mode settings are only available for PRO users'
        });
      }

      // Update settings
      const settings = await db.globalSettings.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          maxNotificationsPerHour: input.maxNotificationsPerHour,
          developerNotificationsEnabled: input.developerNotificationsEnabled,
          debugMode: input.debugMode,
        },
        update: {
          maxNotificationsPerHour: input.maxNotificationsPerHour,
          developerNotificationsEnabled: input.developerNotificationsEnabled,
          debugMode: input.debugMode,
        },
      });

      // Update debug service configuration
      const debugService = (await import('@/services/debug-service')).debugService;
      debugService.setConfig(input.debugMode);

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
          debugMode: {
            enabled: false,
            webhookUrl: null,
            logLevel: 'basic',
            includeMetadata: false,
          },
        });
      }

      return c.superjson(settings);
    }),

  // Get user's current plan
  getUserPlan: privateProcedure
    .query(async ({ c, ctx }) => {
      const userId = ctx.user.id;
      
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { plan: true }
      });

      if (!user) {
        throw new HTTPException(404, { message: 'User not found' });
      }

      return c.superjson({ plan: user.plan });
    }),
});


