import { j, privateProcedure } from "../jstack";
import { db } from "@/lib/db";
import { HTTPException } from "hono/http-exception";
import { addMonths, startOfMonth } from "date-fns";
import { getQuotaByPlan } from "@/config/usage";
import { QuotaService } from "@/services/quota-service";

/**
 * Router for handling user usage information
 * Provides endpoints to get usage statistics, limits, and history
 */
export const usageRouter = j.router({
  /**
   * Get current user usage information
   * Returns form creation limits and current usage
   */
  getUserUsage: privateProcedure.query(async ({ ctx, c }) => {
    const { user } = ctx;

    try {
      // Count actual forms
      const formCount = await db.form.count({
        where: { userId: user.id }
      });

      // Count actual submissions
      const submissionCount = await db.submission.count({
        where: { 
          form: {
            userId: user.id
          }
        }
      });

      // Count actual campaigns
      const campaignCount = await db.campaign.count({
        where: { userId: user.id }
      });

      // Get the limits based on user's plan
      const quota = getQuotaByPlan(user.plan);

      return c.superjson({
        plan: user.plan,
        currentUsage: {
          submissions: submissionCount,
          forms: formCount,
          campaigns: campaignCount
        },
        limits: {
          maxForms: quota.maxForms,
          maxSubmissionsPerMonth: quota.maxSubmissionsPerMonth,
          campaigns: {
            enabled: quota.campaigns.enabled,
            maxCampaignsPerMonth: quota.campaigns.maxCampaignsPerMonth
          }
        }
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
      // Count actual forms
      const formCount = await db.form.count({
        where: { userId: user.id }
      });

      // Count actual submissions
      const submissionCount = await db.submission.count({
        where: { 
          form: {
            userId: user.id
          }
        }
      });

      // Count actual campaigns
      const campaignCount = await db.campaign.count({
        where: { userId: user.id }
      });

      // Get the limits based on user's plan
      const quota = getQuotaByPlan(user.plan);
      
      // Calculate reset date (first day of next month)
      const resetDate = addMonths(startOfMonth(new Date()), 1);

      return c.superjson({
        usage: {
          forms: {
            used: formCount,
            limit: quota.maxForms,
            percentage: (formCount / quota.maxForms) * 100
          },
          submissions: {
            used: submissionCount,
            limit: quota.maxSubmissionsPerMonth,
            percentage: (submissionCount / quota.maxSubmissionsPerMonth) * 100
          },
          campaigns: {
            used: campaignCount,
            limit: quota.campaigns.maxCampaignsPerMonth,
            percentage: (campaignCount / quota.campaigns.maxCampaignsPerMonth) * 100
          }
        },
        features: {
          campaigns: quota.campaigns.enabled
        },
        resetDate,
        plan: user.plan
      });
    } catch (error) {
      console.error('Error getting usage:', error);
      throw new HTTPException(500, { 
        message: "Failed to retrieve usage information" 
      });
    }
  }),
  
  simulateEndOfMonth: privateProcedure
    .mutation(async ({ c, ctx }) => {
      try {
        const result = await QuotaService.simulateEndOfMonth(ctx.user.id);
        return c.superjson(result);
      } catch (error) {
        console.error('Error simulating end of month:', error);
        throw new Error('Failed to simulate end of month');
      }
    }),

  getQuotaHistory: privateProcedure
    .query(async ({ c, ctx }) => {
      try {
        const history = await QuotaService.getQuotaHistory(ctx.user.id);
        return c.superjson(history);
      } catch (error) {
        console.error('Error getting quota history:', error);
        throw new Error('Failed to get quota history');
      }
    }),
}); 