"use client"

import { FormInput } from "lucide-react"
import Link from "next/link"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu className={className}>
      <SidebarMenuItem>
        <Link href="/">
          <SidebarMenuButton
            size="lg"
            className={cn(
              "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
              "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
              "transition-all duration-200 hover:bg-transparent"
            )}
          >
            {/* Logo container with perfect centering */}
            <div 
              className={cn(
                "flex items-center justify-center rounded-lg bg-orange-600 text-white",
                "group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:min-w-8",
                "h-8 w-8 min-w-8 flex-shrink-0"
              )}
            >
              <FormInput 
                className={cn(
                  "h-6 w-6 pl-1",
                  "text-white"
                )}
              />
            </div>
            {/* Text container */}
            <div 
              className={cn(
                "grid flex-1 text-left leading-tight ml-3",
                "group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:ml-0"
              )}
            >
              <span className="truncate font-medium text-base">FormQuay</span>
              <span className="truncate text-xs text-muted-foreground">Forms that scale</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}