"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { useUser } from "@/hooks/users/useUser"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"

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
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}

      </SidebarContent>
      <SidebarFooter>
        {isSynced && user && user.emailAddresses?.[0] ? (
          <NavUser
            user={{
              name: user.firstName ?? "",
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
