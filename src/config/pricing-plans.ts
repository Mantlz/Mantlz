import { FREE_QUOTA, STANDARD_QUOTA, PRO_QUOTA } from "./usage";

export type Subscription = {
  plan: "FREE" | "STANDARD" | "PRO" | null;
}

export interface Plan {
  title: string;
  monthlyPrice: number;
  features: string[];
  buttonText: string;
  stripePriceIdMonthly: string;
  includedPlans?: string[];
  quota: any;
  iconName: 'Shield' | 'Zap' | 'Users';
  isPopular?: boolean;
  isFeatured?: boolean;
}

export const pricingPlans: Plan[] = [
  {
    title: "Starter",
    monthlyPrice: 0,
    features: [
      "1 Form",
      "200 submissions per month",
      "Basic form analytics",
      "Form validation",
      "Standard support",
    ],
    buttonText: "Start for free",
    stripePriceIdMonthly: "",
    quota: FREE_QUOTA,
    iconName: 'Shield'
  },
  {
    title: "Standard",
    monthlyPrice: 8,
    features: [
      "5 Forms",
      "5,000 submissions per month",
      "Advanced analytics",
      "Form campaigns (3/month)",
      "Up to 200 recipients per campaign",
      "Priority support",
    ],
    buttonText: "Get Standard",
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID ?? "",
    includedPlans: [],
    quota: STANDARD_QUOTA,
    iconName: 'Zap',
    isPopular: true
  },
  {
    title: "Professional",
    monthlyPrice: 15,
    features: [
      "10 Forms",
      "10,000 submissions per month",
      "Complete analytics suite",
      "Form campaigns (10/month)",
      "Up to 500 recipients per campaign",
      "Premium support",
    ],
    buttonText: "Get Pro",
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? "",
    includedPlans: [],
    quota: PRO_QUOTA,
    iconName: 'Users',
    isFeatured: true,
    isPopular: false
  },
];