"use client"

import { ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { usePathname } from "next/navigation"

export function BreadcrumbSkeleton() {
  const pathname = usePathname()
  const segmentCount = pathname.split("/").filter(Boolean).length

  // Generate an array of segments based on the path length
  const segments = Array.from({ length: segmentCount || 1 }).map((_, index) => {
    // Make the last segment wider to represent the current page
    const isLast = index === segmentCount - 1
    const width = isLast ? "w-24" : "w-16"
    
    return (
      <div key={index} className="flex items-center">
        {index > 0 && <ChevronRight className="mx-1.5 h-3 w-3 text-gray-500" />}
        <Skeleton className={`h-4 ${width} bg-zinc-200 dark:bg-zinc-700 rounded-md`} />
      </div>
    )
  })

  return (
    <div className="mb-6 sm:mb-8 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
      <Skeleton className="h-5 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-md" />
      <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      <Skeleton className="h-5 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-md" />
      <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      <Skeleton className="h-5 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-md" />
    </div>
  )
} 