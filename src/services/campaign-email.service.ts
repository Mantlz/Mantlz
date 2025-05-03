import { render } from '@react-email/render';
import { CampaignEmail } from '../emails/campaign-email';
import { db } from '@/lib/db';
import { sendEmail } from './email-service';

interface SendCampaignEmailParams {
  subject: string;
  previewText: string;
  content: string;
  ctaText?: string;
  ctaUrl?: string;
  to: string;
  campaignId: string;
  submissionId: string;
}

export async function sendCampaignEmail({
  subject,
  previewText,
  content,
  ctaText,
  ctaUrl,
  to,
  campaignId,
  submissionId,
}: SendCampaignEmailParams) {
  // Create a tracking record
  const sentEmail = await db.sentEmail.create({
    data: {
      campaignId,
      submissionId,
      status: 'PENDING',
    },
  });

  // Generate tracking URLs
  const trackingPixelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/tracking/open?sentEmailId=${sentEmail.id}`;
  const clickTrackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/tracking/click?sentEmailId=${sentEmail.id}`;

  // Render the email with tracking
  const emailHtml = await render(
    CampaignEmail({
      subject,
      previewText,
      content,
      ctaText,
      ctaUrl,
      trackingPixelUrl,
      clickTrackingUrl,
    })
  );

  // Send the email
  await sendEmail({
    to,
    subject,
    html: emailHtml,
  });

  // Update status to sent
  await db.sentEmail.update({
    where: { id: sentEmail.id },
    data: { status: 'SENT' },
  });

  return sentEmail;
}

export async function getCampaignMetrics(campaignId: string) {
  const sentEmails = await db.sentEmail.findMany({
    where: { campaignId },
  });

  return {
    sent: sentEmails.length,
    delivered: sentEmails.filter(e => e.status === 'SENT').length,
    bounced: sentEmails.filter(e => e.status === 'BOUNCED').length,
    opens: sentEmails.reduce((sum, e) => sum + e.openCount, 0),
    clicks: sentEmails.reduce((sum, e) => sum + e.clickCount, 0),
  };
}