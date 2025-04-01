import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSpreadsheet, Clock, ArrowRight, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormCardSkeletonProps {
  count?: number;
}

export function FormCardSkeleton({ count = 1 }: FormCardSkeletonProps) {
  // Ensure count is at least 1 and at most 8
  const skeletonCount = Math.min(Math.max(count, 1), 8);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-6 sm:p-8 lg:p-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-white">Welcome back,</span>
                    <Skeleton className="h-8 w-32 sm:w-40" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">You have</span>
                    <Skeleton className="h-4 w-16" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">forms</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full sm:w-auto">
                <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Total Forms</span>
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-8" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">forms</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <Skeleton className="h-full w-1/3" />
                  </div>
                </div>
                
                <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Total Submissions</span>
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-8" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">responses</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <Skeleton className="h-full w-1/3" />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 rounded-full px-6 py-2.5 animate-pulse">
                <Plus className="h-4 w-4 text-gray-400 dark:text-gray-600" />
                <span className="text-sm text-gray-400 dark:text-gray-600">New Form</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forms Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Card 
            key={index} 
            className="group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800/50"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32 sm:w-40" />
                  <span className="text-xs sm:text-sm bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white px-2 sm:px-3 py-1 rounded-full">
                    <Skeleton className="h-3 w-8" /> responses
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  <span>Created <Skeleton className="inline-block h-3 w-24 sm:w-28 align-middle ml-1" /></span>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  <span>View</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 