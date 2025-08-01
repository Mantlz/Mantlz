'use server';

import { render } from '@react-email/render'
import { TestEmail } from '../emails/test-email'
import { sendEmail } from './email-service'
import { db } from '@/lib/db'
import { CampaignSendStatus, Prisma } from '@prisma/client'

/**
 * Response type for test email operations
 * @property success - indicates if the operation was successful
 * @property message - descriptive message of the operation result
 * @property testId - ID of the test email if successful
 * @property metadata - additional information about the test email
 */
interface TestEmailResponse {
  success: boolean
  message: string
  testId?: string
  metadata?: {
    recipientEmail: string
    sentAt: Date
    status: CampaignSendStatus
  }
}

/**
 * Options for sending a test email
 * @property campaignId - ID of the campaign to test
 * @property customTestData - optional custom data to include in the test
 */
interface TestEmailOptions {
  campaignId: string
  customTestData?: Prisma.JsonValue
}

/**
 * Send a test email for a campaign to the current user's email
 * @param options - Test email options including campaign ID and custom data
 * @returns Promise with test email response
 * @throws Error if email sending fails
 */
export async function sendTestEmail({ campaignId, customTestData }: TestEmailOptions): Promise<TestEmailResponse> {
  try {
    // Get campaign and user details
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
      include: {
        user: true,
        form: {
          include: {
            emailSettings: true
          }
        }
      }
    })

    if (!campaign?.user?.email) {
      return {
        success: false,
        message: "User email not found"
      }
    }

    // Determine sender email from campaign settings or environment variable
    const senderEmail = campaign.senderEmail || campaign.form.emailSettings?.fromEmail || process.env.DEFAULT_FROM_EMAIL

    if (!senderEmail) {
      return {
        success: false,
        message: "No sender email configured"
      }
    }

    // Get or create test submission with metadata
    const testSubmission = await db.testEmailSubmission.upsert({
      where: {
        formId_email: {
          formId: campaign.formId,
          email: campaign.user.email
        }
      },
      create: {
        formId: campaign.formId,
        email: campaign.user.email,
        data: {
          isTest: true,
          customData: customTestData || null,
          campaignMetadata: {
            campaignId: campaign.id,
            campaignName: campaign.name,
            subject: campaign.subject
          }
        }
      },
      update: {
        data: {
          isTest: true,
          customData: customTestData || null,
          campaignMetadata: {
            campaignId: campaign.id,
            campaignName: campaign.name,
            subject: campaign.subject
          }
        }
      }
    })

    // Create a test record
    const testEmail = await db.sentEmail.create({
      data: {
        campaignId,
        testSubmissionId: testSubmission.id,
        isTest: true,
        status: 'PENDING' as CampaignSendStatus
      }
    })

    // Generate tracking URLs
    const trackingPixelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/tracking/open?sentEmailId=${testEmail.id}`
    const clickTrackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/tracking/click?sentEmailId=${testEmail.id}`
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?formId=${campaign.formId}&email=${encodeURIComponent(campaign.user.email)}`

    // Render the test email
    const emailHtml = await Promise.resolve(render(
      TestEmail({
        trackingPixelUrl,
        clickTrackingUrl,
        unsubscribeUrl,
        campaignName: campaign.name,
        subject: campaign.subject,
        content: campaign.content
      })
    ))

    const now = new Date()

    // Send the test email
    await sendEmail({
      to: campaign.user.email,
      from: senderEmail,
      subject: `[TEST] ${campaign.subject}`,
      html: emailHtml,

    })

    // Update status to sent
    const updatedTestEmail = await db.sentEmail.update({
      where: { id: testEmail.id },
      data: {
        status: 'SENT' as CampaignSendStatus,
        updatedAt: now
      }
    })

    return {
      success: true,
      message: "Test email sent successfully",
      testId: testEmail.id,
      metadata: {
        recipientEmail: campaign.user.email,
        sentAt: now,
        status: updatedTestEmail.status
      }
    }
  } catch (error) {
    console.error("Error sending test email:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send test email"
    }
  }
}

/**
 * Get the status of a previously sent test email
 * @param testId - ID of the test email to check
 * @returns Promise with test email status and metadata
 * @throws Error if status retrieval fails
 */
export async function getTestEmailStatus(testId: string) {
  try {
    // Retrieve test email record
    const testEmail = await db.sentEmail.findUnique({
      where: { id: testId },
      include: {
        testSubmission: true,
        campaign: true
      }
    })

    if (!testEmail) {
      return {
        status: "error",
        error: "Test email not found"
      }
    }

    // Return test email status and metadata
    return {
      status: testEmail.status.toLowerCase(),
      error: testEmail.error,
      metadata: {
        sentAt: testEmail.createdAt,
        openedAt: testEmail.openedAt,
        clickedAt: testEmail.clickedAt,
        bounced: testEmail.bounced,
        bounceReason: testEmail.bounceReason,
        spamReported: testEmail.spamReported,
        recipientEmail: testEmail.testSubmission?.email,
        campaignName: testEmail.campaign?.name
      }
    }
  } catch (error) {
    console.error("Error getting test email status:", error)
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Failed to get test status"
    }
  }
}