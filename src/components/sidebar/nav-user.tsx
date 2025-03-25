"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
  IconSettings,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { SignOutButton, useClerk } from "@clerk/nextjs"

import { cn } from "@/lib/utils"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { openUserProfile } = useClerk()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                // Base styles
                "cursor-pointer transition-all duration-200",
                "rounded-xl border",
                // Colors
                "bg-zinc-100/80 dark:bg-zinc-900",
                "border-zinc-200/50 dark:border-zinc-800/50",
                "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50",
                // Active state
                "data-[state=open]:bg-zinc-200/80 dark:data-[state=open]:bg-zinc-800/80",
                "data-[state=open]:border-zinc-300/50 dark:data-[state=open]:border-zinc-700/50"
              )}
            >
              <Avatar className={cn(
                "h-8 w-8 rounded-lg",
                "ring-2 ring-zinc-200/50 dark:ring-zinc-800/50"
              )}>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-zinc-200 dark:bg-zinc-800">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                  {user.name}
                </span>
                <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4 text-zinc-500 dark:text-zinc-400" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={cn(
              "w-(--radix-dropdown-menu-trigger-width) min-w-56",
              "bg-white dark:bg-zinc-900",
              "border border-zinc-200 dark:border-zinc-800",
              "rounded-xl shadow-lg",
              "backdrop-blur-sm"
            )}
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0">
              <div className={cn(
                "flex items-center gap-3 p-3",
                "border-b border-zinc-200 dark:border-zinc-800"
              )}>
                <Avatar className={cn(
                  "h-10 w-10 rounded-lg",
                  "ring-2 ring-zinc-200/50 dark:ring-zinc-800/50"
                )}>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-zinc-200 dark:bg-zinc-800">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {user.name}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <div className="p-2">
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  className={cn(
                    "rounded-lg",
                    "text-zinc-700 dark:text-zinc-300",
                    "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    "focus:bg-zinc-100 dark:focus:bg-zinc-800",
                    "cursor-pointer",
                    "flex items-center gap-2"
                  )}
                  onClick={() => openUserProfile()}
                >
                  <IconSettings className="size-4 text-zinc-600 dark:text-zinc-400" />
                  <span>Manage Account</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  className={cn(
                    "rounded-lg",
                    "text-zinc-700 dark:text-zinc-300",
                    "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    "focus:bg-zinc-100 dark:focus:bg-zinc-800",
                    "cursor-pointer",
                    "flex items-center gap-2"
                  )}
                >
                  <IconCreditCard className="size-4 text-zinc-600 dark:text-zinc-400" />
                  <span>Billing</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  className={cn(
                    "rounded-lg",
                    "text-zinc-700 dark:text-zinc-300",
                    "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    "focus:bg-zinc-100 dark:focus:bg-zinc-800",
                    "cursor-pointer",
                    "flex items-center gap-2"
                  )}
                >
                  <IconNotification className="size-4 text-zinc-600 dark:text-zinc-400" />
                  <span>Notifications</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-2 bg-zinc-200 dark:bg-zinc-800" />
              <DropdownMenuItem 
                className={cn(
                  "rounded-lg",
                  "text-red-600 dark:text-red-400",
                  "hover:bg-red-50 dark:hover:bg-red-950/50",
                  "focus:bg-red-50 dark:focus:bg-red-950/50",
                  "cursor-pointer",
                  "flex items-center gap-2"
                )}
              >
                <IconLogout className="size-4" />
                <SignOutButton />
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}