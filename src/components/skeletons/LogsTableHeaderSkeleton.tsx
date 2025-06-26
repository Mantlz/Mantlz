import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Users, Clock, File, Search } from "lucide-react"

export function LogsTableHeaderSkeleton() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-background rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="h-8 text-xs cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg px-3 bg-zinc-50 dark:bg-zinc-800/50 flex items-center">
                  <ChevronLeft className="h-3.5 w-3.5 mr-1 text-zinc-500 dark:text-zinc-400" />
                  <span className="hidden xs:inline text-zinc-500 dark:text-zinc-400">Back to Forms</span>
                </div>
                <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                  Form ID: <Skeleton className="h-3 w-16 rounded-lg inline-block" />
                </Badge>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                <Skeleton className="h-8 w-48 sm:w-64 rounded-lg" />
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <div className="h-9 gap-2 cursor-pointer rounded-lg bg-white/80 dark:bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-zinc-200 dark:border-zinc-700 backdrop-blur shadow-sm flex items-center px-3">
                <Search className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-normal hidden sm:inline-block text-gray-500">Search submissions...</span>
                <div className="hidden sm:flex items-center justify-center h-5 px-1.5 ml-1 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <kbd className="text-xs font-mono tracking-wider text-gray-500 dark:text-gray-400">⌘K</kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
            <Skeleton className="h-4 w-full max-w-md rounded-lg" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-background rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    <Skeleton className="h-4 w-10 mb-1 rounded-lg" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Submissions</p>
                </div>
              </div>
              <div className="mt-2 h-1 w-full bg-zinc-100 dark:bg-background rounded-lg overflow-hidden">
                <div className="h-full bg-zinc-300 dark:bg-zinc-600 rounded-lg w-1/3" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-background rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    <Skeleton className="h-4 w-28 mb-1 rounded-lg" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                </div>
              </div>
            </div>

            {/* Last Submission Card */}
            <div className="bg-white dark:bg-background rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <File className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    <Skeleton className="h-4 w-28 mb-1 rounded-lg" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last Submission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}