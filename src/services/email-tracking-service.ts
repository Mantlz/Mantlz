import { db } from '@/lib/db';

interface TrackEmailOpenParams {
  sentEmailId: string;
}

interface TrackEmailClickParams {
  sentEmailId: string;
}

interface TrackBounceParams {
  sentEmailId: string;
  bounceReason: string;
}

interface TrackSpamReportParams {
  sentEmailId: string;
}

export class EmailTrackingService {
  static async trackEmailOpen({ sentEmailId }: TrackEmailOpenParams) {
    await db.sentEmail.update({
      where: { id: sentEmailId },
      data: {
        openedAt: new Date(),
        lastOpenedAt: new Date(),
        openCount: { increment: 1 },
      },
    });
  }

  static async trackEmailClick({ sentEmailId }: TrackEmailClickParams) {
    await db.sentEmail.update({
      where: { id: sentEmailId },
      data: {
        clickedAt: new Date(),
        lastClickedAt: new Date(),
        clickCount: { increment: 1 },
      },
    });
  }

  static async trackBounce({ sentEmailId, bounceReason }: TrackBounceParams) {
    await db.sentEmail.update({
      where: { id: sentEmailId },
      data: {
        status: 'BOUNCED',
        bounceReason,
      },
    });
  }

  static async trackSpamReport({ sentEmailId }: TrackSpamReportParams) {
    await db.sentEmail.update({
      where: { id: sentEmailId },
      data: {
        spamReported: true,
        spamReportedAt: new Date(),
      },
    });
  }

  static async trackUnsubscribeClick(sentEmailId: string) {
    await db.sentEmail.update({
      where: { id: sentEmailId },
      data: {
        unsubscribeClicked: true,
        unsubscribeClickedAt: new Date(),
      },
    });
  }

  static async getCampaignAnalytics(campaignId: string) {
    const sentEmails = await db.sentEmail.findMany({
      where: { campaignId },
      select: {
        status: true,
        openedAt: true,
        clickedAt: true,
        openCount: true,
        clickCount: true,
        bounceReason: true,
        spamReported: true,
        unsubscribeClicked: true,
      },
    });

    const totalEmails = sentEmails.length;
    const openedEmails = sentEmails.filter(e => e.openedAt).length;
    const clickedEmails = sentEmails.filter(e => e.clickedAt).length;
    const bouncedEmails = sentEmails.filter(e => e.status === 'BOUNCED').length;
    const spamReports = sentEmails.filter(e => e.spamReported).length;
    const unsubscribes = sentEmails.filter(e => e.unsubscribeClicked).length;

    return {
      totalEmails,
      openedEmails,
      clickedEmails,
      bouncedEmails,
      spamReports,
      unsubscribes,
      openRate: totalEmails > 0 ? (openedEmails / totalEmails) * 100 : 0,
      clickRate: totalEmails > 0 ? (clickedEmails / totalEmails) * 100 : 0,
      bounceRate: totalEmails > 0 ? (bouncedEmails / totalEmails) * 100 : 0,
    };
  }
} 