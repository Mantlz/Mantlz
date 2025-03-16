// app/dashboard/layout.tsx
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
// import { BreadcrumbNav } from "@/components/dashboard/breadcum-nav"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
// import { Providers } from "@/providers/providers"
// import { fetchWaitlists } from "./waitlist/_component.tsx/api"

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { waitlistId?: string }
}) {
  //const waitlists = await fetchWaitlists(); // Fetch or define waitlists here

  return (
    <SidebarProvider>
      <AppSidebar
        
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center border-b gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {/* <BreadcrumbNav /> */}
          </div>
        </header>
        {/* <Providers></Providers> */}
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
