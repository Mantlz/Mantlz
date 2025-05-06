import { db } from "@/lib/db";
import { render } from "@react-email/render";
import  {CampaignEmail}  from "@/emails/campaign-email";
import { sendEmail } from "@/services/email-service";

/**
 * Process scheduled campaigns that are due to be sent
 */
export async function processScheduledCampaigns() {
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
    for (const campaign of scheduledCampaigns) {
      try {
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
        console.error(`Error processing campaign ${campaign.id}:`, error);
        
        // Mark campaign as failed
        await db.campaign.update({
          where: { id: campaign.id },
          data: {
            status: "FAILED",
          }
        });
      }
    }

    console.log("Finished processing scheduled campaigns");
  } catch (error) {
    console.error("Error in processScheduledCampaigns:", error);
  }
} 