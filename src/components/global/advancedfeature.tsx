import { Zap, ArrowUpRight, Mail, History, Globe, AtSign, Bell, Info } from "lucide-react"

export function AdvancedFeatureGrid() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none" />
      
      <div className="relative z-10 text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">Advanced Features</h2>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Powerful tools for developers and businesses looking to take their forms to the next level
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-6xl mx-auto px-4">
        {/* Public API - Large Card */}
        <div className="group bg-white dark:bg-zinc-800 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-100 dark:border-zinc-700 p-8 md:col-span-4 md:row-span-2 flex flex-col h-full relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="flex items-center mb-4">
            <Globe className="h-10 w-10 text-zinc-700 dark:text-zinc-300 mr-3" />
            <h3 className="text-2xl font-bold text-zinc-800 dark:text-white">Public API</h3>
          </div>
          
          <div className="bg-zinc-800 text-gray-300 p-4 rounded-lg text-sm font-mono shadow-lg mt-2 mb-6 dark:bg-zinc-700 dark:border dark:border-zinc-600 max-w-full overflow-x-auto">
            <div className="opacity-70">// Example API request to fetch form submissions</div>
            <div><span className="text-zinc-400 dark:text-zinc-300">const</span> <span className="text-zinc-300 dark:text-white">response</span> = <span className="text-zinc-400 dark:text-zinc-300">await</span> <span className="text-zinc-300 dark:text-white">fetch</span>(<span className="text-green-400 dark:text-green-300">'https://api.mantlz.app/v1/forms/submissions'</span>, {`{`}</div>
            <div>&nbsp;&nbsp;<span className="text-zinc-300 dark:text-white">method</span>: <span className="text-green-400 dark:text-green-300">'GET'</span>,</div>
            <div>&nbsp;&nbsp;<span className="text-zinc-300 dark:text-white">headers</span>: {`{`}</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-zinc-300 dark:text-white">'Authorization'</span>: <span className="text-green-400 dark:text-green-300">'Bearer YOUR_API_KEY'</span></div>
            <div>&nbsp;&nbsp;{`}`}</div>
            <div>{`}`});</div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs font-medium rounded-lg">/v1/forms</span>
            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs font-medium rounded-lg">/v1/submit</span>
            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs font-medium rounded-lg">/v1/logs</span>
            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs font-medium rounded-lg">/v1/tracking</span>
          </div>
          
          <p className="text-zinc-600 dark:text-zinc-300 mt-4 flex-grow">
            Access our comprehensive API with endpoints for form management, submission data, analytics, and more. Build custom integrations and automate your workflows.
          </p>
          
          <div className="mt-6">
            <a href="#" className="inline-flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">
              View API documentation
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Global Edge Network - Medium Card */}
        <div className="group bg-white dark:bg-zinc-800 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-100 dark:border-zinc-700 p-6 md:col-span-2 md:row-span-2 flex flex-col relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="flex items-center mb-4">
            <Zap className="h-8 w-8 text-zinc-700 dark:text-zinc-300 mr-3" />
            <h3 className="text-xl font-bold text-zinc-800 dark:text-white">Global Edge Network</h3>
          </div>
          
          <div className="mb-4 flex space-x-2">
            <div className="w-full h-2 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-700">
              <div className="h-full bg-zinc-600 dark:bg-zinc-300 rounded-full animate-pulse" style={{width: '93%'}}></div>
            </div>
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300 whitespace-nowrap">93% faster</span>
          </div>
          
          <p className="text-zinc-600 dark:text-zinc-300">
            Forms served from our global edge network with 99.9% uptime and ultra-low latency, regardless of user location. Experience lightning-fast form loads and submissions worldwide.
          </p>
          
          <div className="mt-auto pt-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                <div className="text-sm text-zinc-700 dark:text-zinc-300">Multiple regions</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                <div className="text-sm text-zinc-700 dark:text-zinc-300">Low latency</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                <div className="text-sm text-zinc-700 dark:text-zinc-300">99.9% uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Notifications - Medium Card */}
        <div className="group bg-white dark:bg-zinc-800 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-100 dark:border-zinc-700 p-6 md:col-span-3 flex flex-col relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="flex items-center mb-4 justify-between">
            <div className="flex items-center">
              <AtSign className="h-8 w-8 text-zinc-700 dark:text-zinc-300 mr-3" />
              <h3 className="text-xl font-bold text-zinc-800 dark:text-white">Email Notifications</h3>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">PRO</span>
          </div>
          
          <div className="bg-zinc-50 dark:bg-zinc-900/20 border border-blue-200 dark:border-blue-800/30 p-3 rounded-lg mb-4">
            <div className="flex gap-2">
              <Info className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
                  Resend API Integration
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                  Connect with Resend to enable custom email notifications
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-zinc-600 dark:text-zinc-300 mb-4">
            Receive instant notifications when users submit forms. Configure custom templates, recipients, and conditional rules.
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-zinc-100 dark:bg-zinc-900 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm mt-auto">
            <div className="flex items-center gap-3 flex-1">
              <Mail className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Developer Notifications
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-500">
                  Customizable frequency
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Logs - Medium Card */}
        <div className="group bg-white dark:bg-zinc-800 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-100 dark:border-zinc-700 p-6 md:col-span-3 flex flex-col relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="flex items-center mb-4">
            <History className="h-8 w-8 text-zinc-700 dark:text-zinc-300 mr-3" />
            <h3 className="text-xl font-bold text-zinc-800 dark:text-white">Submission Logs</h3>
          </div>
          
          <p className="text-zinc-600 dark:text-zinc-300 mb-4">
            Search, filter and analyze all form submissions with advanced log management. Export data in various formats and track user interactions.
          </p>
          
          <div className="mt-auto space-y-2">
            <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-zinc-700 dark:text-zinc-300">contact@example.com</span>
                </div>
                <span className="text-zinc-500 dark:text-zinc-400">2 minutes ago</span>
              </div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
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