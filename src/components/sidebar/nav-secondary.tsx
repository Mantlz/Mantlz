// components/nav-main.tsx
"use client"

import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import { secondaryNavItems } from "@/config/SecondaryNavIcons"
import type { NavItem } from "@/types/navigation/nagivation"

export function NavMain() {
  const pathname = usePathname()

  const isNavItemActive = (item: NavItem) => {
    return pathname.startsWith(item.url)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Waitlizt</SidebarGroupLabel>
      <SidebarMenu>
        {secondaryNavItems.map((item) => {
          const isActive = isNavItemActive(item)
          
          // If the item has no subitems (like Settings), render a direct link
          if (!item.items?.length) {
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url}>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    className={pathname === item.url ? "bg-accent" : ""}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}