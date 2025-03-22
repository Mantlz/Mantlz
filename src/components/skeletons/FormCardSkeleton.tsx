import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSpreadsheet, Clock, ArrowRight } from "lucide-react";

interface FormCardSkeletonProps {
  count?: number;
}

export function FormCardSkeleton({ count = 6 }: FormCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card 
          key={index} 
          className="group relative bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden rounded-lg"
        >
          {/* Geometric accent */}
          <div className="absolute top-0 left-0 h-full w-2 bg-black dark:bg-white"></div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-black dark:bg-white opacity-5 rounded-bl-full"></div>
          
          <div className="p-6 pl-7">
            {/* Icon and title */}
            <div className="flex items-center gap-3 mb-5">
              <div className="rounded-lg p-2.5 bg-gray-100 dark:bg-zinc-700 border-2 border-gray-200 dark:border-zinc-600">
                <FileSpreadsheet className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
              <div className="font-mono font-bold text-lg line-clamp-1">
                <Skeleton className="h-[1.125rem] w-32 rounded-md" />
              </div>
            </div>
            
            {/* Form metadata with better organization */}
            <div className="flex items-center text-xs text-muted-foreground mb-4 font-mono">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>Created <Skeleton className="inline-block h-3 w-24 align-middle ml-1" /></span>
            </div>
            
            {/* View button area */}
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-zinc-600">
                <Skeleton className="inline-block h-3 w-5 align-middle mr-1" /> responses
              </div>
              
              <div className="inline-flex items-center gap-1 text-sm font-mono font-bold text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                VIEW FORM
                <ArrowRight className="h-4 w-4 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
          
          {/* Bottom hover indicator */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-black dark:bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
        </Card>
      ))}
    </>
  );
} 