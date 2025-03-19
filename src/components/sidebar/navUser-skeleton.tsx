"use client"

import {

    IconDotsVertical,



  } from "@tabler/icons-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

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
          className="data-[state=open]:bg-sidebar-accent border-1 border-zinc-500 data-[state=open]:text-sidebar-accent-foreground"
        >
          {/* Avatar skeleton */}
          <Skeleton className="h-8 w-8 rounded-lg bg-zinc-500" />
          
          {/* Text content skeleton */}
          <div className="grid flex-1 text-left text-sm leading-tight">
            <Skeleton className="h-4 w-24 bg-zinc-500" />
            <Skeleton className="h-3 w-32 mt-1 bg-zinc-500" />
          </div>
          
          {/* Chevron icon */}
          <IconDotsVertical className="ml-auto size-4 text-muted-foreground opacity-50" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}