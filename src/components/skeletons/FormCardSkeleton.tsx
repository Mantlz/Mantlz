import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";

interface FormCardSkeletonProps {
  count?: number;
}

export function FormCardSkeleton({ count = 1 }: FormCardSkeletonProps) {
  // Ensure count is at least 1 and at most 8
  const skeletonCount = Math.min(Math.max(count, 1), 8);
  
  const skeletons = Array(skeletonCount).fill(0).map((_, i) => (
    <Card 
      key={i}
      className="group bg-white dark:bg-background border border-zinc-100 dark:border-zinc-800/50 transition-all duration-200"
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Skeleton className="h-5 w-1/2 rounded-lg " />
          <div className="text-xs sm:text-sm  text-gray-400 dark:text-gray-500 px-2 sm:px-3 py-1 rounded-lg flex items-center justify-center">
            <span><Skeleton className="h-4 w-5 rounded-lg inline-block mr-1 mt-2" /></span> responses
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs sm:text-sm text-gray-400 dark:text-gray-500">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            <Skeleton className="h-4 w-20 rounded-lg" />
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-500">
            <span>View</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 sm:h-4 sm:w-4">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </Card>
  ));

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section Skeleton */}
      <div className="relative overflow-hidden   rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-6 sm:p-8 lg:p-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black dark:bg-white flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-700">
                  <Skeleton className="w-full h-full rounded-full" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-white tracking-tight">
                    Welcome back, <Skeleton className="h-6 w-16 rounded-lg inline-block align-middle" />
                  </h1>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    You have <Skeleton className="h-4 w-5 rounded-lg inline-block align-middle mx-1" /> form<Skeleton className="h-4 w-3 rounded-lg inline-block align-middle" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full sm:w-auto">
                <div className="rounded-xl p-4 sm:p-5 border border-zinc-100 dark:border-zinc-800/50 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400 dark:text-gray-500">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M8 13h2"></path>
                        <path d="M8 17h2"></path>
                        <path d="M14 13h2"></path>
                        <path d="M14 17h2"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Skeleton className="h-5 w-5 rounded-lg" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Forms</p>
                    </div>
                  </div>
                  <div className="mt-2 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                    <div className="h-full bg-zinc-300 dark:bg-zinc-600 rounded-lg transition-all duration-500 w-1/4"></div>
                  </div>
                </div>
                
                <div className="rounded-xl p-4 sm:p-5 border border-zinc-100 dark:border-zinc-800/50 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400 dark:text-gray-500">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Skeleton className="h-5 w-5 rounded-lg" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Submissions</p>
                    </div>
                  </div>
                  <div className="mt-2 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                    <div className="h-full bg-zinc-300 dark:bg-zinc-600 rounded-lg transition-all duration-500 w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-auto bg-zinc-200 dark:bg-zinc-700 text-gray-500 dark:text-gray-400 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-all duration-200 rounded-xl px-6 h-10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              <span>New Form</span>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle Skeleton */}
      <div className="flex justify-end mb-2">
        <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-lg p-1 flex items-center">
          <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
          </div>
          <div className="p-1.5 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
          </div>
        </div>
      </div>

      {/* Forms Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {skeletons}
      </div>
    </div>
  );
} 