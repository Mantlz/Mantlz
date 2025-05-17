import { z } from "zod";
import { IconDeviceAnalytics } from "@tabler/icons-react";
import { FormType } from "@prisma/client";

export const analyticsOptInTemplate = {
  id: 'analytics',
  name: "Analytics Opt-in",
  description: "Get user consent for analytics tracking",
  icon: IconDeviceAnalytics,
  formType: FormType.ANALYTICS_OPT_IN,
  schema: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    allowCookies: z.boolean(),
    allowFunctionalCookies: z.boolean(),
    allowAnalytics: z.boolean(),
    allowMarketing: z.boolean().optional(),
    country: z.string().optional(),
  }),
}; 