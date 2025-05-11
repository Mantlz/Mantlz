import { CheckIcon, X, Zap } from "lucide-react"
import { Container } from "./container"

// Define features for comparison
const comparisonFeatures = [
  "Multiple Form Types",
  "Customizable Themes",
  "Dark Mode Support",
  "Form Analytics",
  "TypeScript Native",
  "React Hook Form & Zod",
  "Custom CSS Support",
  "API Access",
  "SDK Library",
  "Unlimited Forms",
  "Email Notifications",
  "Webhook Integration",
  "Export Submissions",
  "Advanced Rate Limiting",
  "User Location Tracking",
  "Branded Emails"
];

// Define software to compare
const softwareCompared = [
  {
    name: "Mantlz",
    isFeatured: true,
    description: "Modern form management platform with advanced customization",
    features: {
      "Multiple Form Types": { value: true, highlight: true, note: "Feedback, Contact, Waitlist and more" },
      "Customizable Themes": { value: true, highlight: true, note: "Multiple preset themes + custom" },
      "Dark Mode Support": { value: true, highlight: true, note: "Automatic detection + manual override" },
      "Form Analytics": { value: true, highlight: true, note: "Browser, location & user analytics" },
      "TypeScript Native": { value: true, highlight: true, note: "Full type safety" },
      "React Hook Form & Zod": { value: true, highlight: true, note: "Modern validation stack" },
      "Custom CSS Support": { value: true, highlight: true, note: "Tailwind support built-in" },
      "API Access": { value: true, highlight: true, note: "RESTful API with TypeScript types" },
      "SDK Library": { value: true, highlight: true, note: "Developer-friendly React SDK" },
      "Unlimited Forms": { value: true, highlight: false, note: "On Pro plan" },
      "Email Notifications": { value: true, highlight: true, note: "Customizable templates" },
      "Webhook Integration": { value: true, highlight: true, note: "Real-time data push" },
      "Export Submissions": { value: true, highlight: true, note: "CSV/JSON formats" },
      "Advanced Rate Limiting": { value: true, highlight: true, note: "Prevent spam submissions" },
      "User Location Tracking": { value: true, highlight: true, note: "Country & language detection" },
      "Branded Emails": { value: true, highlight: true, note: "Custom email templates" }
    }
  },
  {
    name: "Typeform",
    isFeatured: false,
    description: "Interactive form builder with conversational UX",
    features: {
      "Multiple Form Types": { value: true, highlight: false, note: "Survey, quiz, and registration forms" },
      "Customizable Themes": { value: true, highlight: false, note: "Limited customization" },
      "Dark Mode Support": { value: false, highlight: false },
      "Form Analytics": { value: true, highlight: false, note: "Basic analytics" },
      "TypeScript Native": { value: false, highlight: false },
      "React Hook Form & Zod": { value: false, highlight: false },
      "Custom CSS Support": { value: false, highlight: false },
      "API Access": { value: true, highlight: false, note: "Limited API" },
      "SDK Library": { value: true, highlight: false, note: "Basic SDK" },
      "Unlimited Forms": { value: false, highlight: false, note: "Limited on free plan" },
      "Email Notifications": { value: true, highlight: false },
      "Webhook Integration": { value: true, highlight: false },
      "Export Submissions": { value: true, highlight: false, note: "Premium feature" },
      "Advanced Rate Limiting": { value: false, highlight: false },
      "User Location Tracking": { value: true, highlight: false, note: "Limited data" },
      "Branded Emails": { value: true, highlight: false, note: "Premium plans only" }
    }
  },
  {
    name: "Tally",
    isFeatured: false,
    description: "Modern no-code form builder",
    features: {
      "Multiple Form Types": { value: true, highlight: false, note: "Basic form types" },
      "Customizable Themes": { value: true, highlight: false, note: "Limited themes" },
      "Dark Mode Support": { value: true, highlight: false },
      "Form Analytics": { value: true, highlight: false, note: "Basic analytics" },
      "TypeScript Native": { value: false, highlight: false },
      "React Hook Form & Zod": { value: false, highlight: false },
      "Custom CSS Support": { value: false, highlight: false },
      "API Access": { value: true, highlight: false, note: "Limited API" },
      "SDK Library": { value: false, highlight: false },
      "Unlimited Forms": { value: true, highlight: false, note: "On paid plans" },
      "Email Notifications": { value: true, highlight: false },
      "Webhook Integration": { value: true, highlight: false },
      "Export Submissions": { value: true, highlight: false },
      "Advanced Rate Limiting": { value: false, highlight: false },
      "User Location Tracking": { value: false, highlight: false },
      "Branded Emails": { value: false, highlight: false }
    }
  },
  {
    name: "Formspree",
    isFeatured: false,
    description: "Traditional form handling service",
    features: {
      "Multiple Form Types": { value: false, highlight: false, note: "Basic forms only" },
      "Customizable Themes": { value: false, highlight: false },
      "Dark Mode Support": { value: false, highlight: false },
      "Form Analytics": { value: true, highlight: false, note: "Basic submission data" },
      "TypeScript Native": { value: false, highlight: false },
      "React Hook Form & Zod": { value: false, highlight: false },
      "Custom CSS Support": { value: true, highlight: false, note: "Limited" },
      "API Access": { value: true, highlight: false, note: "Basic endpoints" },
      "SDK Library": { value: true, highlight: false, note: "Basic SDK" },
      "Unlimited Forms": { value: true, highlight: false, note: "On paid plans" },
      "Email Notifications": { value: true, highlight: false },
      "Webhook Integration": { value: true, highlight: false },
      "Export Submissions": { value: true, highlight: false, note: "CSV only" },
      "Advanced Rate Limiting": { value: false, highlight: false },
      "User Location Tracking": { value: false, highlight: false },
      "Branded Emails": { value: false, highlight: false }
    }
  },
  {
    name: "Formspark",
    isFeatured: false,
    description: "Simple form backend service",
    features: {
      "Multiple Form Types": { value: false, highlight: false, note: "Basic forms only" },
      "Customizable Themes": { value: false, highlight: false },
      "Dark Mode Support": { value: false, highlight: false },
      "Form Analytics": { value: true, highlight: false, note: "Basic analytics" },
      "TypeScript Native": { value: false, highlight: false },
      "React Hook Form & Zod": { value: false, highlight: false },
      "Custom CSS Support": { value: true, highlight: false, note: "Custom styling only" },
      "API Access": { value: true, highlight: false, note: "Limited API" },
      "SDK Library": { value: false, highlight: false },
      "Unlimited Forms": { value: true, highlight: false, note: "On paid plans" },
      "Email Notifications": { value: true, highlight: false },
      "Webhook Integration": { value: true, highlight: false },
      "Export Submissions": { value: true, highlight: false, note: "Basic export" },
      "Advanced Rate Limiting": { value: false, highlight: false },
      "User Location Tracking": { value: false, highlight: false },
      "Branded Emails": { value: false, highlight: false }
    }
  }
];

