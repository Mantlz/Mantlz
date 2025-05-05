import { z } from "zod";
import { j, privateProcedure } from "../jstack";
import { HTTPException } from "hono/http-exception";
import { db } from "@/lib/db";
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { CampaignEmail } from '@/emails/campaign-email';
import { getQuotaByPlan } from "@/config/usage";

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to check campaign feature access
async function checkCampaignAccess(userId: string, feature?: 'analytics' | 'scheduling' | 'templates' | 'customDomain') {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true }
  });

  if (!user) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  const quota = getQuotaByPlan(user.plan);

  if (!quota.campaigns.enabled) {
    throw new HTTPException(403, { message: 'Campaigns not available in your plan' });
  }

  if (feature && !quota.campaigns.features[feature]) {
    throw new HTTPException(403, { message: `${feature} feature not available in your plan` });
  }

  return quota;
}

// Helper to check campaign limits
async function checkCampaignLimits(userId: string, recipientCount: number) {
  const quota = await checkCampaignAccess(userId);

  // Check recipient limit
  if (recipientCount > quota.campaigns.maxRecipientsPerCampaign) {
    throw new HTTPException(403, { 
      message: `Recipient count exceeds plan limit of ${quota.campaigns.maxRecipientsPerCampaign}` 
    });
  }

  // Check monthly campaign limit
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const campaignCount = await db.campaign.count({
    where: {
      userId,
      createdAt: {
        gte: thisMonth
      }
    }
  });

  if (campaignCount >= quota.campaigns.maxCampaignsPerMonth) {
    throw new HTTPException(403, { 
      message: `Monthly campaign limit of ${quota.campaigns.maxCampaignsPerMonth} reached` 
    });
  }
}

// Helper to update quota metrics
async function updateQuotaMetrics(userId: string, updates: {
  incrementCampaigns?: boolean;
  incrementEmails?: number;
  incrementOpens?: number;
  incrementClicks?: number;
}) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Get or create quota for current month
  let quota = await db.quota.findFirst({
    where: {
      userId,
      year: currentYear,
      month: currentMonth
    }
  });

  if (!quota) {
    quota = await db.quota.create({
      data: {
        userId,
        year: currentYear,
        month: currentMonth,
        submissionCount: 0,
        formCount: 0,
        campaignCount: 0,
        emailsSent: 0,
        emailsOpened: 0,
        emailsClicked: 0
      }
    });
  }

  // Update metrics
  await db.quota.update({
    where: { id: quota.id },
    data: {
      campaignCount: updates.incrementCampaigns 
        ? { increment: 1 }
        : undefined,
      emailsSent: updates.incrementEmails 
        ? { increment: updates.incrementEmails }
        : undefined,
      emailsOpened: updates.incrementOpens
        ? { increment: updates.incrementOpens }
        : undefined,
      emailsClicked: updates.incrementClicks
        ? { increment: updates.incrementClicks }
        : undefined
    }
  });
}

// Campaign schema
const campaignSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  formId: z.string(),
  subject: z.string().min(1),
  content: z.string().min(1),
  scheduledAt: z.date().optional(),
});

// Recipient settings schema
const recipientSettingsSchema = z.object({
  type: z.enum(['first', 'last', 'custom']),
  count: z.number().min(1).max(200)
});

// Send campaign schema
const sendCampaignSchema = z.object({
  campaignId: z.string(),
  recipientSettings: recipientSettingsSchema
});

// Unsubscribe schema
const unsubscribeSchema = z.object({
  email: z.string().email(),
  formId: z.string(),
});

