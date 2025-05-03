import { z } from "zod";
import { j, publicProcedure } from "../jstack";
import { HTTPException } from "hono/http-exception";
import { EmailTrackingService } from "@/services/email-tracking-service";
import { db } from "@/lib/db";

export const trackingRouter = j.router({
  // Track email open
  trackOpen: publicProcedure
    .input(z.object({
      sentEmailId: z.string(),
    }))
    .mutation(async ({ c, input }) => {
      try {
        await EmailTrackingService.trackEmailOpen(input);
        return c.superjson({ success: true });
      } catch (error) {
        console.error('Error tracking email open:', error);
        throw new HTTPException(500, { message: 'Failed to track email open' });
      }
    }),

  // Track email click
  trackClick: publicProcedure
    .input(z.object({
      sentEmailId: z.string(),
    }))
    .mutation(async ({ c, input }) => {
      try {
        await EmailTrackingService.trackEmailClick(input);
        return c.superjson({ success: true });
      } catch (error) {
        console.error('Error tracking email click:', error);
        throw new HTTPException(500, { message: 'Failed to track email click' });
      }
    }),

  // Track email bounce
  trackBounce: publicProcedure
    .input(z.object({
      sentEmailId: z.string(),
      bounceType: z.enum(['HARD', 'SOFT', 'BLOCKED']),
      bounceReason: z.string(),
    }))
    .mutation(async ({ c, input }) => {
      try {
        await EmailTrackingService.trackBounce(input);
        return c.superjson({ success: true });
      } catch (error) {
        console.error('Error tracking email bounce:', error);
        throw new HTTPException(500, { message: 'Failed to track email bounce' });
      }
    }),

  // Track spam report
  trackSpamReport: publicProcedure
    .input(z.object({
      sentEmailId: z.string(),
    }))
    .mutation(async ({ c, input }) => {
      try {
        await EmailTrackingService.trackSpamReport(input);
        return c.superjson({ success: true });
      } catch (error) {
        console.error('Error tracking spam report:', error);
        throw new HTTPException(500, { message: 'Failed to track spam report' });
      }
    }),

  // Get campaign analytics
  getCampaignAnalytics: publicProcedure
    .input(z.object({
      campaignId: z.string(),
    }))
    .query(async ({ c, input }) => {
      try {
        // Verify campaign exists
        const campaign = await db.campaign.findUnique({
          where: { id: input.campaignId }
        });

        if (!campaign) {
          throw new HTTPException(404, { message: 'Campaign not found' });
        }

        const analytics = await EmailTrackingService.getCampaignAnalytics(input.campaignId);
        return c.superjson(analytics);
      } catch (error) {
        console.error('Error getting campaign analytics:', error);
        throw new HTTPException(500, { message: 'Failed to get campaign analytics' });
      }
    }),
}); 