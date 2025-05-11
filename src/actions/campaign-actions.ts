'use client';

import { sendTestEmail, getTestEmailStatus } from '@/services/campaign-test.service';

/**
 * Sends a test email for a campaign
 * @param campaignId The ID of the campaign to test
 * @returns Promise with success status and message
 * @throws Error if test email fails to send
 */
export async function sendCampaignTestEmail(campaignId: string) {
  try {
    return await sendTestEmail({ campaignId });
  } catch (error) {
    console.error('Error sending test email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send test email'
    };
  }
}

/**
 * Checks the status of a previously sent test email
 * @param testId The ID of the test email to check
 * @returns Promise with test email status and any error if present
 * @throws Error if status check fails
 */
export async function checkTestEmailStatus(testId: string) {
  try {
    return await getTestEmailStatus(testId);
  } catch (error) {
    console.error('Error checking test email status:', error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Failed to check test status'
    };
  }
}