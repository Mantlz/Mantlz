import { db } from "@/lib/db";
import { getQuotaByPlan } from "@/config/usage";
import { HTTPException } from "hono/http-exception";


export class QuotaService {
  /**
   * Get or create quota for the current month
   */
  static async getCurrentQuota(userId: string) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    let quota = await db.quota.findFirst({
      where: {
        userId,
        year: currentYear,
        month: currentMonth,
      },
    });

    if (!quota) {
      // Get the previous month's quota to carry over non-submission metrics
      const previousDate = new Date(now);
      previousDate.setMonth(previousDate.getMonth() - 1);
      const previousMonthQuota = await db.quota.findFirst({
        where: {
          userId,
          year: previousDate.getFullYear(),
          month: previousDate.getMonth() + 1
        }
      });

      quota = await db.quota.create({
        data: {
          userId,
          year: currentYear,
          month: currentMonth,
          // Reset only submission count
          submissionCount: 0,
          // Carry over other metrics from previous month or start at 0
          formCount: previousMonthQuota?.formCount || 0,
          campaignCount: previousMonthQuota?.campaignCount || 0,
          emailsSent: previousMonthQuota?.emailsSent || 0,
          emailsOpened: previousMonthQuota?.emailsOpened || 0,
          emailsClicked: previousMonthQuota?.emailsClicked || 0
        }
      });
    }

    return quota;
  }

  /**
   * Check if user can create more forms
   */
  static async canCreateForm(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { plan: true }
    });

    if (!user) throw new HTTPException(404, { message: "User not found" });

    const quota = await this.getCurrentQuota(userId);
    const planQuota = getQuotaByPlan(user.plan);

    if (quota.formCount >= planQuota.maxForms) {
      throw new HTTPException(403, {
        message: `Form limit reached (${quota.formCount}/${planQuota.maxForms}) for your plan`
      });
    }

    return true;
  }

  /**
   * Check if user can submit more form submissions
   */
  static async canSubmitForm(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { plan: true }
    });

    if (!user) throw new HTTPException(404, { message: "User not found" });

    const quota = await this.getCurrentQuota(userId);
    const planQuota = getQuotaByPlan(user.plan);

    if (quota.submissionCount >= planQuota.maxSubmissionsPerMonth) {
      throw new HTTPException(403, {
        message: `Monthly submission limit reached (${quota.submissionCount}/${planQuota.maxSubmissionsPerMonth}) for your plan`
      });
    }

    return true;
  }

  /**
   * Check if user can create more campaigns
   */
  static async canCreateCampaign(userId: string, recipientCount: number) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { plan: true }
    });

    if (!user) throw new HTTPException(404, { message: "User not found" });

    const quota = await this.getCurrentQuota(userId);
    const planQuota = getQuotaByPlan(user.plan);

    if (!planQuota.campaigns.enabled) {
      throw new HTTPException(403, { message: "Campaigns not available in your plan" });
    }

    if (quota.campaignCount >= planQuota.campaigns.maxCampaignsPerMonth) {
      throw new HTTPException(403, {
        message: `Monthly campaign limit reached (${quota.campaignCount}/${planQuota.campaigns.maxCampaignsPerMonth}) for your plan`
      });
    }

    if (recipientCount > planQuota.campaigns.maxRecipientsPerCampaign) {
      throw new HTTPException(403, {
        message: `Recipient count exceeds plan limit of ${planQuota.campaigns.maxRecipientsPerCampaign}`
      });
    }

    return true;
  }

  /**
   * Update quota metrics
   */
  static async updateQuota(userId: string, updates: {
    incrementForms?: boolean;
    incrementSubmissions?: boolean;
    incrementCampaigns?: boolean;
    incrementEmails?: number;
    incrementOpens?: number;
    incrementClicks?: number;
  }) {
    const quota = await this.getCurrentQuota(userId);

    return db.quota.update({
      where: { id: quota.id },
      data: {
        formCount: updates.incrementForms
          ? { increment: 1 }
          : undefined,
        submissionCount: updates.incrementSubmissions
          ? { increment: 1 }
          : undefined,
        campaignCount: updates.incrementCampaigns
          ? { increment: 1 }
          : undefined,
        emailsSent: updates.incrementEmails
          ? { increment: updates.incrementEmails }
          : undefined,
        emailsOpened: updates.incrementOpens
          ? { increment: updates.incrementOpens }
          : undefined,
        emailsClicked: updates.incrementClicks
          ? { increment: updates.incrementClicks }
          : undefined
      }
    });
  }

  /**
   * Check if a feature is available in the user's plan
   */
  static async checkFeatureAccess(userId: string, feature: 'analytics' | 'scheduling' | 'templates' | 'customDomain') {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { plan: true }
    });

    if (!user) throw new HTTPException(404, { message: "User not found" });

    const planQuota = getQuotaByPlan(user.plan);

    if (!planQuota.campaigns.features[feature]) {
      throw new HTTPException(403, { message: `${feature} feature not available in your plan` });
    }

    return true;
  }
} 