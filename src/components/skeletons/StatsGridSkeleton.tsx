import { Skeleton } from "@/components/ui/skeleton"

export function StatsGridSkeleton() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Skeleton className="h-8 w-48 sm:w-64" style={{ animationDelay: '0.1s' }} />
              <Skeleton className="h-4 w-32" style={{ animationDelay: '0.2s' }} />
            </div>
            <Skeleton className="h-9 w-48" style={{ animationDelay: '0.3s' }} />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-10 mb-1" style={{ animationDelay: '0.5s' }} />
                  <Skeleton className="h-3 w-28" style={{ animationDelay: '0.6s' }} />
                </div>
              </div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-12 bg-zinc-200 dark:bg-zinc-700" style={{ animationDelay: '0.4s' }} />
                  <Skeleton className="h-3 w-28" style={{ animationDelay: '0.6s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forms Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800/50 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6">
              <Skeleton className="h-6 w-3/4 mb-2" style={{ animationDelay: `${0.7 + (i - 1) * 0.05}s` }} />
              <Skeleton className="h-4 w-full mb-4" style={{ animationDelay: `${0.8 + (i - 1) * 0.05}s` }} />
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4 rounded-full" style={{ animationDelay: `${0.9 + (i - 1) * 0.05}s` }} />
                  <Skeleton className="h-3 w-24" style={{ animationDelay: `${1.0 + (i - 1) * 0.05}s` }} />
                </div>
                <Skeleton className="h-7 w-20 rounded-full" style={{ animationDelay: `${1.1 + (i - 1) * 0.05}s` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 