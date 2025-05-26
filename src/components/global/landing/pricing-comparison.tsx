import React from "react"
import { CheckIcon, X, Zap, Shield, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"


interface FeatureData {
  value: string | boolean;
  highlight: boolean;
  note?: string;
}

interface Plan {
  name: string;
  price: string;
  description: string;
  features: {
    [key: string]: FeatureData;
  };
  icon: React.ReactNode;
}

// Define pricing features for comparison
const pricingFeatures = [
  "Forms",
  "Monthly Submissions",
  "Form Analytics",
  "Custom Domains",
  "API Access",
  "Email Notifications",
  "Webhook Integration",
  "Export Submissions",
  "Support Level"
] as const;

// Define Mantlz's plans
const mantlzPlans: Plan[] = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for individuals just getting started",
    icon: <Shield className="m-auto size-5" strokeWidth={1} />,
    features: {
      "Forms": { value: "1", highlight: false, note: "Single form for basic needs" },
      "Monthly Submissions": { value: "200", highlight: false, note: "Great for small projects" },
      "Form Analytics": { value: "Basic", highlight: false, note: "Essential metrics" },
      "Custom Domains": { value: "Coming Soon", highlight: false, note: "Available soon" },
      "API Access": { value: true, highlight: true },
      "Email Notifications": { value: false, highlight: false },
      "Webhook Integration": { value: false, highlight: false },
      "Export Submissions": { value: false, highlight: false },
      "Support Level": { value: "Standard", highlight: false }
    }
  },
  {
    name: "Standard",
    price: "$8",
    description: "Great for growing businesses",
    icon: <Zap className="m-auto size-5" strokeWidth={1} />,
    features: {
      "Forms": { value: "5", highlight: true, note: "Multiple forms for different needs" },
      "Monthly Submissions": { value: "5,000", highlight: true, note: "Ideal for growing traffic" },
      "Form Analytics": { value: "Advanced", highlight: true, note: "Detailed insights" },
      "Custom Domains": { value: "Coming Soon", highlight: true, note: "Available soon" },
      "API Access": { value: true, highlight: true },
      "Email Notifications": { value: true, highlight: true, note: "Custom templates" },
      "Webhook Integration": { value: true, highlight: true },
      "Export Submissions": { value: true, highlight: true },
      "Support Level": { value: "Priority", highlight: true }
    }
  },
  {
    name: "Professional",
    price: "$15",
    description: "Built for professional teams",
    icon: <Users className="m-auto size-5" strokeWidth={1} />,
    features: {
      "Forms": { value: "10", highlight: true, note: "Comprehensive form suite" },
      "Monthly Submissions": { value: "10,000", highlight: true, note: "Enterprise-grade capacity" },
      "Form Analytics": { value: "Complete Suite", highlight: true, note: "Advanced analytics & reporting" },
      "Custom Domains": { value: "Coming Soon", highlight: true, note: "Available soon" },
      "API Access": { value: true, highlight: true, note: "Full API access" },
      "Email Notifications": { value: true, highlight: true, note: "Advanced automation" },
      "Webhook Integration": { value: true, highlight: true, note: "Multiple endpoints" },
      "Export Submissions": { value: true, highlight: true, note: "Automated exports" },
      "Support Level": { value: "Premium", highlight: true, note: "24/7 support" }
    }
  }
];

export default function PricingComparison() {
  return (
      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Choose the plan that fits your needs</h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">Start for free, upgrade as you grow</p>
          </div>
          <Card className="relative overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-6">
                        <span className="text-lg font-semibold">Features</span>
                      </th>
                      {mantlzPlans.map((plan) => (
                        <th key={plan.name} className="p-6 text-center min-w-[240px]">
                          <div className="inline-flex items-center gap-3 mb-4">
                            {plan.icon}
                            <h3 className="text-xl font-semibold">{plan.name}</h3>
                          </div>
                          <div className="flex items-baseline justify-center gap-1 mb-2">
                            <span className="text-3xl font-bold">{plan.price}</span>
                            <span className="text-sm text-muted-foreground">/mo</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pricingFeatures.map((feature) => (
                      <tr key={feature} className="border-b last:border-0">
                        <td className="p-6 text-sm">
                          {feature}
                        </td>
                        {mantlzPlans.map((plan) => {
                          const featureData = plan.features[feature];
                          return (
                            <td key={`${plan.name}-${feature}`} className="p-6 text-center">
                              {featureData && typeof featureData.value === 'boolean' ? (
                                featureData.value ? (
                                  <CheckIcon className="w-5 h-5 text-primary mx-auto" />
                                ) : (
                                  <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
                                )
                              ) : featureData ? (
                                <div>
                                  <span className={featureData.highlight ? 'font-medium' : 'text-muted-foreground'}>
                                    {featureData.value}
                                  </span>
                                  {featureData.note && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {featureData.note}
                                    </div>
                                  )}
                                </div>
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
  );
} 