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

import { mainNavItems } from "@/config/navigation"
import type { NavItem, NavSubItem } from "@/types/navigation/nagivation"



export function NavMain() {
  const pathname = usePathname()

  const isNavItemActive = (item: NavItem) => {
    return pathname.startsWith(item.url)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>FormsQuay</SidebarGroupLabel>
      <SidebarMenu>
        {mainNavItems.map((item: NavItem) => {
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
                    {item.icon && <item.icon className="h-6 w-6" />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          }

          // Otherwise render the collapsible menu
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon className="h-6 w-6" />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto h-4 w-4  transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem: NavSubItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            href={subItem.url}
                            className={pathname === subItem.url ? "bg-accent" : ""}
                          >
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}

                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}