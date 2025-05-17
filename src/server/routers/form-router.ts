import { z } from "zod";
import { j, privateProcedure } from "../jstack";
import { db } from "@/lib/db";
import { HTTPException } from "hono/http-exception";
import { NotificationStatus, NotificationType, FormType, Prisma } from "@prisma/client";
import { extractAnalyticsFromSubmissions, Submission } from "@/lib/analytics-utils";
import { exportFormSubmissions } from "@/services/export-service";
import { QuotaService } from "@/services/quota-service";
import { FormService } from "@/server/form-services/form-service";
import { SubmissionService } from "@/server/form-services/submission-service";
import { TemplateService } from "@/server/form-services/template-service";
import { formTemplates as templateDefinitions } from "@/lib/form-templates";



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
      
      const limit = input?.limit ?? 10;
      const cursor = input?.cursor;
      
      const result = await FormService.getUserForms(ctx.user.id, limit, cursor);
      
      return c.superjson(result);
    }),

  // Create form from template
  createFromTemplate: privateProcedure
    .input(z.object({
      templateId: z.enum(Object.keys(templateDefinitions) as [string, ...string[]]),
      name: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ c, input, ctx }) => {
      const { user } = ctx;
      if (!user) throw new HTTPException(401, { message: "Unauthorized" });

      const form = await TemplateService.createFormFromTemplate(
        user.id,
        input.templateId as keyof typeof templateDefinitions,
        input.name,
        input.description
      );

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

      const form = await FormService.createCustomForm(
        user.id,
        input.name,
        input.description,
        input.schema,
        input.formType
      );

      return c.superjson({
        id: form.id,
        name: form.name,
        description: form.description,
        schema: form.schema,
        formType: form.formType,
      });
    }),

  // Get form by ID
  getFormById: privateProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ c, input, ctx }) => {
      const formDetails = await FormService.getFormById(input.id, ctx.user.id);
      return c.superjson(formDetails);
    }),
    
  // Get form submissions
  getFormSubmissions: privateProcedure
    .input(z.object({
      formId: z.string(),
    }))
    .query(async ({ c, ctx, input }) => {
      const submissions = await SubmissionService.getFormSubmissions(input.formId, ctx.user.id);
      
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

      await SubmissionService.submitForm(input.formId, input.data, {
        userAgent: c.req.header('user-agent'),
        cfCountry: c.req.header('cf-ipcountry'),
        acceptLanguage: c.req.header('accept-language'),
        ip: c.req.header('x-forwarded-for')
      });

      return c.superjson({ success: true });
    }),

  // Toggle email settings
  toggleEmailSettings: privateProcedure
    .input(z.object({
      formId: z.string(),
      enabled: z.boolean(),
    }))
    .mutation(async ({ c, input, ctx }) => {
      const result = await FormService.toggleEmailSettings(
        input.formId, 
        ctx.user.id, 
        input.enabled
      );
      
      return c.superjson(result);
    }),

  // Delete form
  delete: privateProcedure
    .input(z.object({
      formId: z.string()
    }))
    .mutation(async ({ c, input, ctx }) => {
      const result = await FormService.deleteForm(input.formId, ctx.user.id);
      return c.superjson(result);
    }),

  // Delete a single submission
  deleteSubmission: privateProcedure
    .input(z.object({
      submissionId: z.string()
    }))
    .mutation(async ({ c, input, ctx }) => {
      const result = await SubmissionService.deleteSubmission(input.submissionId, ctx.user.id);
      return c.superjson(result);
    }),

  // Toggle users joined settings for a form
  toggleUsersJoinedSettings: privateProcedure
    .input(z.object({
      formId: z.string(),
      enabled: z.boolean(),
    }))
    .mutation(async ({ c, input, ctx }) => {
      const result = await FormService.toggleUsersJoinedSettings(
        input.formId,
        ctx.user.id,
        input.enabled
      );
      
      return c.superjson(result);
    }),

  // Get users joined count for a form
  getFormUsersJoinedCount: j.procedure
    .input(z.object({
      formId: z.string(),
    }))
    .query(async ({ c, input }) => {
      // Find the form by ID with submission count
      const form = await db.form.findUnique({
        where: { id: input.formId },
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

  // Reset form count to match actual forms
  resetFormCount: privateProcedure
    .mutation(async ({ c, ctx }) => {
      try {
        await QuotaService.resetFormCount(ctx.user.id);
        return c.superjson({ success: true });
      } catch (error) {
        console.error('Error resetting form count:', error);
        throw new Error('Failed to reset form count');
      }
    }),

  // Export form submissions
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
});

