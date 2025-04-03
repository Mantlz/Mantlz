import { Skeleton } from "@/components/ui/skeleton"

export function StatsGridSkeleton() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800/50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative p-6 sm:p-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800/50">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" style={{ animationDelay: `${(i - 1) * 0.2}s` }} />
                <div>
                  <Skeleton className="h-4 w-10 mb-1" style={{ animationDelay: `${(i - 1) * 0.2 + 0.1}s` }} />
                  <Skeleton className="h-3 w-20" style={{ animationDelay: `${(i - 1) * 0.2 + 0.2}s` }} />
                </div>
              </div>
              <Skeleton className="mt-2 h-1 w-full rounded-full" style={{ animationDelay: `${(i - 1) * 0.2 + 0.3}s` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 