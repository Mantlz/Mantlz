"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "../ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function NavUserSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-5 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-md" />
      <Skeleton className="h-5 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-md" />
      <Skeleton className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-700" />
    </div>
  )
}