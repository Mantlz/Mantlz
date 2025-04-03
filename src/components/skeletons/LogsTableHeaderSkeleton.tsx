import { Skeleton } from "@/components/ui/skeleton"

export function LogsTableHeaderSkeleton() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-24 rounded-full" style={{ animationDelay: '0.1s' }} />
                <Skeleton className="h-6 w-32 rounded-md" style={{ animationDelay: '0.2s' }} />
              </div>
              <Skeleton className="h-8 w-48 sm:w-64" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>

          {/* Description */}
          <Skeleton className="h-4 w-full max-w-md" style={{ animationDelay: '0.4s' }} />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-gray-100 dark:border-zinc-700/50">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg" style={{ animationDelay: `${0.5 + (i - 1) * 0.1}s` }} />
                  <div>
                    <Skeleton className="h-4 w-10 mb-1" style={{ animationDelay: `${0.6 + (i - 1) * 0.1}s` }} />
                    <Skeleton className="h-3 w-28" style={{ animationDelay: `${0.7 + (i - 1) * 0.1}s` }} />
                  </div>
                </div>
                {i === 1 && (
                  <Skeleton className="mt-2 h-1 w-full rounded-full" style={{ animationDelay: '0.8s' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 