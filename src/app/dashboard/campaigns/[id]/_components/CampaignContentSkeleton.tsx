'use client';

import { Skeleton } from '@/components/ui/skeleton';

// Fixed heights for the skeleton bars to avoid hydration mismatches
const barHeights = [180, 150, 220, 160, 190, 140, 200, 170, 130, 210, 160, 180];

export function CampaignContentSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Campaign Analytics</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly email campaign performance metrics</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>

          {/* Chart Skeleton */}
          <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-3 sm:p-4 border border-zinc-100 dark:border-zinc-800/50">
            <div className="h-[300px] w-full flex items-center justify-center">
              <div className="w-full h-full grid grid-cols-12 gap-2 items-end px-8">
                {barHeights.map((height, i) => (
                  <div key={i} className="col-span-1 w-full">
                    <div 
                      className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-sm" 
                      style={{ height: `${height}px` }} 
                    />
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