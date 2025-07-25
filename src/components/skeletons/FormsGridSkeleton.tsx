import { Skeleton } from "@/components/ui/skeleton"

interface FormsGridSkeletonProps {
  count?: number
}

export function FormsGridSkeleton({ count = 8 }: FormsGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-background border border-zinc-200 dark:border-zinc-800/50 rounded-xl shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Skeleton className="h-5 w-28" style={{ animationDelay: `${i * 0.1}s` }} />
              <Skeleton className="h-5 w-20 rounded-lg" style={{ animationDelay: `${i * 0.1 + 0.05}s` }} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-lg" style={{ animationDelay: `${i * 0.1 + 0.1}s` }} />
                <Skeleton className="h-4 w-24" style={{ animationDelay: `${i * 0.1 + 0.15}s` }} />
              </div>
              <Skeleton className="h-4 w-16" style={{ animationDelay: `${i * 0.1 + 0.2}s` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 