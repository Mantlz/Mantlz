// Define plan quotas and limits
export const FREE_QUOTA = {
  maxForms: 1,
  maxSubmissionsPerMonth: 200,
} as {
  maxForms: number;
  maxSubmissionsPerMonth: number;
}

export const STANDARD_QUOTA = {
  maxForms: 5,
  maxSubmissionsPerMonth: 5000,
} as {
  maxForms: number;
  maxSubmissionsPerMonth: number;
}

export const PRO_QUOTA = {
  maxForms: 10,
  maxSubmissionsPerMonth: 10000,
} as {
  maxForms: number;
  maxSubmissionsPerMonth: number;
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