// Define plan quotas and limits
export const FREE_QUOTA = {
  maxForms: 1,
  maxSubmissionsPerMonth: 200,
  campaigns: {
    enabled: false,
    maxCampaignsPerMonth: 0,
    maxRecipientsPerCampaign: 0
  }
} as {
  maxForms: number;
  maxSubmissionsPerMonth: number;
  campaigns: {
    enabled: boolean;
    maxCampaignsPerMonth: number;
    maxRecipientsPerCampaign: number;
  }
}

export const STANDARD_QUOTA = {
  maxForms: 5,
  maxSubmissionsPerMonth: 5000,
  campaigns: {
    enabled: true,
    maxCampaignsPerMonth: 3,
    maxRecipientsPerCampaign: 500
  }
} as {
  maxForms: number;
  maxSubmissionsPerMonth: number;
  campaigns: {
    enabled: boolean;
    maxCampaignsPerMonth: number;
    maxRecipientsPerCampaign: number;
  }
}

export const PRO_QUOTA = {
  maxForms: 10,
  maxSubmissionsPerMonth: 10000,
  campaigns: {
    enabled: true,
    maxCampaignsPerMonth: 10,
    maxRecipientsPerCampaign: 10000
  }
} as {
  maxForms: number;
  maxSubmissionsPerMonth: number;
  campaigns: {
    enabled: boolean;
    maxCampaignsPerMonth: number;
    maxRecipientsPerCampaign: number;
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