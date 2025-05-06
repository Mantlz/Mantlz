import { NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { render } from "@react-email/render";
import { CampaignEmail } from "@/emails/campaign-email";
import { sendEmail } from "@/services/email-service";

// Vercel Cron Job: This function will be called by Vercel's cron job scheduler
// See vercel.json configuration for the schedule
export async function GET() {
  try {
    console.log("Processing scheduled campaigns...");

    // Get current time
    const currentDate = new Date();

    // Find all campaigns that are scheduled to be sent now or in the past
    const scheduledCampaigns = await db.campaign.findMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: {
          lte: currentDate, // Less than or equal to current time
        },
      },
      include: {
        recipients: {
          where: {
            status: "PENDING"
          },
          include: {
            submission: true
          }
        },
        form: {
          include: {
            emailSettings: true
          }
        }
      }
    });

    console.log(`Found ${scheduledCampaigns.length} campaigns to process`);

    // Process each campaign
    for (const campaignData of scheduledCampaigns) {
      try {
        let campaign = {...campaignData};
        console.log(`Campaign ${campaign.id} has ${campaign.recipients.length} recipients`);
        
        // If no recipients, try to fetch and set them from the form
        if (campaign.recipients.length === 0) {
          console.log(`No recipients found for campaign ${campaign.id}, attempting to set them now...`);
          
          // Fetch form submissions to use as recipients
          const formSubmissions = await db.submission.findMany({
            where: {
              formId: campaign.formId,
              email: { not: null },
              unsubscribed: false
            },
            take: campaign.recipientCount > 0 ? campaign.recipientCount : 100,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              email: true
            }
          });
          
          console.log(`Found ${formSubmissions.length} potential recipients from form submissions`);
          
          if (formSubmissions.length > 0) {
            // Create recipients for the campaign
            const recipientOperations = formSubmissions.map(submission => 
              db.campaignRecipient.create({
                data: {
                  campaignId: campaign.id,
                  submissionId: submission.id,
                  email: submission.email!,
                  status: 'PENDING'
                }
              })
            );
            
            await db.$transaction(recipientOperations);
            
            // Refresh campaign with new recipients
            const updatedCampaign = await db.campaign.findFirst({
              where: { id: campaign.id },
              include: {
                recipients: {
                  where: { status: "PENDING" },
                  include: { submission: true }
                },
                form: {
                  include: { emailSettings: true }
                }
              }
            });
            
            if (updatedCampaign) {
              console.log(`Added ${updatedCampaign.recipients.length} recipients to campaign ${campaign.id}`);
              campaign = updatedCampaign;
            }
          }
        }
        
        // Update campaign status to SENDING
        await db.campaign.update({
          where: { id: campaign.id },
          data: {
            status: "SENDING",
          }
        });

        console.log(`Processing campaign: ${campaign.id} - ${campaign.name}`);
        
        // Process each recipient
        const sentEmails = [];
        const failedEmails = [];

        for (const recipient of campaign.recipients) {
          try {
            console.log(`Sending email to recipient: ${recipient.email}`);
            
            // Create sent email record
            const sentEmail = await db.sentEmail.create({
              data: {
                campaignId: campaign.id,
                submissionId: recipient.submissionId,
                status: "SENT",
              },
            });

            // Create unsubscribe link
            const unsubscribeLink = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(recipient.email)}&formId=${campaign.formId}&campaignId=${campaign.id}`;
            
            // Create tracking pixel URL
            const trackingPixelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/tracking/open?sentEmailId=${sentEmail.id}`;
            
            // Create click tracking URL
            const clickTrackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/tracking/click?sentEmailId=${sentEmail.id}`;
          
            // Render the email with tracking
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
            await sendEmail({
              from: campaign.form.emailSettings?.fromEmail || undefined,
              to: recipient.email,
              subject: campaign.subject,
              html: emailHtml,
            });

            // Update recipient status
            await db.campaignRecipient.update({
              where: { id: recipient.id },
              data: {
                status: "SENT",
                sentAt: new Date(),
              }
            });

            sentEmails.push(recipient.email);
            console.log(`Email sent successfully to ${recipient.email}`);
          } catch (error) {
            console.error(`Error sending to recipient ${recipient.email}:`, error);
            
            // Update recipient status as failed
            await db.campaignRecipient.update({
              where: { id: recipient.id },
              data: {
                status: "FAILED",
                error: error instanceof Error ? error.message : String(error)
              }
            });
            
            failedEmails.push(recipient.email);
          }
        }

        // Update campaign status based on results
        const allFailed = campaign.recipients.length > 0 && failedEmails.length === campaign.recipients.length;
        const status = allFailed ? "FAILED" : "SENT";

        await db.campaign.update({
          where: { id: campaign.id },
          data: {
            status,
            sentAt: new Date(),
          }
        });

        console.log(`Campaign ${campaign.id} processed: ${sentEmails.length} sent, ${failedEmails.length} failed`);
      } catch (error) {
        console.error(`Error processing campaign ${campaignData.id}:`, error);
        
        try {
          // Mark campaign as failed
          await db.campaign.update({
            where: { id: campaignData.id },
            data: {
              status: "FAILED",
            }
          });
        } catch (dbError) {
          console.error("Failed to update campaign status to FAILED:", dbError);
        }
      }
    }

    console.log("Finished processing scheduled campaigns");
    return NextResponse.json({ success: true, processed: scheduledCampaigns.length });
  } catch (error) {
    console.error("Error in processScheduledCampaigns:", error);
    return NextResponse.json({ error: "Failed to process scheduled campaigns" }, { status: 500 });
  }
} 