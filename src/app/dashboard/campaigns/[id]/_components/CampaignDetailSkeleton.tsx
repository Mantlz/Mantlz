'use client';

export function CampaignDetailSkeleton() {
  return (
    <div className="container py-8 space-y-6">
      {/* Header Skeleton */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4 w-full">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-24 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                  <div className="h-6 w-20 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse"></div>
                </div>
                <div className="h-8 w-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                <div className="h-4 w-96 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-24 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
                <div className="h-9 w-24 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
              </div>
            </div>
            
            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                      <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
          <div className="h-6 w-48 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>
        <div className="p-6">
          <div className="space-y-8">
            {/* Basic stats cards skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed metrics skeleton */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
                <div className="h-5 w-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-x divide-y divide-zinc-200 dark:divide-zinc-700">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                      <div className="h-4 w-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 