import { FileText, Moon, BarChart, Code, Sparkles,  Palette, Sliders, Users, CheckCircle, TrendingUp } from "lucide-react"

export function FeatureGrid() {
  return (
    <section className="py-24 relative">
      {/* Background pattern/gradient */}
      <div className="absolute inset-0 pointer-events-none" />
      
      <div className="relative z-10 text-center mb-20">
        <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 mb-4">
          <Sparkles className="h-4 w-4 mr-2" />
          <span>Form Management Simplified</span>
        </div>
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">Everything you need for form management</h2>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Mantlz provides a complete form management platform with beautiful, customizable forms in minutes
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
        {/* Multiple Form Types - Large Card */}
        <div className="group bg-white dark:bg-zinc-800 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-100 dark:border-zinc-700 p-8 md:col-span-2 md:row-span-2 flex flex-col h-full relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="h-44 mb-6 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              <div className="absolute top-4 left-4 bg-white dark:bg-zinc-700 p-5 rounded-lg shadow-lg flex items-center space-x-3 group-hover:-translate-y-1 transition-transform">
                <FileText className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
                <div className="space-y-2">
                  <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-600 rounded-lg"></div>
                  <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-600 rounded-lg"></div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 bg-white dark:bg-zinc-700 p-5 rounded-lg shadow-lg group-hover:-translate-y-2 transition-transform duration-300 delay-100">
                <div className="space-y-3">
                  <div className="h-3 w-48 bg-zinc-200 dark:bg-zinc-600 rounded-lg"></div>
                  <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-600 rounded-lg"></div>
                  <div className="h-3 w-40 bg-zinc-200 dark:bg-zinc-600 rounded-lg"></div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-800 dark:bg-white text-white dark:text-zinc-800 p-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 font-medium">
                Create forms quickly
              </div>
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center mb-3">
              <Palette className="h-5 w-5 text-zinc-700 dark:text-zinc-300 mr-2" />
              <h3 className="text-2xl font-bold text-zinc-800 dark:text-white">Multiple Form Types</h3>
            </div>
            <p className="text-zinc-600 dark:text-zinc-300">
              Create feedback forms, contact forms, waitlist forms and more with our simple and intuitive interface. All form types are fully customizable to match your brand.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs font-medium rounded-lg">Feedback Forms</span>
              <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs font-medium rounded-lg">Contact Forms</span>
              <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs font-medium rounded-lg">Waitlist Forms</span>
            </div>
          </div>
        </div>

        {/* Developer-Friendly - Medium Card */}
        <div className="group bg-white dark:bg-zinc-800 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-100 dark:border-zinc-700 p-6 md:col-span-2 flex flex-col relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="mb-4 flex items-center justify-start">
            <Code className="h-10 w-10 text-zinc-700 dark:text-zinc-300 mr-3" />
            <h3 className="text-xl font-bold text-zinc-800 dark:text-white">Developer-Friendly</h3>
          </div>
          
          <div className="bg-zinc-800 text-gray-300 p-3 rounded-lg text-sm font-mono shadow-lg transform group-hover:-rotate-1 transition-transform duration-300 mt-2 mb-4 dark:bg-zinc-700 dark:border dark:border-zinc-600">
            <div> import{" {"} <span className="text-zinc-300 dark:text-white">Mantlz</span> {"} "}<span className="text-zinc-400 dark:text-zinc-300">from</span> <span className="text-zinc-300 dark:text-white">&quot;@mantlz/nextjs&quot;</span>;</div>
          </div>
          
          <p className="text-zinc-600 dark:text-zinc-300 text-sm">
            TypeScript native with React Hook Form and Zod validation for a seamless development experience.
          </p>
        </div>

        {/* Analytics - Medium Card */}
        <div className="group bg-white dark:bg-zinc-800 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-100 dark:border-zinc-700 p-6 md:col-span-2 flex flex-col relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center">
              <BarChart className="h-10 w-10 text-zinc-700 dark:text-zinc-300 mr-3" />
              <h3 className="text-xl font-bold text-zinc-800 dark:text-white">Form Analytics</h3>
            </div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-700 py-1 px-2 rounded-lg">
              2023
            </div>
          </div>
          
          <div className="relative h-40 flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Monthly submissions</div>
              <div className="flex items-center text-xs font-medium text-zinc-600 dark:text-zinc-400">
                <TrendingUp className="h-3 w-3 mr-1 text-zinc-600 dark:text-zinc-400" />
                <span>+24%</span>
              </div>
            </div>
            
            <div className="flex-1 flex items-end space-x-2 pt-2 px-1">
              <div className="group-hover:-translate-y-1 transition-transform duration-300 w-full h-full flex flex-col items-center justify-end">
                <div className="bg-zinc-200 dark:bg-zinc-700 w-full rounded-t-lg" style={{height: '30%'}}></div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Jan</div>
              </div>
              <div className="group-hover:-translate-y-2 transition-transform duration-300 delay-75 w-full h-full flex flex-col items-center justify-end">
                <div className="bg-zinc-300 dark:bg-zinc-600 w-full rounded-t-lg" style={{height: '45%'}}></div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Feb</div>
              </div>
              <div className="group-hover:-translate-y-3 transition-transform duration-300 delay-150 w-full h-full flex flex-col items-center justify-end">
                <div className="bg-zinc-400 dark:bg-zinc-500 w-full rounded-t-lg" style={{height: '60%'}}></div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Mar</div>
              </div>
              <div className="group-hover:-translate-y-4 transition-transform duration-300 delay-200 w-full h-full flex flex-col items-center justify-end">
                <div className="bg-zinc-500 dark:bg-zinc-400 w-full rounded-t-lg" style={{height: '40%'}}></div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Apr</div>
              </div>
              <div className="group-hover:-translate-y-3 transition-transform duration-300 delay-100 w-full h-full flex flex-col items-center justify-end">
                <div className="bg-zinc-600 dark:bg-zinc-300 w-full rounded-t-lg" style={{height: '55%'}}></div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">May</div>
              </div>
              <div className="group-hover:-translate-y-5 transition-transform duration-300 delay-300 w-full h-full flex flex-col items-center justify-end">
                <div className="bg-zinc-700 dark:bg-zinc-200 w-full rounded-t-lg" style={{height: '70%'}}></div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Jun</div>
              </div>
              <div className="group-hover:-translate-y-5 transition-transform duration-300 delay-300 w-full h-full flex flex-col items-center justify-end">
                <div className="bg-zinc-800 dark:bg-white w-full rounded-t-lg" style={{height: '80%'}}></div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Jul</div>
              </div>
            </div>
            
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <div className="font-medium text-zinc-800 dark:text-white">12,540</div>
                <div className="text-zinc-500 dark:text-zinc-400">Total submissions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dark Mode - Small Card */}
        <div className="group bg-white dark:bg-zinc-800 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-100 dark:border-zinc-700 p-6 flex flex-col relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="flex items-center h-full">
            <Moon className="h-10 w-10 text-zinc-700 dark:text-zinc-300 mr-3 flex-shrink-0" />
            <h3 className="text-xl font-bold text-zinc-800 dark:text-white">Dark Mode</h3>
          </div>
        </div>

        {/* Customizable - Small Card */}
        <div className="group bg-white dark:bg-zinc-800 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-100 dark:border-zinc-700 p-6 flex flex-col relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="flex items-center h-full">
            <Sliders className="h-10 w-10 text-zinc-700 dark:text-zinc-300 mr-3 flex-shrink-0" />
            <h3 className="text-xl font-bold text-zinc-800 dark:text-white">Customizable</h3>
          </div>
        </div>

        {/* User-friendly - Small Card */}
        <div className="group bg-white dark:bg-zinc-800 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-100 dark:border-zinc-700 p-6 flex flex-col relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="flex items-center h-full">
            <Users className="h-10 w-10 text-zinc-700 dark:text-zinc-300 mr-3 flex-shrink-0" />
            <h3 className="text-xl font-bold text-zinc-800 dark:text-white">Dev friendly</h3>
          </div>
        </div>

        {/* Reliable - Small Card */}
        <div className="group bg-white dark:bg-zinc-800 backdrop-blur rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-100 dark:border-zinc-700 p-6 flex flex-col relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-zinc-500/10 rounded-lg blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
          
          <div className="flex items-center h-full">
            <CheckCircle className="h-10 w-10 text-zinc-700 dark:text-zinc-300 mr-3 flex-shrink-0" />
            <h3 className="text-xl font-bold text-zinc-800 dark:text-white">Reliable</h3>
          </div>
        </div>
      </div>
    </section>
  )
}


