"use client"

import { ChevronDown } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import { Button } from "../ui/button"

export function NavUserSkeleton() {
  return (
    <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-800 cursor-not-allowed">
      <Skeleton className="h-8 w-8 rounded-full bg-gray-700/50 dark:bg-zinc-800/50" />
      <Skeleton className="h-4 w-20 bg-gray-700/50 dark:bg-zinc-800/50" />
      <ChevronDown className="h-4 w-4 text-gray-500" />
    </Button>
  )
}