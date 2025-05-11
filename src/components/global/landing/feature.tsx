import { FileText, Moon, BarChart, Code } from "lucide-react"

export function FeatureGrid() {
  return (
    <section className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Everything you need for form management</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Mantlz provides a complete form management platform with beautiful, customizable forms in minutes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Large card - Multiple Form Types */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md hover:shadow-lg transition-all border border-zinc-100 dark:border-zinc-800 p-8 lg:col-span-2 flex flex-col">
          <div className="h-48 mb-6 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/20 rounded-xl">
            <div className="relative w-64 h-32">
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-blue-500" />
                  <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-full h-full flex items-center justify-center">
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md -mt-6 -ml-6">
                  <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
                  <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">Multiple Form Types</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Create feedback forms, contact forms, waitlist forms and more with our simple and intuitive interface. All form types are fully customizable to match your brand.
          </p>
        </div>
 {/* Developer-Friendly */}
 <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md hover:shadow-lg transition-all border border-zinc-100 dark:border-zinc-800 p-8 flex flex-col">
          <div className="h-48 mb-6 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/20 rounded-xl">
            <div className="flex flex-col items-center">
              <Code className="h-16 w-16 text-blue-500 mb-4" />
              <div className="bg-zinc-800 text-gray-300 p-3 rounded-lg text-xs font-mono shadow-inner">
                <div>import {"{"} Mantlz {"}"} from &quot;@mantlz/nextjs&quot;;</div>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">Developer-Friendly</h3>
          <p className="text-gray-600 dark:text-gray-300">
            TypeScript native with React Hook Form and Zod validation for a seamless development experience.
          </p>
        </div>
       

      

        {/* Regular card - Dark Mode */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md hover:shadow-lg transition-all border border-zinc-100 dark:border-zinc-800 p-8 flex flex-col">
          <div className="h-48 mb-6 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/20 rounded-xl">
            <div className="grid grid-cols-2 gap-4 w-48 h-48 p-4">
              <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md flex items-center justify-center">
                <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center">
                  <div className="h-8 w-8 bg-zinc-300 dark:bg-zinc-600 rounded"></div>
                </div>
              </div>
              <div className="bg-zinc-800 rounded-lg shadow-md flex items-center justify-center">
                <div className="h-16 w-16 bg-zinc-700 rounded-lg flex items-center justify-center">
                  <Moon className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">Dark Mode Support</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Automatic dark mode detection with manual override options for a perfect user experience in any lighting condition.
          </p>
        </div>

        {/* Large card - Analytics */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md hover:shadow-lg transition-all border border-zinc-100 dark:border-zinc-800 p-8 lg:col-span-2 flex flex-col">
          <div className="h-48 mb-6 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/20 rounded-xl">
            <div className="relative w-64 h-32">
              <svg className="absolute inset-0" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="60" width="20" height="40" fill="#dbeafe" rx="2" />
                <rect x="50" y="40" width="20" height="60" fill="#93c5fd" rx="2" />
                <rect x="80" y="20" width="20" height="80" fill="#60a5fa" rx="2" />
                <rect x="110" y="30" width="20" height="70" fill="#3b82f6" rx="2" />
                <rect x="140" y="10" width="20" height="90" fill="#2563eb" rx="2" />
              </svg>
              <div className="absolute top-0 right-0 bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-md m-2">
                <BarChart className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">Form Analytics</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Track form submissions and analyze responses with built-in analytics. Understand your users better and optimize your forms for higher conversion rates.
          </p>
        </div>
      </div>
    </section>
  )
}
