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

    // First, verify user exists
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!user) throw new HTTPException(404, { message: "User not found" });

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

    // Count actual forms
    const actualFormCount = await db.form.count({
      where: { userId }
    });

    // Get current quota as backup check
    const quota = await this.getCurrentQuota(userId);
    
    // Check rate limiting (max 5 forms per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentForms = await db.form.count({
      where: {
        userId,
        createdAt: {
          gte: oneHourAgo
        }
      }
    });

    if (recentForms >= 5) {
      throw new HTTPException(429, {
        message: "Rate limit exceeded. Please wait before creating more forms."
      });
    }

    const planQuota = getQuotaByPlan(user.plan);

    // Double check both actual count and quota
    if (actualFormCount >= planQuota.maxForms || quota.formCount >= planQuota.maxForms) {
      // If there's a mismatch, update the quota to match reality
      if (actualFormCount !== quota.formCount) {
        await this.resetFormCount(userId);
      }
      
      throw new HTTPException(403, {
        message: `Form limit reached (${actualFormCount}/${planQuota.maxForms}) for your plan`
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
    decrementForms?: boolean;
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
          : updates.decrementForms
            ? { decrement: 1 }
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
  // static async checkFeatureAccess(userId: string, feature: 'analytics' | 'scheduling' | 'templates' | 'customDomain') {
  //   const user = await db.user.findUnique({
  //     where: { id: userId },
  //     select: { plan: true }
  //   });

  //   if (!user) throw new HTTPException(404, { message: "User not found" });

  //   const planQuota = getQuotaByPlan(user.plan);

  //   if (!planQuota.campaigns.features[feature]) {
  //     throw new HTTPException(403, { message: `${feature} feature not available in your plan` });
  //   }

  //   return true;
  // }

  /**
   * Reset form count to match actual forms in database
   */
  static async resetFormCount(userId: string) {
    // Count actual forms
    const actualFormCount = await db.form.count({
      where: { userId }
    });

    // Get current quota
    const quota = await this.getCurrentQuota(userId);

    // Update quota with actual form count
    return db.quota.update({
      where: { id: quota.id },
      data: {
        formCount: actualFormCount
      }
    });
  }



  /**
   * Get quota history for a user
   * This is for testing purposes only
   */
  static async getQuotaHistory(userId: string) {
    const quotas = await db.quota.findMany({
      where: { userId },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    });

    return quotas.map(quota => ({
      period: `${quota.month}/${quota.year}`,
      formCount: quota.formCount,
      submissionCount: quota.submissionCount,
      campaignCount: quota.campaignCount,
      emailsSent: quota.emailsSent,
      emailsOpened: quota.emailsOpened,
      emailsClicked: quota.emailsClicked
    }));
  }
}