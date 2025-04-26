import { z } from "zod";
import { j, privateProcedure } from "../jstack";
import { db } from "@/lib/db";
import { HTTPException } from "hono/http-exception";
import { CampaignStatus } from "@prisma/client";
import { getQuotaByPlan } from "@/config/usage";
import { startOfMonth } from "date-fns";
import { createCampaign, sendCampaign, getCampaignStats } from "@/services/campaign-service";

// Define schemas for validation
const createCampaignSchema = z.object({
  formId: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().optional().nullable(),
  subject: z.string().min(1).max(200),
  content: z.string().min(1),
  senderEmail: z.string().email().optional(),
  filterCriteria: z.any().optional(),
});

const sendCampaignSchema = z.object({
  campaignId: z.string(),
});

const getCampaignSchema = z.object({
  campaignId: z.string(),
});

const listCampaignsSchema = z.object({
  formId: z.string().optional(),
  limit: z.number().min(1).max(100).default(10),
  cursor: z.string().optional(),
  status: z.enum([
    "DRAFT", 
    "SCHEDULED", 
    "SENDING", 
    "SENT", 
    "FAILED", 
    "CANCELLED"
  ]).optional(),
});

export const campaignRouter = j.router({
  // Create a new campaign
  create: privateProcedure
    .input(createCampaignSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx;
      if (!user) throw new HTTPException(401, { message: "Unauthorized" });

      // Check if the user owns the form
      const form = await db.form.findFirst({
        where: {
          id: input.formId,
          userId: user.id,
        },
      });

      if (!form) {
        throw new HTTPException(404, { message: "Form not found or you don't have access to it" });
      }

      try {
        // Use the campaign service to create the campaign
        const result = await createCampaign(
          user.id,
          input.formId,
          input.name,
          input.description || null,
          input.subject,
          input.content,
          input.senderEmail,
          input.filterCriteria
        );

        return c.superjson(result);
      } catch (error) {
        if (error instanceof Error) {
          throw new HTTPException(400, { message: error.message });
        }
        throw new HTTPException(500, { message: "Failed to create campaign" });
      }
    }),

  // Send a campaign
  send: privateProcedure
    .input(sendCampaignSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx;
      if (!user) throw new HTTPException(401, { message: "Unauthorized" });

      // Check if the user owns the campaign
      const campaign = await db.campaign.findFirst({
        where: {
          id: input.campaignId,
          userId: user.id,
        },
      });

      if (!campaign) {
        throw new HTTPException(404, { message: "Campaign not found or you don't have access to it" });
      }

      try {
        // Use the campaign service to send the campaign
        const result = await sendCampaign(input.campaignId);
        return c.superjson(result);
      } catch (error) {
        if (error instanceof Error) {
          throw new HTTPException(400, { message: error.message });
        }
        throw new HTTPException(500, { message: "Failed to send campaign" });
      }
    }),

  // Get a single campaign with stats
  get: privateProcedure
    .input(getCampaignSchema)
    .query(async ({ c, ctx, input }) => {
      const { user } = ctx;
      if (!user) throw new HTTPException(401, { message: "Unauthorized" });

      try {
        // Check if the user owns the campaign
        const campaign = await db.campaign.findFirst({
          where: {
            id: input.campaignId,
            userId: user.id,
          },
          include: {
            form: {
              select: {
                id: true,
                name: true
              }
            }
          }
        });

        if (!campaign) {
          throw new HTTPException(404, { message: "Campaign not found or you don't have access to it" });
        }

        // Get campaign stats
        const stats = await getCampaignStats(input.campaignId);
        
        return c.superjson({
          ...campaign,
          stats
        });
      } catch (error) {
        if (error instanceof Error) {
          throw new HTTPException(400, { message: error.message });
        }
        throw new HTTPException(500, { message: "Failed to get campaign" });
      }
    }),

  // List campaigns with pagination
  list: privateProcedure
    .input(listCampaignsSchema)
    .query(async ({ c, ctx, input }) => {
      const { user } = ctx;
      if (!user) throw new HTTPException(401, { message: "Unauthorized" });

      try {
        // Build the where clause
        const where: any = {
          userId: user.id,
        };

        // Filter by form if provided
        if (input.formId) {
          where.formId = input.formId;
        }

        // Filter by status if provided
        if (input.status) {
          where.status = input.status;
        }

        // Add cursor condition if provided
        if (input.cursor) {
          where.id = {
            lt: input.cursor // 'lt' for descending order (newest first)
          };
        }

        // Get campaigns
        const campaigns = await db.campaign.findMany({
          where,
          take: input.limit,
          orderBy: {
            createdAt: 'desc' // Newest first
          },
          include: {
            form: {
              select: {
                name: true
              }
            },
            _count: {
              select: {
                recipients: true
              }
            }
          }
        });

        // Get next cursor
        const nextCursor = campaigns.length === input.limit 
          ? campaigns[campaigns.length - 1]?.id 
          : undefined;

        return c.superjson({
          campaigns,
          nextCursor
        });
      } catch (error) {
        throw new HTTPException(500, { message: "Failed to list campaigns" });
      }
    }),

  // Delete a campaign
  delete: privateProcedure
    .input(getCampaignSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx;
      if (!user) throw new HTTPException(401, { message: "Unauthorized" });

      // Check if the user owns the campaign
      const campaign = await db.campaign.findFirst({
        where: {
          id: input.campaignId,
          userId: user.id,
        },
      });

      if (!campaign) {
        throw new HTTPException(404, { message: "Campaign not found or you don't have access to it" });
      }

      // Can't delete a campaign that's currently being sent
      if (campaign.status === CampaignStatus.SENDING) {
        throw new HTTPException(400, { message: "Can't delete a campaign that's currently being sent" });
      }

      try {
        // Delete all recipients first (to avoid foreign key constraint errors)
        await db.campaignRecipient.deleteMany({
          where: { campaignId: input.campaignId }
        });

        // Delete the campaign
        await db.campaign.delete({
          where: { id: input.campaignId }
        });

        return c.superjson({ success: true });
      } catch (error) {
        throw new HTTPException(500, { message: "Failed to delete campaign" });
      }
    }),

  // Check user's campaign eligibility and limits
  checkEligibility: privateProcedure
    .query(async ({ c, ctx }) => {
      const { user } = ctx;
      if (!user) throw new HTTPException(401, { message: "Unauthorized" });

      // Get user's plan and quota
      const userWithPlan = await db.user.findUnique({
        where: { id: user.id },
        select: { plan: true }
      });

      if (!userWithPlan) {
        throw new HTTPException(404, { message: "User not found" });
      }

      const quota = getQuotaByPlan(userWithPlan.plan);
      
      // Check if campaigns are enabled for this plan
      if (!quota.campaigns.enabled) {
        return c.superjson({
          eligible: false,
          reason: "PLAN_RESTRICTION",
          plan: userWithPlan.plan,
          limits: quota.campaigns
        });
      }

      // For STANDARD plan, check monthly usage
      let usageData = {};
      if (userWithPlan.plan === "STANDARD") {
        const currentDate = startOfMonth(new Date());
        const campaignCount = await db.campaign.count({
          where: {
            userId: user.id,
            createdAt: { gte: currentDate }
          }
        });

        usageData = {
          used: campaignCount,
          limit: quota.campaigns.maxCampaignsPerMonth,
          remaining: Math.max(0, quota.campaigns.maxCampaignsPerMonth - campaignCount)
        };
      }

      return c.superjson({
        eligible: true,
        plan: userWithPlan.plan,
        limits: quota.campaigns,
        usage: usageData
      });
    }),
}); 