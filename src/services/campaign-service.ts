import { db } from "@/lib/db";
import { Resend } from 'resend';
import { render } from '@react-email/components';
import { CampaignEmail } from '@/emails/campaign-email';
import { startOfMonth } from "date-fns";
import { getQuotaByPlan } from "@/config/usage";
import { CampaignSendStatus, CampaignStatus, Prisma } from "@prisma/client";

const BATCH_SIZE = 50; // Send emails in batches to prevent rate limiting

/**
 * Creates a new campaign and populates recipients based on filter criteria
 */
export async function createCampaign(
  userId: string,
  formId: string,
  name: string,
  description: string | null,
  subject: string,
  content: string,
  senderEmail?: string,
  filterCriteria?: any
) {
  // Check user plan and limits
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const quota = getQuotaByPlan(user.plan);
  
  // Check if campaigns are enabled for this plan
  if (!quota.campaigns.enabled) {
    throw new Error("Email campaigns are not available on your current plan");
  }

  // For STANDARD plan, check monthly campaign limit
  if (user.plan === "STANDARD") {
    const currentDate = startOfMonth(new Date());
    const campaignCount = await db.campaign.count({
      where: {
        userId,
        createdAt: { gte: currentDate }
      }
    });

    if (campaignCount >= quota.campaigns.maxCampaignsPerMonth) {
      throw new Error(`Campaign limit reached (${campaignCount}/${quota.campaigns.maxCampaignsPerMonth}) for your plan`);
    }
  }

  // Check if PRO user is allowed to use custom sender email
  if (senderEmail && user.plan !== "PRO") {
    senderEmail = undefined; // Reset to default if not PRO
  }

  // Create campaign
  const campaign = await db.campaign.create({
    data: {
      name,
      description,
      subject,
      content,
      formId,
      userId,
      senderEmail,
      status: CampaignStatus.DRAFT,
      filterSettings: filterCriteria ? JSON.stringify(filterCriteria) : null,
    }
  });

  // Query submissions based on filter criteria
  let submissionsQuery: Prisma.SubmissionWhereInput = {
    formId,
    // Only include submissions with email
    email: { not: null }
  };

  // Apply additional filters if provided
  if (filterCriteria) {
    // Example filter logic - customize based on your needs
    if (filterCriteria.dateRange) {
      submissionsQuery.createdAt = {
        gte: new Date(filterCriteria.dateRange.start),
        lte: new Date(filterCriteria.dateRange.end)
      };
    }
    
    // Field-specific filters would be applied here
    // This would need custom logic based on your data structure
  }

  // Get submissions that match filter criteria
  const submissions = await db.submission.findMany({
    where: submissionsQuery,
    select: {
      id: true,
      email: true
    }
  });

  // Check recipient limit based on plan
  const recipientCount = submissions.length;
  if (recipientCount > quota.campaigns.maxRecipientsPerCampaign) {
    // Update campaign with warning
    await db.campaign.update({
      where: { id: campaign.id },
      data: {
        status: CampaignStatus.DRAFT,
        description: `${description || ""} [WARNING: Recipient count (${recipientCount}) exceeds plan limit (${quota.campaigns.maxRecipientsPerCampaign})]`
      }
    });
    
    throw new Error(`Recipient count (${recipientCount}) exceeds the limit for your plan (${quota.campaigns.maxRecipientsPerCampaign})`);
  }

  // Create campaign recipients
  const recipientData = submissions.map(submission => ({
    campaignId: campaign.id,
    submissionId: submission.id,
    email: submission.email as string,
    status: CampaignSendStatus.PENDING
  }));

  // Create recipients in batches to prevent DB issues with large sets
  const RECIPIENT_BATCH_SIZE = 500;
  for (let i = 0; i < recipientData.length; i += RECIPIENT_BATCH_SIZE) {
    const batch = recipientData.slice(i, i + RECIPIENT_BATCH_SIZE);
    await db.campaignRecipient.createMany({
      data: batch
    });
  }

  // Update campaign with recipient count
  await db.campaign.update({
    where: { id: campaign.id },
    data: { 
      description: `${description || ""} [Recipients: ${recipientCount}]`
    }
  });

  return {
    id: campaign.id,
    recipientCount
  };
}

/**
 * Sends a campaign to all recipients
 */
