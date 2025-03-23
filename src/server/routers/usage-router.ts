import { z } from "zod";
import { j, privateProcedure } from "../jstack";
import { db } from "@/lib/db";
import { HTTPException } from "hono/http-exception";
import { Plan } from "@/types/users/user";

/**
 * Router for handling user usage information
 * Provides endpoints to get usage statistics, limits, and history
 */
export const usageRouter = j.router({
  /**
   * Get current user usage information
   * Returns form creation limits, current usage, and history
   */
  getUserUsage: privateProcedure.query(async ({ ctx, c, input }) => {
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
   * Reset a user's monthly quota (admin only)
   * This is primarily for testing or admin purposes
   */
  resetMonthlyQuota: privateProcedure
    .input(z.object({
      userId: z.string().optional(),
    }))
    .mutation(async ({ ctx, c, input }) => {
      const { user } = ctx;
      const { userId = user.id } = input;
      
      // Check if the user is an admin if trying to reset another user's quota
      if (userId !== user.id) {
        const requestingUser = await db.user.findUnique({
          where: { id: user.id },
        });
        
        // Check if user is admin (HACKER or INDIE plan)
        const isAdmin = 
          (requestingUser?.plan as string) === "HACKER" || 
          (requestingUser?.plan as string) === "INDIE";
        if (!isAdmin) {
          throw new HTTPException(403, { 
            message: "Only admins can reset other users' quotas" 
          });
        }
      }

      try {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        // Delete current month's quota entry
        await db.quota.deleteMany({
          where: {
            userId,
            year: currentYear,
            month: currentMonth,
          },
        });

        // Create a fresh quota entry with zero count
        await db.quota.create({
          data: {
            userId,
            year: currentYear,
            month: currentMonth,
            count: 0,
          },
        });

        return c.superjson({
          success: true,
          message: "Monthly quota has been reset",
        });
      } catch (error) {
        throw new HTTPException(500, { 
          message: "Failed to reset monthly quota" 
        });
      }
    }),
}); 