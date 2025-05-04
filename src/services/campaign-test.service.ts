'use server';

import { render } from '@react-email/render'
import { TestEmail } from '../emails/test-email'
import { sendEmail } from './email-service'
import { db } from '@/lib/db'
import { CampaignSendStatus } from '@prisma/client'

interface TestEmailResponse {
  success: boolean
  message: string
  testId?: string
}

interface TestEmailOptions {
  campaignId: string
}

/**
 * Send a test email for a campaign to the current user's email
 */
export async function sendTestEmail({ campaignId }: TestEmailOptions): Promise<TestEmailResponse> {
  try {
    // Get campaign and user details
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
      include: { user: true }
    })

    if (!campaign?.user?.email) {
      return {
        success: false,
        message: "User email not found"
      }
    }

    // Get or create test submission
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
        data: { isTest: true }
      },
      update: {
        data: { isTest: true }
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

    // Render the test email
    const emailHtml = await Promise.resolve(render(
      TestEmail({
        trackingPixelUrl,
        clickTrackingUrl
      })
    ))

    // Send the test email
    await sendEmail({
      to: campaign.user.email,
      subject: `[TEST] Campaign Preview`,
      html: emailHtml
    })

    // Update status to sent
    await db.sentEmail.update({
      where: { id: testEmail.id },
      data: { status: 'SENT' as CampaignSendStatus }
    })

    return {
      success: true,
      message: "Test email sent successfully",
      testId: testEmail.id
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
 * Get the status of a test email
 */
export async function getTestEmailStatus(testId: string) {
  try {
    const testEmail = await db.sentEmail.findUnique({
      where: { id: testId }
    })

    if (!testEmail) {
      return {
        status: "error",
        error: "Test email not found"
      }
    }

    return {
      status: testEmail.status.toLowerCase(),
      error: testEmail.error
    }
  } catch (error) {
    console.error("Error getting test email status:", error)
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Failed to get test status"
    }
  }
} 