"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "../ui/button"

export function NavUserSkeleton() {
  return (
    <Button variant="ghost" className="flex items-center gap-1 xs:gap-2 p-1 xs:p-2 hover:bg-zinc-200 cursor-not-allowed dark:hover:bg-zinc-800">
      <span className="relative flex size-8 shrink-0 overflow-hidden rounded-full">
        <div className="animate-pulse h-full w-full rounded-full bg-gray-700/50 dark:bg-zinc-800/50" />
      </span>
      <div className="hidden sm:block animate-pulse h-4 w-20 bg-gray-700/50 dark:bg-zinc-800/50" />
      <ChevronDown className="hidden sm:inline h-3 w-3 md:h-4 md:w-4 text-gray-500" />
    </Button>
  )
}