// Define plan quotas and limits
export const FREE_QUOTA = {
  maxForms: 1,
  maxSubmissionsPerMonth: 200,
  campaigns: {
    enabled: false,
    maxCampaignsPerMonth: 0,
    maxRecipientsPerCampaign: 0,
    features: {
      analytics: false,
      scheduling: false,
      templates: false,
      customDomain: false
    }
  }
} as {
  maxForms: number;
  maxSubmissionsPerMonth: number;
  campaigns: {
    enabled: boolean;
    maxCampaignsPerMonth: number;
    maxRecipientsPerCampaign: number;
    features: {
      analytics: boolean;
      scheduling: boolean;
      templates: boolean;
      customDomain: boolean;
    }
  }
}

export const STANDARD_QUOTA = {
  maxForms: 5,
  maxSubmissionsPerMonth: 5000,
  campaigns: {
    enabled: true,
    maxCampaignsPerMonth: 3,
    maxRecipientsPerCampaign: 500,
    features: {
      analytics: false,
      scheduling: true,
      templates: false,
      customDomain: false
    }
  }
} as {
  maxForms: number;
  maxSubmissionsPerMonth: number;
  campaigns: {
    enabled: boolean;
    maxCampaignsPerMonth: number;
    maxRecipientsPerCampaign: number;
    features: {
      analytics: boolean;
      scheduling: boolean;
      templates: boolean;
      customDomain: boolean;
    }
  }
}

export const PRO_QUOTA = {
  maxForms: 10,
  maxSubmissionsPerMonth: 10000,
  campaigns: {
    enabled: true,
    maxCampaignsPerMonth: 10,
    maxRecipientsPerCampaign: 10000,
    features: {
      analytics: true,
      scheduling: true,
      templates: true,
      customDomain: true
    }
  }
} as {
  maxForms: number;
  maxSubmissionsPerMonth: number;
  campaigns: {
    enabled: boolean;
    maxCampaignsPerMonth: number;
    maxRecipientsPerCampaign: number;
    features: {
      analytics: boolean;
      scheduling: boolean;
      templates: boolean;
      customDomain: boolean;
    }
  }
}

// Helper function to get quota based on plan
export function getQuotaByPlan(plan: string) {
  switch (plan) {
    case "PRO":
      return PRO_QUOTA
    case "STANDARD":
      return STANDARD_QUOTA
    default:
      return FREE_QUOTA
  }
} 