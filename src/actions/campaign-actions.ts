'use client';

import { sendTestEmail, getTestEmailStatus } from '@/services/campaign-test.service';

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