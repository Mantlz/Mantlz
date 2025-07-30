import { Skeleton } from "@/components/ui/skeleton"
import { FileSpreadsheet, LayoutGrid, List, Mail } from "lucide-react"

export function CampaignsGridSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section in its own card */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 ">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div className="relative p-6 lg:p-8">
          <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  Your Forms
                </h1>
                <div className="text-sm text-gray-500 dark:text-gray-400 p-1 pl-2 flex items-center">
                  <Skeleton className="h-4 w-4 rounded-lg mr-1" /> forms available
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1 gap-1 flex items-center">
                  <div className="h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 dark:text-zinc-400 text-sm border border-zinc-200 dark:border-zinc-800">
                    <LayoutGrid className="h-4 w-4" />
                  </div>
                  <div className="h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 dark:text-zinc-400 text-sm border border-zinc-200 dark:border-zinc-800" >
                    <List className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl p-4 border border-zinc-200 dark:border-zinc-700  dark:hover:border-zinc-600 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <FileSpreadsheet className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      <Skeleton className="h-4 w-10 rounded-lg" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Forms</p>
                  </div>
                </div>
              </div>
              <div className=" rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      <Skeleton className="h-4 w-12 rounded-lg" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Campaigns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forms Grid Skeleton in its own container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className=" border border-zinc-200 dark:border-zinc-800/50 rounded-xl  overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                  <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <Skeleton className="h-3 w-3 rounded-lg" />
                    <span>campaigns</span>
                  </div>
                </div>
                <div className="h-7 w-32  bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-500">
                  View Campaigns
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 