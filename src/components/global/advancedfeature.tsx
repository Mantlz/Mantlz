import { ArrowUpRight, Mail, History, Globe, AtSign, Info, Shield, Ban, Fingerprint } from "lucide-react"

export function AdvancedFeatureGrid() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none" />
      
      <div className="relative z-10 text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">Advanced Features</h2>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Powerful tools for developers and businesses looking to take their forms to the next level
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-6xl mx-auto px-4">
        {/* Public API - Large Card */}
        <div className="group bg-white dark:bg-zinc-800/50 backdrop-blur rounded-lg border-2 border-black dark:border-zinc-600 p-8 md:col-span-4 md:row-span-2 flex flex-col h-full relative overflow-hidden transform-gpu translate-y-[-4px] translate-x-[-4px] hover:translate-y-[-8px] hover:translate-x-[-8px] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)]">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="flex items-center mb-4">
            <Globe className="h-10 w-10 text-zinc-600 dark:text-zinc-400 mr-3" />
            <h3 className="text-2xl font-bold text-zinc-800 dark:text-white">Public API</h3>
          </div>
          
          <div className="bg-zinc-800 text-zinc-300 p-4 rounded-lg text-sm font-mono shadow-lg mt-2 mb-6 dark:bg-zinc-700 dark:border dark:border-zinc-600 max-w-full overflow-x-auto">
            <div className="opacity-70">{/* Example API request to fetch form submissions */}</div>
            <div><span className="text-zinc-400 dark:text-zinc-300">const</span> <span className="text-zinc-300 dark:text-zinc-200">response</span> = <span className="text-zinc-400 dark:text-zinc-300">await</span> <span className="text-zinc-300 dark:text-zinc-200">fetch</span>(<span className="text-zinc-400 dark:text-zinc-300">&apos;https://api.mantlz.app/v1/forms/submissions&apos;</span>, {`{`}</div>
            <div>&nbsp;&nbsp;<span className="text-zinc-300 dark:text-zinc-200">method</span>: <span className="text-zinc-400 dark:text-zinc-300">&apos;GET&apos;</span>,</div>
            <div>&nbsp;&nbsp;<span className="text-zinc-300 dark:text-zinc-200">headers</span>: {`{`}</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-zinc-300 dark:text-zinc-200">&apos;Authorization&apos;</span>: <span className="text-zinc-400 dark:text-zinc-300">&apos;Bearer YOUR_API_KEY&apos;</span></div>
            <div>&nbsp;&nbsp;{`}`}</div>
            <div>{`}`});</div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 text-xs font-medium rounded-lg">/v1/forms</span>
            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 text-xs font-medium rounded-lg">/v1/submit</span>
            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 text-xs font-medium rounded-lg">/v1/logs</span>
            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 text-xs font-medium rounded-lg">/v1/tracking</span>
          </div>
          
          <p className="text-zinc-600 dark:text-zinc-300 mt-4 flex-grow">
            Access our comprehensive API with endpoints for form management, submission data, analytics, and more. Build custom integrations and automate your workflows.
          </p>
          
          <div className="mt-6">
            <a href="#" className="inline-flex items-center text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200">
              View API documentation
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Protection & Security - Medium Card */}
        <div className="group bg-white dark:bg-zinc-800/50 backdrop-blur rounded-lg border-2 border-black dark:border-zinc-600 p-6 md:col-span-2 md:row-span-2 flex flex-col relative overflow-hidden transform-gpu translate-y-[-4px] translate-x-[-4px] hover:translate-y-[-8px] hover:translate-x-[-8px] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)]">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-zinc-600 dark:text-zinc-400 mr-3" />
            <h3 className="text-xl font-bold text-zinc-800 dark:text-white">Protection & Security</h3>
          </div>
          
          <div className="space-y-5 flex-grow">
            {/* Rate Limiting */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-start">
                <Ban className="h-5 w-5 text-zinc-600 dark:text-zinc-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Rate Limiting</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Configurable rate limits to prevent abuse and protect your forms from spam attacks
                  </p>
                </div>
              </div>
            </div>
            
            {/* Spam Protection */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-zinc-600 dark:text-zinc-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Spam Protection</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Advanced filters to detect and block spam submissions before they reach your inbox
                  </p>
                </div>
              </div>
            </div>
            
            {/* Unique Email Identifier */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-start">
                <Fingerprint className="h-5 w-5 text-zinc-600 dark:text-zinc-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Unique Email ID</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Track and identify unique users with our email fingerprinting technology
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Notifications - Medium Card */}
        <div className="group bg-white dark:bg-zinc-800/50 backdrop-blur rounded-lg border-2 border-black dark:border-zinc-600 p-6 md:col-span-3 flex flex-col relative overflow-hidden transform-gpu translate-y-[-4px] translate-x-[-4px] hover:translate-y-[-8px] hover:translate-x-[-8px] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)]">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="flex items-center mb-4 justify-between">
            <div className="flex items-center">
              <AtSign className="h-8 w-8 text-zinc-600 dark:text-zinc-400 mr-3" />
              <h3 className="text-xl font-bold text-zinc-800 dark:text-white">Email Notifications</h3>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">PRO</span>
          </div>
          
          <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 p-3 rounded-lg mb-4">
            <div className="flex gap-2">
              <Info className="h-4 w-4 text-zinc-600 dark:text-zinc-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-300">
                  Resend API Integration
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  Connect with Resend to enable custom email notifications
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-zinc-600 dark:text-zinc-300 mb-4">
            Receive instant notifications when users submit forms. Configure custom templates, recipients, and conditional rules.
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm mt-auto">
            <div className="flex items-center gap-3 flex-1">
              <Mail className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Developer Notifications
                </span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  Customizable frequency
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Logs - Medium Card */}
        <div className="group bg-white dark:bg-zinc-800/50 backdrop-blur rounded-lg border-2 border-black dark:border-zinc-600 p-6 md:col-span-3 flex flex-col relative overflow-hidden transform-gpu translate-y-[-4px] translate-x-[-4px] hover:translate-y-[-8px] hover:translate-x-[-8px] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)]">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="flex items-center mb-4">
            <History className="h-8 w-8 text-zinc-600 dark:text-zinc-400 mr-3" />
            <h3 className="text-xl font-bold text-zinc-800 dark:text-white">Submission Logs</h3>
          </div>
          
          <p className="text-zinc-600 dark:text-zinc-300 mb-4">
            Search, filter and analyze all form submissions with advanced log management. Export data in various formats and track user interactions.
          </p>
          
          <div className="mt-auto space-y-2">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-zinc-600 dark:bg-zinc-400 mr-2"></div>
                  <span className="text-zinc-700 dark:text-zinc-300">contact@example.com</span>
                </div>
                <span className="text-zinc-500 dark:text-zinc-400">2 minutes ago</span>
              </div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-zinc-600 dark:bg-zinc-400 mr-2"></div>
                  <span className="text-zinc-700 dark:text-zinc-300">support@domain.co</span>
                </div>
                <span className="text-zinc-500 dark:text-zinc-400">15 minutes ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 