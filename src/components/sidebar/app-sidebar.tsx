"use client"

import * as React from "react"

import { NavMain } from "@/components/sidebar/nav-main"
import { useUser } from "@/hooks/users/useUser"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"
import { Logo } from "@/components/sidebar/logo"

import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useUser as useClerkUser } from "@clerk/nextjs"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isSynced } = useUser()
  const { user } = useClerkUser()
  console.log("user loggin: ", user)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />

      </SidebarContent>
      <SidebarFooter>
        {isSynced && user && user.emailAddresses?.[0] ? (
          <NavUser
            user={{
              name: user.firstName ?? "",
              firstName: user.firstName ?? "",
              email: user.emailAddresses[0].emailAddress,
              avatar: user.imageUrl ?? "",
            }}
            
          />
        ) : null}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
