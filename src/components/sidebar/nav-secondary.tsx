// components/nav-main.tsx
"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

import { secondaryNavItems } from "@/types/navigation/secondaryNavData"
import { SettingsDialog } from "@/components/settings/settings-dialog"
import type { NavItem } from "@/types//navigation/secondaryNavData"

export function NavSecondary() {
  const pathname = usePathname()

  const renderNavItem = (item: NavItem) => {
    // Special handling for Settings
    if (item.url === '/settings') {
      return (
        <SidebarMenuItem key={item.title}>
          <SettingsDialog>
            <SidebarMenuButton 
              tooltip={item.title}
              className="opacity-75 hover:opacity-100"
              size="sm"
            >
              <item.icon className="h-4 w-4" />
              <span className="text-sm">{item.title}</span>
            </SidebarMenuButton>
          </SettingsDialog>
        </SidebarMenuItem>
      )
    }

    // Regular nav items
    return (
      <SidebarMenuItem key={item.title}>
        <Link href={item.url}>
          <SidebarMenuButton 
            tooltip={item.title}
            className={pathname === item.url ? "bg-accent/50" : "opacity-75 hover:opacity-100"}
            size="sm"
          >
            <item.icon className="h-4 w-4" />
            <span className="text-sm">{item.title}</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarGroup className="mt-auto pb-4">
      <SidebarMenu>
        {secondaryNavItems.map(renderNavItem)}
      </SidebarMenu>
    </SidebarGroup>
  )
}