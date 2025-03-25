"use client"

import { IconDotsVertical } from "@tabler/icons-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

/**
 * A loading skeleton for the NavUser component
 * Displays a placeholder while user data is being loaded
 */
export function NavUserSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className={cn(
            // Base styles
            "cursor-wait transition-all duration-200",
            "rounded-xl border",
            // Colors
            "bg-zinc-100/80 dark:bg-zinc-900",
            "border-zinc-200/50 dark:border-zinc-800/50",
            // Shimmer effect container
            "relative overflow-hidden"
          )}
        >
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-200/10 dark:via-zinc-700/10 to-transparent" />

          <Avatar className={cn(
            "h-8 w-8 rounded-lg",
            "ring-2 ring-zinc-200/50 dark:ring-zinc-800/50"
          )}>
            <AvatarImage src="" alt="" />
            <AvatarFallback className="rounded-lg bg-zinc-200 dark:bg-zinc-800">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-300/20 dark:via-zinc-600/20 to-transparent animate-pulse" />
            </AvatarFallback>
          </Avatar>
          
          <div className="grid flex-1 text-left text-sm leading-tight">
            <div className={cn(
              "h-4 w-24",
              "rounded-md",
              "bg-zinc-200 dark:bg-zinc-800",
              "relative overflow-hidden"
            )}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-300/20 dark:via-zinc-600/20 to-transparent animate-pulse" />
            </div>
            <div className={cn(
              "h-3 w-32",
              "rounded-md",
              "bg-zinc-200/80 dark:bg-zinc-800/80",
              "relative overflow-hidden"
            )}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-300/20 dark:via-zinc-600/20 to-transparent animate-pulse" />
            </div>
          </div>
          
          <IconDotsVertical className={cn(
            "ml-auto size-4",
            "text-zinc-400 dark:text-zinc-600",
            "opacity-50"
          )} />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}