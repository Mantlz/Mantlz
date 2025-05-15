import { Shield, Zap, Database, Code2, Webhook, LineChart, Layers, Settings, ArrowUpRight } from "lucide-react"

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
        {/* API Integration - Large Card */}
        <div className="group bg-white dark:bg-zinc-800 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-100 dark:border-zinc-700 p-8 md:col-span-3 md:row-span-2 flex flex-col h-full relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="flex items-center mb-4">
            <Webhook className="h-10 w-10 text-zinc-700 dark:text-zinc-300 mr-3" />
            <h3 className="text-2xl font-bold text-zinc-800 dark:text-white">API Integration</h3>
          </div>
          
          <div className="bg-zinc-800 text-gray-300 p-3 rounded-lg text-sm font-mono shadow-lg mt-2 mb-6 dark:bg-zinc-700 dark:border dark:border-zinc-600 max-w-full overflow-x-auto">
            <div className="opacity-70">// Initialize Mantlz in your application</div>
            <div><span className="text-zinc-400 dark:text-zinc-300">import</span> {" {"} <span className="text-zinc-300 dark:text-white">MantlzProvider</span> {"} "}<span className="text-zinc-400 dark:text-zinc-300">from</span> <span className="text-zinc-300 dark:text-white">"@mantlz/nextjs"</span>;</div>
            <div>&nbsp;</div>
            <div><span className="text-zinc-400 dark:text-zinc-300">export default function</span> <span className="text-zinc-300 dark:text-white">Layout</span>({`{`} children {`}`}) {`{`}</div>
            <div>&nbsp;&nbsp;<span className="text-zinc-400 dark:text-zinc-300">return</span> (</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;{`<`}<span className="text-zinc-300 dark:text-white">MantlzProvider</span> <span className="text-zinc-400 dark:text-zinc-300">apiKey</span>=<span className="text-zinc-300 dark:text-white">"your-mantlz-api-key"</span>{`>`}</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`{`}children{`}`}</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;{`</`}<span className="text-zinc-300 dark:text-white">MantlzProvider</span>{`>`}</div>
            <div>&nbsp;&nbsp;);</div>
            <div>{`}`}</div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs font-medium rounded-lg">v1/forms</span>
            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs font-medium rounded-lg">v1/tracking</span>
            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs font-medium rounded-lg">GraphQL</span>
          </div>
          
          <p className="text-zinc-600 dark:text-zinc-300 mt-4 flex-grow">
            Full access to our developer-friendly SDK with REST API endpoints. Customize form appearance, handle submissions, and integrate with your existing tools and workflows.
          </p>
          
          <div className="mt-6">
            <a href="#" className="inline-flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">
              View SDK documentation
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Advanced Security - Medium Card */}
        <div className="group bg-white dark:bg-zinc-800 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-100 dark:border-zinc-700 p-6 md:col-span-3 flex flex-col relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-zinc-700 dark:text-zinc-300 mr-3" />
            <h3 className="text-xl font-bold text-zinc-800 dark:text-white">Advanced Security</h3>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="flex items-center px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs font-medium rounded-lg">
              <span className="w-2 h-2 bg-zinc-600 dark:bg-zinc-400 rounded-full mr-1"></span>
              GDPR Compliant
            </span>
            <span className="flex items-center px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs font-medium rounded-lg">
              <span className="w-2 h-2 bg-zinc-600 dark:bg-zinc-400 rounded-full mr-1"></span>
              End-to-end Encryption
            </span>
          </div>
          
          <p className="text-zinc-600 dark:text-zinc-300 text-sm">
            Enterprise-grade security with automated GDPR compliance, end-to-end encryption, and advanced spam protection.
          </p>
        </div>

        {/* Performance - Medium Card */}
        <div className="group bg-white dark:bg-zinc-800 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-100 dark:border-zinc-700 p-6 md:col-span-3 flex flex-col relative overflow-hidden">
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
          
          <p className="text-zinc-600 dark:text-zinc-300 text-sm">
            Forms served from our global edge network with 99.9% uptime and ultra-low latency, regardless of user location.
          </p>
        </div>

        {/* Data Storage - Small Card */}
        <div className="group bg-white dark:bg-zinc-800 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-100 dark:border-zinc-700 p-6 md:col-span-2 flex flex-col relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="flex items-center h-full">
            <Database className="h-8 w-8 text-zinc-700 dark:text-zinc-300 mr-3 flex-shrink-0" />
            <h3 className="text-xl font-bold text-zinc-800 dark:text-white">Unlimited Storage</h3>
          </div>
        </div>

        {/* Advanced Validation - Small Card */}
        <div className="group bg-white dark:bg-zinc-800 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-100 dark:border-zinc-700 p-6 md:col-span-2 flex flex-col relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="flex items-center h-full">
            <Code2 className="h-8 w-8 text-zinc-700 dark:text-zinc-300 mr-3 flex-shrink-0" />
            <h3 className="text-xl font-bold text-zinc-800 dark:text-white">Custom Validation</h3>
          </div>
        </div>

        {/* Advanced Analytics - Small Card */}
        <div className="group bg-white dark:bg-zinc-800 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-100 dark:border-zinc-700 p-6 md:col-span-2 flex flex-col relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="flex items-center h-full">
            <LineChart className="h-8 w-8 text-zinc-700 dark:text-zinc-300 mr-3 flex-shrink-0" />
            <h3 className="text-xl font-bold text-zinc-800 dark:text-white">Advanced Analytics</h3>
          </div>
        </div>
      </div>
    </section>
  )
} 