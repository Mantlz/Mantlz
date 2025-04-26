import { Button } from "@/components/ui/button"
import { FREE_QUOTA, STANDARD_QUOTA, PRO_QUOTA } from "@/config/usage"
import { CheckIcon, X } from "lucide-react"

type Plan = {
  title: string
  monthlyPrice: number
  features: string[]
  buttonText: string
  stripePriceIdMonthly: string
  isFeatured?: boolean
  includedPlans?: string[]
  quota: typeof FREE_QUOTA | typeof STANDARD_QUOTA | typeof PRO_QUOTA
}

// Create a consolidated feature list for comparison
const allFeatures = [
  // Form limits
  "Number of forms",
  "Monthly submissions",
  // Core features
  "Form builder",
  "Form themes",
  "Analytics",
  "Email notifications",
  "Support",
  "API access",
  "Webhook integrations",
  "Team collaboration",
  "Custom branding",
  "Dedicated account manager",
];

// Feature availability by plan
const featureMatrix = {
  "Number of forms": {
    "FREE": "1 form",
    "STANDARD": "10 forms",
    "PRO": "Unlimited"
  },
  "Monthly submissions": {
    "FREE": "100",
    "STANDARD": "5,000",
    "PRO": "Unlimited"
  },
  "Form builder": {
    "FREE": "Basic",
    "STANDARD": "Advanced",
    "PRO": "Advanced"
  },
  "Form themes": {
    "FREE": false,
    "STANDARD": "Custom themes",
    "PRO": "Custom themes"
  },
  "Analytics": {
    "FREE": "Basic",
    "STANDARD": "Advanced",
    "PRO": "Advanced with reporting"
  },
  "Email notifications": {
    "FREE": false,
    "STANDARD": true,
    "PRO": true
  },
  "Support": {
    "FREE": "Community",
    "STANDARD": "Priority",
    "PRO": "Priority"
  },
  "API access": {
    "FREE": false,
    "STANDARD": true,
    "PRO": "Advanced features"
  },
  "Webhook integrations": {
    "FREE": false,
    "STANDARD": true,
    "PRO": true
  },
  "Team collaboration": {
    "FREE": false,
    "STANDARD": false,
    "PRO": true
  },
  "Custom branding": {
    "FREE": false,
    "STANDARD": false,
    "PRO": true
  },
  "Dedicated account manager": {
    "FREE": false,
    "STANDARD": false,
    "PRO": true
  }
};

interface PricingComparisonProps {
  plans: Plan[];
  currentPlan: string | null;
  isPending: boolean;
  onCheckout: (plan: Plan) => Promise<void> | void;
}

export default function PricingComparison({ 
  plans, 
  currentPlan, 
  isPending, 
  onCheckout 
}: PricingComparisonProps) {
   
  const renderFeatureValue = (feature: string, planTitle: string) => {
    const value = featureMatrix[feature as keyof typeof featureMatrix][planTitle.toUpperCase() as keyof typeof featureMatrix[keyof typeof featureMatrix]];
    
    if (value === true) {
      return <CheckIcon className="w-5 h-5 text-emerald-500 mx-auto" />;
    } else if (value === false) {
      return <X className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" />;
    } else {
      return <span className="font-medium">{value}</span>;
    }
  };
   
  return (
    <div className="max-w-6xl mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left py-6 px-8 bg-transparent border-b-2 border-gray-200 dark:border-zinc-800 font-semibold text-gray-700 dark:text-gray-300">
                <span className="text-xl">Features</span>
              </th>
              {plans.map((plan) => (
                <th 
                  key={plan.title} 
                  className={`py-6 px-6 text-center border-b-2 border-gray-200 dark:border-zinc-800 ${
                    plan.isFeatured 
                      ? 'bg-blue-50/80 dark:bg-blue-900/20 relative before:absolute before:inset-0 before:border-t-4 before:border-blue-500 dark:before:border-blue-600 before:rounded-t-md' 
                      : 'bg-transparent'
                  }`}
                >
                  <div className={`flex flex-col items-center ${plan.isFeatured ? 'transform -translate-y-2' : ''}`}>
                    <span className={`font-bold text-2xl mb-1 ${plan.isFeatured ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                      {plan.title}
                    </span>
                    <div className="flex items-baseline">
                      <span className={`text-4xl font-bold ${plan.isFeatured ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                        ${plan.monthlyPrice}
                      </span>
                      <span className="ml-1 text-gray-500 dark:text-gray-400">/month</span>
                    </div>
                    
                    <Button 
                      onClick={() => onCheckout(plan)}
                      disabled={isPending || currentPlan === plan.title.toUpperCase()}
                      className={`mt-5 px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                        currentPlan === plan.title.toUpperCase()
                          ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300 cursor-default" 
                          : plan.isFeatured
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700"
                            : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 hover:border-gray-400 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white dark:border-zinc-600"
                      }`}
                    >
                      {isPending ? "Processing..." : currentPlan === plan.title.toUpperCase() ? "Current Plan" : plan.buttonText}
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allFeatures.map((feature, index) => (
              <tr 
                key={feature} 
                className={index % 2 === 0 ? 'bg-white dark:bg-zinc-950' : 'bg-gray-50/70 dark:bg-zinc-900/30'}
              >
                <td className="py-4 px-8 text-sm font-medium text-gray-900 dark:text-gray-200 border-b border-gray-100 dark:border-zinc-800/50">
                  {feature}
                </td>
                {plans.map((plan) => (
                  <td 
                    key={`${plan.title}-${feature}`} 
                    className={`py-4 px-6 text-center text-sm border-b border-gray-100 dark:border-zinc-800/50 ${
                      plan.isFeatured ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    {renderFeatureValue(feature, plan.title)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 