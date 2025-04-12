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
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 space-y-4">
        <Skeleton className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded-md" style={{ animationDelay: '0.1s' }} />
        <Skeleton className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-700 rounded-md" style={{ animationDelay: '0.2s' }} />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-md" style={{ animationDelay: '0.3s' }} />
          <Skeleton className="h-7 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-lg" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
} 