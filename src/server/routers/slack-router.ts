import { z } from "zod";
import { j, privateProcedure } from "../jstack";
import { db } from "@/lib/db";
import { SlackService } from "@/services/slack-service";
import { HTTPException } from "hono/http-exception";

// Helper function to check if user has premium access
const checkPremiumAccess = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true }
  });

  if (!user || (user.plan !== 'STANDARD' && user.plan !== 'PRO')) {
    throw new HTTPException(403, { message: "This feature requires a Standard or Pro plan" });
  }
};

export const slackRouter = j.router({
  // Get Slack configuration
  getConfig: privateProcedure.query(async ({ c, ctx }) => {
    try {
      await checkPremiumAccess(ctx.user.id);

      const config = await db.slackConfig.findUnique({
        where: { userId: ctx.user.id },
      });

      return c.superjson(config);
    } catch (error) {
      console.error("Error fetching Slack config:", error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "Failed to fetch Slack configuration" });
    }
  }),

  // Update Slack configuration
  updateConfig: privateProcedure
    .input(
      z.object({
        enabled: z.boolean(),
        webhookUrl: z.string().url(),
        channel: z.string().optional(),
      })
    )
    .mutation(async ({ c, input, ctx }) => {
      try {
        await checkPremiumAccess(ctx.user.id);

        // Test webhook before saving if enabled
        if (input.enabled) {
          const slackService = SlackService.getInstance();
          const isValid = await slackService.testWebhook({
            webhookUrl: input.webhookUrl,
            channel: input.channel,
          });

          if (!isValid) {
            throw new HTTPException(400, { message: "Invalid webhook URL" });
          }
        }

        // Update or create config
        const config = await db.slackConfig.upsert({
          where: { userId: ctx.user.id },
          update: {
            enabled: input.enabled,
            webhookUrl: input.webhookUrl,
            channel: input.channel,
          },
          create: {
            userId: ctx.user.id,
            enabled: input.enabled,
            webhookUrl: input.webhookUrl,
            channel: input.channel,
          },
        });

        return c.superjson(config);
      } catch (error) {
        console.error("Error updating Slack config:", error);
        if (error instanceof HTTPException) throw error;
        throw new HTTPException(500, { message: "Failed to update Slack configuration" });
      }
    }),

  // Test webhook
  testWebhook: privateProcedure
    .input(
      z.object({
        webhookUrl: z.string().url(),
        channel: z.string().optional(),
      })
    )
    .mutation(async ({ c, input, ctx }) => {
      try {
        await checkPremiumAccess(ctx.user.id);

        const slackService = SlackService.getInstance();
        const success = await slackService.testWebhook({
          webhookUrl: input.webhookUrl,
          channel: input.channel,
        });

        return c.superjson({ success });
      } catch (error) {
        console.error("Error testing Slack webhook:", error);
        if (error instanceof HTTPException) throw error;
        throw new HTTPException(500, { message: "Failed to test Slack webhook" });
      }
    }),
}); 