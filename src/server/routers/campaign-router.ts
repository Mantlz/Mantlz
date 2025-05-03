import { z } from "zod";
import { j, privateProcedure } from "../jstack";
import { HTTPException } from "hono/http-exception";
import { db } from "@/lib/db";
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { CampaignEmail } from '@/emails/campaign-email';

const resend = new Resend(process.env.RESEND_API_KEY);

// Campaign schema
const campaignSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  formId: z.string(),
  subject: z.string().min(1),
  content: z.string().min(1),
  scheduledAt: z.date().optional(),
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
              sentEmails: true,
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
          };
        }
      });

      return c.superjson(campaigns);
    }),

  // Send a campaign
  send: privateProcedure
    .input(z.object({
      campaignId: z.string(),
    }))
    .mutation(async ({ c, input, ctx }) => {
      const { campaignId } = input;
      
      // Get campaign with form and submissions
      const campaign = await db.campaign.findUnique({
        where: {
          id: campaignId,
          userId: ctx.user.id,
        },
        include: {
          form: {
            include: {
              emailSettings: true,
              submissions: {
                where: {
                  email: {
                    not: null,
                  },
                  unsubscribed: false,
                },
                select: {
                  id: true,
                  email: true,
                  data: true,
                },
              },
            },
          },
        },
      });

      if (!campaign) {
        throw new HTTPException(404, { message: 'Campaign not found' });
      }

      // Update campaign status to sending
      await db.campaign.update({
        where: { id: campaignId },
        data: { status: 'SENDING' },
      });

      // Send emails to each submission
      const sentEmails = [];
      const failedEmails = [];

      for (const submission of campaign.form.submissions) {
        try {
          // Create sent email record first
          const sentEmail = await db.sentEmail.create({
            data: {
              campaignId,
              submissionId: submission.id,
              status: 'SENT',
            },
          });

          // Create unsubscribe link
          const unsubscribeLink = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(submission.email!)}&formId=${campaign.formId}&campaignId=${campaignId}`;
          
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
            to: submission.email!,
            subject: campaign.subject,
            html: emailHtml,
          });

          sentEmails.push(sentEmail);
        } catch (error) {
          // Create failed email record
          const failedEmail = await db.sentEmail.create({
            data: {
              campaignId,
              submissionId: submission.id,
              status: 'FAILED',
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          });

          failedEmails.push(failedEmail);
        }
      }

      // Update campaign status
      await db.campaign.update({
        where: { id: campaignId },
        data: { 
          status: 'SENT',
          sentAt: new Date(),
        },
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

  // Get campaign statistics
  getStats: privateProcedure
    .input(z.object({
      campaignId: z.string(),
    }))
    .query(async ({ c, input, ctx }) => {
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
            },
          },
        },
      });

      if (!stats) {
        throw new HTTPException(404, { message: 'Campaign not found' });
      }

      const sentCount = stats._count.sentEmails;
      const failedCount = stats.sentEmails.filter(e => e.status === 'FAILED').length;
      const successCount = stats.sentEmails.filter(e => e.status === 'SENT').length;

      return c.superjson({
        sentCount,
        failedCount,
        successCount,
        openRate: 0, // TODO: Implement email tracking
        clickRate: 0, // TODO: Implement email tracking
      });
    }),
}); 