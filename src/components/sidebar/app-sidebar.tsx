"use client"

import * as React from "react"


import { NavDocuments } from "@/components/sidebar/nav-documents"
import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import { UpgradeCard } from "@/components/billing/upgrade-card"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUser as useClerkUser, useUser } from "@clerk/nextjs"
import { NavUserSkeleton } from "../skeletons/navUser-skeleton"


import { Logo } from "../global/logo"
import { SIDE_BAR_DOMAIN_MENU, SIDE_BAR_DOCUMENT_MENU } from "@/constants/menu"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
const { user, isLoaded } = useUser()

  return (
    <Sidebar collapsible="offcanvas" {...props}  >
      <SidebarHeader >
        <SidebarMenu >
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 "
            >
              <a href="#" className="flex items-center gap-2">
                <Logo/>
                <span className="text-base font-semibold">Mantlz</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SIDE_BAR_DOMAIN_MENU} />
        <NavDocuments items={SIDE_BAR_DOCUMENT_MENU} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-4">
          {/* <UpgradeCard /> */}
          <NavSecondary />
          {!isLoaded ? (
            <NavUserSkeleton />
          ) : user ? (
            <NavUser
              user={{
                name: user.firstName || user.username || "User",
                email: user.emailAddresses?.[0]?.emailAddress || 'No email provided',
                avatar: user.imageUrl,
              }}
            />
          ) : null}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
