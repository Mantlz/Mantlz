import React from "react"
import { CheckIcon, X, Zap, Sparkles } from "lucide-react"
import { Container } from "./container"

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
    <section className="py-24 relative " id="pricing-comparison">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-zinc-200/30 dark:bg-zinc-800/20 rounded-full blur-3xl transform -translate-y-1/4 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-zinc-200/30 dark:bg-zinc-800/20 rounded-full blur-3xl transform translate-y-1/4 -translate-x-1/3"></div>
      </div>
      
      <Container className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>Plan Comparison</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 bg-clip-text text-transparent">
            Choose your plan
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Compare our plans and find the perfect fit for your needs
          </p>
        </div>

        <div className="w-full max-w-6xl mx-auto bg-white dark:bg-zinc-900 rounded-lg border-2 border-black dark:border-zinc-600 transform-gpu translate-y-[-4px] translate-x-[-4px] hover:translate-y-[-8px] hover:translate-x-[-8px] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)] overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900">
                  <th className="text-left py-6 px-8 bg-transparent font-bold text-zinc-700 dark:text-zinc-300 border-b-2 border-black dark:border-zinc-600">
                    <span className="text-xl">Features</span>
                  </th>
                  {mantlzPlans.map((plan) => (
                    <th 
                      key={plan.name}
                      className="py-6 px-6 text-center border-b-2 border-black dark:border-zinc-600 relative"
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-xl mb-2 text-zinc-800 dark:text-white">
                          {plan.name}
                        </span>
                        <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                          {plan.price}
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">/mo</span>
                        </div>
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                          {plan.description}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricingFeatures.map((feature, index) => (
                  <tr 
                    key={feature}
                    className={index % 2 === 0 ? 'bg-white dark:bg-zinc-950' : 'bg-zinc-50 dark:bg-zinc-900'}
                  >
                    <td className="py-4 px-8 text-sm font-medium text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800">
                      {feature}
                    </td>
                    {mantlzPlans.map((plan) => {
                      const featureData = plan.features[feature] || { value: '-', highlight: false };
                      return (
                        <td 
                          key={`${plan.name}-${feature}`}
                          className="py-4 px-6 text-center border-b border-zinc-200 dark:border-zinc-800"
                        >
                          <div className="flex flex-col items-center">
                            {typeof featureData.value === 'boolean' ? (
                              featureData.value ? (
                                <div className={`p-1 rounded-lg border-2 border-black dark:border-zinc-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] ${
                                  featureData.highlight 
                                    ? 'bg-orange-500 dark:bg-orange-500' 
                                    : 'bg-orange-500 dark:bg-orange-500'
                                }`}>
                                  {featureData.highlight ? (
                                    <Zap className="w-4 h-4 text-white dark:text-white" />
                                  ) : (
                                    <CheckIcon className="w-4 h-4 text-white dark:text-white" />
                                  )}
                                </div>
                              ) : (
                                <div className="p-1 rounded-lg border-2 border-black dark:border-zinc-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] bg-zinc-200 dark:bg-zinc-800">
                                  <X className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                                </div>
                              )
                            ) : (
                              <div className="space-y-1">
                                <span className={`text-sm ${
                                  featureData.highlight
                                    ? 'text-zinc-800 dark:text-white font-bold'
                                    : 'text-zinc-600 dark:text-zinc-400'
                                }`}>
                                  {featureData.value}
                                </span>
                                {featureData.note && (
                                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {featureData.note}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </section>
  );
} 