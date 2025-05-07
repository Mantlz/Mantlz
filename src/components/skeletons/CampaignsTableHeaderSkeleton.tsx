import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Mail, Clock, Send, Users } from "lucide-react"

export function CampaignsTableHeaderSkeleton() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
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
                <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  Form ID: <Skeleton className="h-3 w-16 rounded-lg inline-block" />
                </Badge>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                <Skeleton className="h-8 w-48 sm:w-64 rounded-lg" />
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-32 rounded-lg" />
            </div>
          </div>

          {/* Description */}
          {/* <div className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
            <Skeleton className="h-4 w-full max-w-md rounded-lg" />
          </div> */}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    <Skeleton className="h-4 w-10 mb-1 rounded-lg" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Campaigns</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    <Skeleton className="h-4 w-28 mb-1 rounded-lg" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Form Created</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    <Skeleton className="h-4 w-10 mb-1 rounded-lg" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Submissions</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Send className="h-5 w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    <Skeleton className="h-4 w-10 mb-1 rounded-lg" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Unsubscribed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 