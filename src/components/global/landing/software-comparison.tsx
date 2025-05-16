import { CheckIcon, X, Zap, Sparkles } from "lucide-react"
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
    <section className="py-24 relative bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900" id="features">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-zinc-200/30 dark:bg-zinc-800/20 rounded-full blur-3xl transform -translate-y-1/4 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-zinc-200/30 dark:bg-zinc-800/20 rounded-full blur-3xl transform translate-y-1/4 -translate-x-1/3"></div>
      </div>
      
      <Container className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>Feature Comparison</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Why choose <span className="text-black dark:text-white">Mantlz</span>?
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            See how Mantlz compares to other form builders and why developers choose our platform
          </p>
        </div>

        <div className="w-full max-w-6xl mx-auto backdrop-blur-sm rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900">
                  <th className="text-left py-6 px-8 bg-transparent font-semibold text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800">
                    <span className="text-xl">Features</span>
                  </th>
                  {softwareCompared.map((software) => (
                    <th 
                      key={software.name} 
                      className={`py-6 px-6 text-center border-b border-zinc-200 dark:border-zinc-800 ${
                        software.isFeatured 
                          ? 'relative bg-white dark:bg-zinc-800' 
                          : 'bg-zinc-50 dark:bg-zinc-900'
                      }`}
                    >
                      {software.isFeatured && (
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-zinc-400 to-zinc-600 dark:from-zinc-300 dark:to-zinc-500 rounded-b-md"></div>
                      )}
                      
                      <div className={`flex flex-col items-center ${software.isFeatured ? 'transform -translate-y-1' : ''}`}>
                        <span className={`font-bold text-xl mb-2 ${software.isFeatured ? 'text-zinc-800 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
                          {software.name}
                        </span>
                        <span className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[170px]">
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
                    className={index % 2 === 0 ? 'bg-white dark:bg-zinc-950' : 'bg-zinc-50 dark:bg-zinc-900'}
                  >
                    <td className="py-4 px-8 text-sm font-medium text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800/50">
                      {feature}
                    </td>
                    {softwareCompared.map((software) => {
                      const featureData = software.features[feature as keyof typeof software.features];
                      
                      return (
                        <td 
                          key={`${software.name}-${feature}`} 
                          className={`py-4 px-6 text-center border-b border-zinc-100 dark:border-zinc-800/50 ${
                            software.isFeatured ? 'bg-white/50 dark:bg-zinc-800/50' : ''
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            {featureData.value ? (
                              <div className="flex items-center justify-center">
                                {featureData.highlight ? (
                                  <div className="p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 shadow-sm">
                                    <Zap className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                                  </div>
                                ) : (
                                  <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                                    <CheckIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="p-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <X className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
                              </div>
                            )}
                            
                            {'note' in featureData && featureData.note && (
                              <span className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 max-w-[150px]">
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
        </div>
      </Container>
    </section>
  )
} 