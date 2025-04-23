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
      const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
      
      // Get the user with their current month quota
      const userWithCurrentQuota = await db.user.findUnique({
        where: { id: user.id },
        include: {
          quota: {
            where: {
              year: currentYear,
              month: currentMonth,
            },
          },
        },
      });

      if (!userWithCurrentQuota) {
        throw new HTTPException(404, { message: "User not found" });
      }

      // Get total forms created by the user
      const totalForms = await db.form.count({
        where: { userId: user.id },
      });

      // Get form creation history for the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      
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

      // Use totalForms for usedQuota instead of the quota count
      // This matches the actual number of forms the user has created
      const usedQuota = totalForms;
      const remainingQuota = Math.max(0, userWithCurrentQuota.quotaLimit - usedQuota);

      // Format usage history for the chart
      // Fill in any missing months with zero counts
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
          count: historyItem?.count || 0,
        };
      }).reverse(); // Show earliest month first

      return c.superjson({
        plan: userWithCurrentQuota.plan,
        limit: userWithCurrentQuota.quotaLimit,
        usedQuota,
        remainingQuota,
        totalForms,
        history: formattedHistory,
        usagePercentage: Math.min(
          Math.round((usedQuota / userWithCurrentQuota.quotaLimit) * 100),
          100
        ),
      });
    } catch (error) {
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { 
        message: "Failed to retrieve usage information"
      });
    }
  }),

  /**
   * Get current user usage with form and submission counts/limits
   */
  getUsage: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx;

    try {
      const currentDate = startOfMonth(new Date());
      
      // Get form count
      const formCount = await db.form.count({
        where: { userId: user.id },
      });
      
      // Get submission count for current month
      const submissionsCount = await db.submission.count({
        where: {
          form: {
            userId: user.id
          },
          createdAt: {
            gte: currentDate
          }
        }
      });
      
      // Get user's plan from the database
      const userWithPlan = await db.user.findUnique({
        where: { id: user.id },
        select: { plan: true }
      });
      
      // Get the limits based on user's plan
      const plan = userWithPlan?.plan || 'FREE';
      const quota = getQuotaByPlan(plan);
      
      // Calculate reset date
      const resetDate = addMonths(currentDate, 1);

      return c.superjson({
        formsUsed: formCount,
        formsLimit: quota.maxForms,
        submissionsUsed: submissionsCount,
        submissionsLimit: quota.maxSubmissionsPerMonth,
        resetDate,
        plan
      });
    } catch (_error) {
      throw new HTTPException(500, { 
        message: "Failed to retrieve usage information" 
      });
    }
  }),


  /**
   * Get total submissions across all user forms
   * Returns count of all submissions received from all forms created by the user
   */
  getTotalSubmissions: privateProcedure.query(async ({ ctx, c }) => {
    const { user } = ctx;

    try {
      // Get all forms created by the user
      const userForms = await db.form.findMany({
        where: { userId: user.id },
        select: { id: true }
      });

      // If user has no forms, return zero
      if (userForms.length === 0) {
        return c.superjson({ totalSubmissions: 0 });
      }

      // Get form IDs
      const formIds = userForms.map(form => form.id);

      // Count submissions for all forms
      const totalSubmissions = await db.submission.count({
        where: {
          formId: {
            in: formIds
          }
        }
      });

      return c.superjson({
        totalSubmissions
      });
    } catch (error) {
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { 
        message: "Failed to retrieve submission information"
      });
    }
  }),
}); 