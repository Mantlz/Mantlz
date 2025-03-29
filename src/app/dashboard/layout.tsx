// app/dashboard/layout.tsx
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import BreadcrumbNav from "@/components/dashboard/breadcum-nav"
import { SiteHeader } from "@/components/sidebar/site-header"



export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { waitlistId?: string }
}) {

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)", 
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset"  />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col  ">
          <div className="@container/main flex flex-1 flex-col gap-2 ">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6  ">
              <div className="px-4 lg:px-6  ">
                {children}
              </div>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
      
  )
}