export const campaignRouter = j.router({
  // Create a new campaign
  create: privateProcedure
    .input(campaignSchema)
    .mutation(async ({ c, input, ctx }) => {
      await checkCampaignAccess(ctx.user.id);
      await checkCampaignLimits(ctx.user.id, 1); // Check campaign limits before creation
      
      const { formId, ...campaignData } = input;
      
      // Verify form ownership
      const form = await db.form.findUnique({
        where: {
          id: formId,
          userId: ctx.user.id,
        },
        include: {
          emailSettings: true,
        }
      });

      if (!form) {
        throw new HTTPException(404, { message: 'Form not found' });
      }

      // Create the campaign
      const campaign = await db.campaign.create({
        data: {
          ...campaignData,
          formId,
          userId: ctx.user.id,
          status: 'DRAFT',
        },
      });

      // Update quota for campaign creation
      await updateQuotaMetrics(ctx.user.id, { incrementCampaigns: true });

      return c.superjson({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
      });
    }),

  // Get all campaigns for a form
  getFormCampaigns: privateProcedure
    .input(z.object({
      formId: z.string(),
    }))
    .query(async ({ c, input, ctx }) => {
      const { formId } = input;
      
      const campaigns = await db.campaign.findMany({
        where: {
          formId,
          userId: ctx.user.id,
        },
        include: {
          _count: {
            select: {
              sentEmails: {
                where: {
                  isTest: false // Only count non-test emails
                }
              }
            },
          },
          form: {
            include: {
              _count: {
                select: {
                  submissions: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Get unsubscribed count
      const unsubscribedCount = await db.submission.count({
        where: {
          formId,
          unsubscribed: true,
        },
      });

      // Add unsubscribed count to each campaign's form
      campaigns.forEach(campaign => {
        if (campaign.form) {
          campaign.form._count = {
            ...campaign.form._count,
            unsubscribed: unsubscribedCount,
          } as { submissions: number; unsubscribed: number };
        }
      });

      return c.superjson(campaigns);
    }),

  // Send a campaign
  send: privateProcedure
    .input(sendCampaignSchema)
    .mutation(async ({ c, input, ctx }) => {
      const { campaignId, recipientSettings } = input;
      
      await checkCampaignLimits(ctx.user.id, recipientSettings.count);
      
      // Get campaign with form details
      const campaign = await db.campaign.findFirst({
        where: {
          id: campaignId,
          userId: ctx.user.id,
          status: 'DRAFT', // Only draft campaigns can be sent
        },
        include: {
          form: {
            include: {
              emailSettings: true,
              submissions: {
                where: {
                  email: { not: null },
                  unsubscribed: false
                },
                orderBy: recipientSettings.type === 'last' 
                  ? { createdAt: 'desc' }
                  : { createdAt: 'asc' },
                take: recipientSettings.count,
                select: {
                  id: true,
                  email: true
                }
              }
            }
          }
        }
      });

      if (!campaign) {
        throw new HTTPException(404, { message: 'Campaign not found or cannot be sent' });
      }

      // Store selected recipients and update campaign in a transaction
      await db.$transaction([
        // Store recipient list
        ...campaign.form.submissions.map(submission => 
          db.campaignRecipient.create({
            data: {
              campaignId,
              submissionId: submission.id,
              email: submission.email!,
              status: 'PENDING'
            }
          })
        ),

        // Update campaign status and recipient count
        db.campaign.update({
          where: { id: campaignId },
          data: {
            status: 'SENDING',
            recipientCount: recipientSettings.count
          }
        })
      ]);

      // Send emails to each recipient
      const sentEmails = [];
      const failedEmails = [];

      const recipients = await db.campaignRecipient.findMany({
        where: {
          campaignId,
          status: 'PENDING'
        },
        include: {
          submission: true
        }
      });

      for (const recipient of recipients) {
        try {
          // Create sent email record first
          const sentEmail = await db.sentEmail.create({
            data: {
              campaignId,
              submissionId: recipient.submissionId,
              status: 'SENT',
            },
          });

          // Create unsubscribe link
          const unsubscribeLink = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(recipient.email)}&formId=${campaign.formId}&campaignId=${campaignId}`;
          
          // Create tracking pixel URL
          const trackingPixelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/tracking/open?sentEmailId=${sentEmail.id}`;
          
          // Create click tracking URL
          const clickTrackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/tracking/click?sentEmailId=${sentEmail.id}`;
        
          // Render the email with tracking using BrandedEmailTemplate
          const emailHtml = await render(
            CampaignEmail({
              subject: campaign.subject,
              previewText: campaign.description || campaign.subject,
              content: campaign.content,
              ctaText: "Unsubscribe",
              ctaUrl: unsubscribeLink,
              trackingPixelUrl,
              clickTrackingUrl,
            })
          );
          
          // Send email
          await resend.emails.send({
            from: campaign.form.emailSettings?.fromEmail || 'contact@mantlz.app',
            to: recipient.email,
            subject: campaign.subject,
            html: emailHtml,
          });

          // Update recipient status
          await db.campaignRecipient.update({
            where: { id: recipient.id },
            data: { 
              status: 'SENT',
              sentAt: new Date()
            }
          });

          sentEmails.push(sentEmail);
        } catch (error) {
          // Create failed email record
          const failedEmail = await db.sentEmail.create({
            data: {
              campaignId,
              submissionId: recipient.submissionId,
              status: 'FAILED',
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          });

          // Update recipient status
          await db.campaignRecipient.update({
            where: { id: recipient.id },
            data: { 
              status: 'FAILED',
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          });

          failedEmails.push(failedEmail);
        }
      }

      // Update campaign status
      await db.campaign.update({
        where: { id: campaignId },
        data: { 
          status: failedEmails.length === recipients.length ? 'FAILED' : 'SENT',
          sentAt: new Date(),
        },
      });

      // After sending emails successfully
      await updateQuotaMetrics(ctx.user.id, { 
        incrementEmails: sentEmails.length 
      });

      return c.superjson({
        success: true,
        sentCount: sentEmails.length,
        failedCount: failedEmails.length,
      });
    }),

  // Handle unsubscribe
  unsubscribe: privateProcedure
    .input(unsubscribeSchema)
    .mutation(async ({ c, input }) => {
      const { email, formId } = input;
      
      // Create unsubscribe record
      await db.submission.updateMany({
        where: {
          formId,
          email,
        },
        data: {
          unsubscribed: true,
        },
      });

      return c.superjson({
        success: true,
        message: 'Successfully unsubscribed',
      });
    }),

  // Get campaign statistics (Pro feature)
  getStats: privateProcedure
    .input(z.object({
      campaignId: z.string(),
    }))
    .query(async ({ c, input, ctx }) => {
      await checkCampaignAccess(ctx.user.id, 'analytics');
      
      const { campaignId } = input;
      
      const stats = await db.campaign.findUnique({
        where: {
          id: campaignId,
          userId: ctx.user.id,
        },
        include: {
          _count: {
            select: {
              sentEmails: true,
            },
          },
          sentEmails: {
            select: {
              status: true,
              openCount: true,
              clickCount: true,
              bounced: true,
              spamReported: true,
              openedAt: true,
              clickedAt: true,
            },
          },
        },
      });

      if (!stats) {
        throw new HTTPException(404, { message: 'Campaign not found' });
      }

      const totalOpens = stats.sentEmails.reduce((sum, email) => sum + (email.openCount || 0), 0);
      const totalClicks = stats.sentEmails.reduce((sum, email) => sum + (email.clickCount || 0), 0);
      const uniqueOpens = stats.sentEmails.filter(e => e.openedAt).length;
      const uniqueClicks = stats.sentEmails.filter(e => e.clickedAt).length;
      const bounces = stats.sentEmails.filter(e => e.bounced).length;
      const spamReports = stats.sentEmails.filter(e => e.spamReported).length;

      return c.superjson({
        sentCount: stats._count.sentEmails,
        totalOpens,
        totalClicks,
        uniqueOpens,
        uniqueClicks,
        bounces,
        spamReports,
        openRate: stats._count.sentEmails ? (uniqueOpens / stats._count.sentEmails) * 100 : 0,
        clickRate: stats._count.sentEmails ? (uniqueClicks / stats._count.sentEmails) * 100 : 0,
        bounceRate: stats._count.sentEmails ? (bounces / stats._count.sentEmails) * 100 : 0,
      });
    }),

  // Delete a campaign
  delete: privateProcedure
    .input(z.object({
      campaignId: z.string(),
    }))
    .mutation(async ({ c, input, ctx }) => {
      const { campaignId } = input;
      
      try {
        // First verify the user owns this campaign
        const campaign = await db.campaign.findFirst({
          where: {
            id: campaignId,
            userId: ctx.user.id,
          },
        });

        if (!campaign) {
          throw new HTTPException(404, { message: 'Campaign not found or you do not have permission to delete it' });
        }

        // Delete everything in a transaction to ensure data consistency
        await db.$transaction([
          // 1. Delete sent emails first
          db.sentEmail.deleteMany({
            where: { campaignId }
          }),

          // 2. Finally delete the campaign itself
          db.campaign.delete({
            where: {
              id: campaignId,
              userId: ctx.user.id,
            },
          })
        ]);

        return c.superjson({ success: true });
      } catch (error) {
        console.error('Error deleting campaign:', error);
        throw new HTTPException(500, { message: 'Failed to delete campaign' });
      }
    }),

  // Schedule a campaign (Standard & Pro feature)
  schedule: privateProcedure
    .input(z.object({
      campaignId: z.string(),
      scheduleDate: z.string(),
      recipientSettings: z.object({
        type: z.enum(['first', 'last', 'custom']),
        count: z.number().min(1).max(200)
      })
    }))
    .mutation(async ({ c, input, ctx }) => {
      await checkCampaignAccess(ctx.user.id, 'scheduling');
      await checkCampaignLimits(ctx.user.id, input.recipientSettings.count);
      
      const { campaignId, scheduleDate, recipientSettings } = input;
      
      // Verify campaign ownership and status
      const campaign = await db.campaign.findFirst({
        where: {
          id: campaignId,
          userId: ctx.user.id,
          status: 'DRAFT', // Only draft campaigns can be scheduled
        },
        include: {
          form: {
            include: {
              submissions: {
                where: {
                  email: { not: null },
                  unsubscribed: false
                },
                orderBy: recipientSettings.type === 'last' 
                  ? { createdAt: 'desc' }
                  : { createdAt: 'asc' },
                take: recipientSettings.count,
                select: {
                  id: true,
                  email: true
                }
              }
            }
          }
        }
      });

      if (!campaign) {
        throw new HTTPException(404, { message: 'Campaign not found or cannot be scheduled' });
      }

      // Ensure schedule date is in the future
      const scheduleDateObj = new Date(scheduleDate);
      if (scheduleDateObj <= new Date()) {
        throw new HTTPException(400, { message: 'Schedule date must be in the future' });
      }

      // Store selected recipients
      await db.$transaction([
        // Store recipient list
        ...campaign.form.submissions.map(submission => 
          db.campaignRecipient.create({
            data: {
              campaignId,
              submissionId: submission.id,
              email: submission.email!,
              status: 'PENDING'
            }
          })
        ),

        // Update campaign status and schedule
        db.campaign.update({
          where: { id: campaignId },
          data: {
            status: 'SCHEDULED',
            scheduledAt: scheduleDateObj,
            recipientCount: recipientSettings.count
          }
        })
      ]);

      return c.superjson({ success: true });
    }),

  // Cancel scheduled campaign
  cancelSchedule: privateProcedure
    .input(z.object({
      campaignId: z.string(),
    }))
    .mutation(async ({ c, input, ctx }) => {
      const { campaignId } = input;
      
      // Verify campaign ownership and status
      const campaign = await db.campaign.findFirst({
        where: {
          id: campaignId,
          userId: ctx.user.id,
          status: 'SCHEDULED', // Only scheduled campaigns can be cancelled
        },
      });

      if (!campaign) {
        throw new HTTPException(404, { message: 'Scheduled campaign not found' });
      }

      // Update campaign back to draft status
      await db.campaign.update({
        where: { id: campaignId },
        data: {
          status: 'DRAFT',
          scheduledAt: null,
        },
      });

      return c.superjson({
        success: true,
      });
    }),

  // Track email open
  trackOpen: privateProcedure
    .input(z.object({
      sentEmailId: z.string(),
    }))
    .mutation(async ({ c, input, ctx }) => {
      const sentEmail = await db.sentEmail.findUnique({
        where: { id: input.sentEmailId },
        include: { campaign: true }
      });

      if (!sentEmail || sentEmail.campaign.userId !== ctx.user.id) {
        throw new HTTPException(404, { message: 'Email not found' });
      }

      // Update quota for email open
      await updateQuotaMetrics(ctx.user.id, { incrementOpens: 1 });

      return c.superjson({ success: true });
    }),

  // Track email click
  trackClick: privateProcedure
    .input(z.object({
      sentEmailId: z.string(),
    }))
    .mutation(async ({ c, input, ctx }) => {
      const sentEmail = await db.sentEmail.findUnique({
        where: { id: input.sentEmailId },
        include: { campaign: true }
      });

      if (!sentEmail || sentEmail.campaign.userId !== ctx.user.id) {
        throw new HTTPException(404, { message: 'Email not found' });
      }

      // Update quota for email click
      await updateQuotaMetrics(ctx.user.id, { incrementClicks: 1 });

      return c.superjson({ success: true });
    }),
}); 