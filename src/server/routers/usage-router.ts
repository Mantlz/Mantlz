import { j, privateProcedure } from "../jstack";
import { db } from "@/lib/db";
import { HTTPException } from "hono/http-exception";
import { addMonths, startOfMonth } from "date-fns";
import { getQuotaByPlan } from "@/config/usage";

/**
 * Router for handling user usage information
 * Provides endpoints to get usage statistics, limits, and history
 */
export const usageRouter = j.router({
  /**
   * Get current user usage information
   * Returns form creation limits, current usage, and history
   */
  getUserUsage: privateProcedure.query(async ({ ctx, c }) => {
    const { user } = ctx;

    try {
      // Get the current date info for this month's quota
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      
      // Get or create quota for current month
      let currentQuota = await db.quota.findFirst({
        where: {
          userId: user.id,
          year: currentYear,
          month: currentMonth,
        },
      });

      // If no quota exists for current month, create a new one with reset counts
      if (!currentQuota) {
        // Get the previous month's quota to carry over non-submission metrics
        const previousDate = new Date(now);
        previousDate.setMonth(previousDate.getMonth() - 1);
        const previousMonthQuota = await db.quota.findFirst({
          where: {
            userId: user.id,
            year: previousDate.getFullYear(),
            month: previousDate.getMonth() + 1
          }
        });

        currentQuota = await db.quota.create({
          data: {
            userId: user.id,
            year: currentYear,
            month: currentMonth,
            // Reset only submission count
            submissionCount: 0,
            // Carry over other metrics from previous month or start at 0 if no previous month
            formCount: previousMonthQuota?.formCount || 0,
            campaignCount: previousMonthQuota?.campaignCount || 0,
            emailsSent: previousMonthQuota?.emailsSent || 0,
            emailsOpened: previousMonthQuota?.emailsOpened || 0,
            emailsClicked: previousMonthQuota?.emailsClicked || 0
          }
        });
      }

      // Get monthly quota records for the past 6 months
      const usageHistory = await db.quota.findMany({
        where: {
          userId: user.id,
          OR: Array.from({ length: 6 }).map((_, index) => {
            const date = new Date();
            date.setMonth(date.getMonth() - index);
            return {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
            };
          }),
        },
        orderBy: [
          { year: "asc" },
          { month: "asc" },
        ],
      });

      // Format usage history for the chart
      const formattedHistory = Array.from({ length: 6 }).map((_, index) => {
        const date = new Date();
        date.setMonth(date.getMonth() - index);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        
        const historyItem = usageHistory.find(
          (item) => item.year === year && item.month === month
        );
        
        return {
          month: date.toLocaleString('default', { month: 'short' }),
          year,
          submissions: historyItem?.submissionCount || 0,
          forms: historyItem?.formCount || 0,
          campaigns: historyItem?.campaignCount || 0,
          emailStats: {
            sent: historyItem?.emailsSent || 0,
            opened: historyItem?.emailsOpened || 0,
            clicked: historyItem?.emailsClicked || 0,
          }
        };
      }).reverse(); // Show earliest month first

      return c.superjson({
        plan: user.plan,
        currentUsage: {
          submissions: currentQuota.submissionCount,
          forms: currentQuota.formCount,
          campaigns: currentQuota.campaignCount,
          emailStats: {
            sent: currentQuota.emailsSent,
            opened: currentQuota.emailsOpened,
            clicked: currentQuota.emailsClicked,
          }
        },
        limits: getQuotaByPlan(user.plan),
        history: formattedHistory,
      });
    } catch (error) {
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { 
        message: "Failed to retrieve usage information"
      });
    }
  }),

  /**
   * Get current user usage with detailed metrics
   */
  getUsage: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx;

    try {
      const currentDate = startOfMonth(new Date());
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      
      // Get current month's quota
      const currentQuota = await db.quota.findFirst({
        where: {
          userId: user.id,
          year: currentYear,
          month: currentMonth
        }
      });
      
      // Get user's plan
      const userWithPlan = await db.user.findUnique({
        where: { id: user.id },
        select: { plan: true }
      });
      
      // Get the limits based on user's plan
      const plan = userWithPlan?.plan || 'FREE';
      const quota = getQuotaByPlan(plan);
      
      // Calculate reset date
      const resetDate = addMonths(currentDate, 1);

      // Calculate engagement rates
      const emailEngagement = currentQuota ? {
        openRate: currentQuota.emailsSent > 0 
          ? (currentQuota.emailsOpened / currentQuota.emailsSent) * 100 
          : 0,
        clickRate: currentQuota.emailsSent > 0 
          ? (currentQuota.emailsClicked / currentQuota.emailsSent) * 100 
          : 0,
      } : { openRate: 0, clickRate: 0 };

      return c.superjson({
        usage: {
          forms: {
            used: currentQuota?.formCount || 0,
            limit: quota.maxForms,
            percentage: ((currentQuota?.formCount || 0) / quota.maxForms) * 100
          },
          submissions: {
            used: currentQuota?.submissionCount || 0,
            limit: quota.maxSubmissionsPerMonth,
            percentage: ((currentQuota?.submissionCount || 0) / quota.maxSubmissionsPerMonth) * 100
          },
          campaigns: {
            used: currentQuota?.campaignCount || 0,
            limit: quota.campaigns.maxCampaignsPerMonth,
            percentage: ((currentQuota?.campaignCount || 0) / quota.campaigns.maxCampaignsPerMonth) * 100
          },
          email: {
            sent: currentQuota?.emailsSent || 0,
            opened: currentQuota?.emailsOpened || 0,
            clicked: currentQuota?.emailsClicked || 0,
            ...emailEngagement
          }
        },
        features: {
          campaigns: quota.campaigns.enabled,
          analytics: quota.campaigns.features.analytics,
          scheduling: quota.campaigns.features.scheduling,
          templates: quota.campaigns.features.templates,
          customDomain: quota.campaigns.features.customDomain
        },
        resetDate,
        plan
      });
    } catch (error) {
      console.error('Error getting usage:', error);
      throw new HTTPException(500, { 
        message: "Failed to retrieve usage information" 
      });
    }
  }),

  /**
   * Get total submissions across all user forms
   */
  getTotalSubmissions: privateProcedure.query(async ({ ctx, c }) => {
    const { user } = ctx;

    try {
      // Get all-time submission count
      const totalSubmissions = await db.quota.aggregate({
        where: { userId: user.id },
        _sum: {
          submissionCount: true
        }
      });

      // Get current month's submission count
      const now = new Date();
      const currentMonthSubmissions = await db.quota.findFirst({
        where: {
          userId: user.id,
          year: now.getFullYear(),
          month: now.getMonth() + 1
        },
        select: {
          submissionCount: true
        }
      });

      return c.superjson({
        totalSubmissions: totalSubmissions._sum.submissionCount || 0,
        currentMonthSubmissions: currentMonthSubmissions?.submissionCount || 0
      });
    } catch (error) {
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { 
        message: "Failed to retrieve submission information"
      });
    }
  }),
}); 