export async function sendCampaign(campaignId: string) {
  // Get campaign with form details
  const campaign = await db.campaign.findUnique({
    where: { id: campaignId },
    include: {
      form: {
        select: {
          name: true,
          emailSettings: true
        }
      },
      user: {
        select: {
          resendApiKey: true,
          plan: true
        }
      }
    }
  });

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  // Check if campaign is in draft status
  if (campaign.status !== CampaignStatus.DRAFT) {
    throw new Error(`Campaign cannot be sent because it has status: ${campaign.status}`);
  }

  // Get total recipients
  const totalRecipients = await db.campaignRecipient.count({
    where: { campaignId }
  });

  // Check if we have recipients
  if (totalRecipients === 0) {
    throw new Error("Campaign has no recipients");
  }

  // Check plan limits
  const quota = getQuotaByPlan(campaign.user.plan);
  if (totalRecipients > quota.campaigns.maxRecipientsPerCampaign) {
    throw new Error(`Recipient count (${totalRecipients}) exceeds the limit for your plan (${quota.campaigns.maxRecipientsPerCampaign})`);
  }

  // Mark campaign as sending
  await db.campaign.update({
    where: { id: campaignId },
    data: { status: CampaignStatus.SENDING }
  });

  // Validate Resend API key
  const resendApiKey = campaign.user.resendApiKey;
  if (!resendApiKey) {
    await db.campaign.update({
      where: { id: campaignId },
      data: { status: CampaignStatus.FAILED }
    });
    throw new Error("Resend API key is not configured");
  }

  // Initialize Resend client
  const resendClient = new Resend(resendApiKey);
  
  // Use custom sender email if set, otherwise fall back to default
  const fromEmail = campaign.senderEmail || 
                  campaign.form.emailSettings?.fromEmail || 
                  process.env.RESEND_FROM_EMAIL || 
                  'contact@mantlz.app';

  try {
    let successCount = 0;
    let failureCount = 0;
    let currentBatch = 0;

    // Process in batches to prevent rate limiting
    while (true) {
      // Get next batch of recipients
      const recipients = await db.campaignRecipient.findMany({
        where: {
          campaignId,
          status: CampaignSendStatus.PENDING
        },
        include: {
          submission: {
            select: {
              data: true,
              email: true
            }
          }
        },
        take: BATCH_SIZE,
        orderBy: {
          createdAt: 'asc'
        }
      });

      if (recipients.length === 0) {
        break; // No more recipients to process
      }

      // Send emails in parallel with rate limiting
      const results = await Promise.allSettled(
        recipients.map(async (recipient) => {
          try {
            // Render email with personalization
            const htmlContent = await render(
              CampaignEmail({
                subject: campaign.subject,
                content: campaign.content,
                formName: campaign.form.name,
                submissionData: recipient.submission.data as Record<string, unknown>,
                campaignId: campaign.id,
                unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/unsubscribe?campaignId=${campaign.id}&email=${encodeURIComponent(recipient.email)}`
              })
            );

            // Send email with custom or default sender
            await resendClient.emails.send({
              from: fromEmail,
              to: recipient.email,
              subject: campaign.subject,
              html: htmlContent,
              // Set tracking analytics
              tags: [
                { name: 'campaign_id', value: campaign.id },
                { name: 'recipient_id', value: recipient.id }
              ]
            });

            // Update recipient status
            await db.campaignRecipient.update({
              where: { id: recipient.id },
              data: { 
                status: CampaignSendStatus.SENT,
                sentAt: new Date()
              }
            });

            successCount++;
            return { success: true, id: recipient.id };
          } catch (error) {
            // Update recipient status with error
            await db.campaignRecipient.update({
              where: { id: recipient.id },
              data: { 
                status: CampaignSendStatus.FAILED,
                error: error instanceof Error ? error.message : 'Unknown error'
              }
            });

            failureCount++;
            return { success: false, id: recipient.id, error };
          }
        })
      );

      // Update campaign stats
      await db.campaign.update({
        where: { id: campaignId },
        data: { 
          sentCount: { increment: successCount }
        }
      });

      currentBatch++;
      
      // Simple pause between batches to prevent rate limiting
      if (recipients.length === BATCH_SIZE) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Update campaign status
    const finalStatus = failureCount === totalRecipients 
      ? CampaignStatus.FAILED 
      : failureCount > 0 
        ? CampaignStatus.SENT // Partial success
        : CampaignStatus.SENT; // Complete success
    
    await db.campaign.update({
      where: { id: campaignId },
      data: { status: finalStatus }
    });

    return {
      id: campaign.id,
      totalRecipients,
      successCount,
      failureCount,
      status: finalStatus
    };
  } catch (error) {
    // Update campaign with failure status
    await db.campaign.update({
      where: { id: campaignId },
      data: { status: CampaignStatus.FAILED }
    });

    throw error;
  }
}

/**
 * Get campaign statistics
 */
export async function getCampaignStats(campaignId: string) {
  const campaign = await db.campaign.findUnique({
    where: { id: campaignId },
    select: {
      id: true,
      name: true,
      subject: true,
      status: true,
      sentCount: true,
      openCount: true,
      clickCount: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  // Get recipient stats
  const stats = await db.campaignRecipient.groupBy({
    by: ['status'],
    where: { campaignId },
    _count: true
  });

  // Format stats into an easy-to-use object
  const recipientStats = stats.reduce((acc: Record<string, number>, curr) => {
    acc[curr.status] = curr._count;
    return acc;
  }, {});

  return {
    ...campaign,
    recipients: {
      total: Object.values(recipientStats).reduce((acc, count) => acc + count, 0),
      ...recipientStats
    }
  };
}

/**
 * Track email open
 */
export async function trackCampaignOpen(campaignId: string, recipientId: string) {
  // Update campaign recipient
  await db.campaignRecipient.update({
    where: { id: recipientId },
    data: {
      status: CampaignSendStatus.OPENED,
      openedAt: new Date()
    }
  });

  // Update campaign stats
  await db.campaign.update({
    where: { id: campaignId },
    data: {
      openCount: { increment: 1 }
    }
  });
}

/**
 * Track link click
 */
export async function trackCampaignClick(campaignId: string, recipientId: string) {
  // Update campaign recipient
  await db.campaignRecipient.update({
    where: { id: recipientId },
    data: {
      status: CampaignSendStatus.CLICKED,
      clickedAt: new Date()
    }
  });

  // Update campaign stats
  await db.campaign.update({
    where: { id: campaignId },
    data: {
      clickCount: { increment: 1 }
    }
  });
} 