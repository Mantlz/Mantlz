import { Skeleton } from "@/components/ui/skeleton"
import { FileSpreadsheet, Users, Search, LayoutGrid, List } from "lucide-react"

export function StatsGridSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section in its own card */}
      <div className="relative overflow-hidden  rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div className="relative p-6 lg:p-8">
          <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  <Skeleton className="h-8 w-48 sm:w-64 rounded-lg" />
                </h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <Skeleton className="h-4 w-32 rounded-lg" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Grid/List View Toggle */}
                <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-lg p-1 flex items-center">
                  <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-gray-900 dark:text-white">
                    <LayoutGrid className="h-4 w-4" />
                  </div>
                  <div className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400">
                    <List className="h-4 w-4" />
                  </div>
                </div>
                {/* Search Button */}
                <div className="h-9 gap-2 cursor-pointer rounded-lg bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-zinc-200 dark:border-zinc-700 backdrop-blur shadow-sm flex items-center px-3">
                  <Search className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-normal hidden sm:inline-block text-gray-500">Search submissions...</span>
                  <div className="hidden sm:flex items-center justify-center h-5 px-1.5 ml-1 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <kbd className="text-xs font-mono tracking-wider text-gray-500 dark:text-gray-400">⌘K</kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className=" rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
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
                    <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      <Skeleton className="h-4 w-12 rounded-lg" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Submissions</p>
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
          <div key={i} className="bg-white dark:bg-background border border-zinc-100 dark:border-zinc-800/50 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6">
              <Skeleton className="h-6 w-3/4 mb-2 rounded-lg" />
              <Skeleton className="h-4 w-full max-w-md mb-4 rounded-lg" />
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1">
                  <FileSpreadsheet className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    <Skeleton className="h-3 w-3 inline-block rounded-lg" /> submissions
                  </div>
                </div>
                <div className="h-7 w-20 bg-background dark:bg-background rounded-lg flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-500">
                  View Logs
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 