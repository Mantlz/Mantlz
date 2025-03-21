// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { SidebarTrigger } from "@/components/ui/sidebar"
// import BreadcrumbNav from "../dashboard/breadcum-nav"

// export function SiteHeader() {
//   return (
//     <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-zinc-400 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
//       <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
//         <SidebarTrigger className="-ml-1" />
//         <Separator
//           orientation="vertical"
//           className="mx-2  bg-zinc-400 data-[orientation=vertical]:h-4"
//         />
//         {/* <h1 className="text-base font-medium">Documents</h1> */}
//         <BreadcrumbNav />
//         <div className="ml-auto flex items-center gap-2">
//           <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
//             <a
//               href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
//               rel="noopener noreferrer"
//               target="_blank"
//               className="dark:text-foreground"
//             >
//               GitHub
//             </a>
//           </Button>
//         </div>
//       </div>
//     </header>
//   )
// }


import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import BreadcrumbNav from "../dashboard/breadcum-nav"
import { cn } from "@/lib/utils"
import { IconBrandGithub } from "@tabler/icons-react"

export function SiteHeader() {
  return (
    <header className={cn(
      "flex h-(--header-height) shrink-0 items-center",
      "border-b transition-[width,height] ease-linear",
      "bg-white/50 dark:bg-zinc-900/50",
      "border-zinc-200 dark:border-zinc-800",
      "backdrop-blur-sm",
      "group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
    )}>
      <div className={cn(
        "flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6",
        "justify-between"
      )}>
        <div className="flex items-center gap-2">
          <SidebarTrigger 
            className={cn(
              "-ml-1",
              "text-zinc-600 dark:text-zinc-400",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800",
              "rounded-lg"
            )} 
          />
          <Separator
            orientation="vertical"
            className={cn(
              "mx-2 ",
              "bg-zinc-300 dark:bg-white data-[orientation=vertical]:h-4"
            )}
          />
          <BreadcrumbNav />
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "hidden sm:flex items-center gap-2",
              "text-zinc-600 dark:text-zinc-400",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800",
              "rounded-lg",
              "transition-colors duration-200"
            )}
            asChild
          >
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
            >
              <IconBrandGithub className="h-4 w-4" />
              <span className="font-medium">GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
