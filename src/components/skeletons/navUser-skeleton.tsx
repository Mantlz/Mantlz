"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function NavUserSkeleton() {
  return (
    <Button variant="ghost" className="flex items-center cursor-pointer gap-2 hover:bg-zinc-200 dark:hover:bg-amber-500">
      <div className="h-8 w-8 rounded-lg overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="h-5 w-20  rounded-lg" />
      <ChevronDown className="h-4 w-4" />
    </Button>
  )
}