export default function SoftwareComparison() {
  return (
    <section className="py-24 bg-white dark:bg-zinc-950" id="features">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Why choose <span className="text-blue-600 dark:text-blue-400">Mantlz</span>?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            See how Mantlz compares to other form builders and why developers choose our platform for modern form management.
          </p>
        </div>

        <div className="max-w-6xl mx-auto overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left py-6 px-8 bg-transparent border-b-2 border-zinc-500 dark:border-zinc-800 font-semibold text-gray-700 dark:text-gray-300">
                  <span className="text-xl">Features</span>
                </th>
                {softwareCompared.map((software) => (
                  <th 
                    key={software.name} 
                    className={`py-6 px-6 text-center border-b-2 border-zinc-500 dark:border-zinc-800 ${
                      software.isFeatured 
                        ? 'bg-zinc-50/80 dark:bg-zinc-900/20 relative before:absolute before:inset-0 before:border-t-4 before:border-blue-500 dark:before:border-blue-600 before:rounded-t-md' 
                        : 'bg-transparent'
                    }`}
                  >
                    <div className={`flex flex-col items-center ${software.isFeatured ? 'transform -translate-y-2' : ''}`}>
                      <span className={`font-bold text-2xl mb-2 ${software.isFeatured ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                        {software.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {software.description}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature, index) => (
                <tr 
                  key={feature} 
                  className={index % 2 === 0 ? 'bg-white dark:bg-zinc-950' : 'bg-zinc-50/70 dark:bg-zinc-900/30'}
                >
                  <td className="py-4 px-8 text-sm font-medium text-gray-900 dark:text-gray-200 border-b border-zinc-100 dark:border-zinc-800/50">
                    {feature}
                  </td>
                  {softwareCompared.map((software) => {
                    const featureData = software.features[feature as keyof typeof software.features];
                    
                    return (
                      <td 
                        key={`${software.name}-${feature}`} 
                        className={`py-4 px-6 text-center text-sm border-b border-zinc-100 dark:border-zinc-800/50 ${
                          software.isFeatured ? 'bg-zinc-50/30 dark:bg-zinc-900/10' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          {featureData.value ? (
                            <div className="flex items-center justify-center">
                              {featureData.highlight ? (
                                <div className="p-1 rounded-full bg-zinc-100 dark:bg-zinc-900/30">
                                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                              ) : (
                                <CheckIcon className="w-5 h-5 text-emerald-500" />
                              )}
                            </div>
                          ) : (
                            <X className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                          )}
                          
                          {'note' in featureData && featureData.note && (
                            <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {featureData.note}
                            </span>
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
      </Container>
    </section>
  )
} 