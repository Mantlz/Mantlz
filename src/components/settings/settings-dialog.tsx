"use client"

import * as React from "react"
import {
  Bell,
  Check,
  Globe,
  Home,
  Keyboard,
  Link,
  Lock,
  Menu,
  MessageCircle,
  Paintbrush,
  Settings,
  Video,
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { navigationData } from '@/config/settings';
import { AppearanceSettings } from './AppearanceSettings';
import NotificationSettings  from './NotificationSettings';
import { getIcon, iconMap } from '@/types/iconMap';
import { cn } from '@/lib/utils';

const data = navigationData as Array<{ name: string; icon: keyof typeof iconMap } & { [key: string]: any }>;

interface SettingsDialogProps {
  children: React.ReactNode
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState('Appearance')

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      setSelectedTab('Appearance')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className={cn(
        "overflow-hidden p-0",

        "w-[95vw] md:w-[900px] lg:w-[1100px] xl:w-[1200px]",
        "h-[600px]",
        "border border-zinc-200 dark:border-zinc-800",
        "shadow-lg"
      )}>
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          {/* Navigation Sidebar - Darker background */}
          <Sidebar 
            collapsible="none" 
            className={cn(
              "hidden md:flex border-r w-[280px]",
              // Light mode - darker gray
              "bg-zinc-900 border-zinc-800",
              // Dark mode - deep black
              "dark:bg-black dark:border-zinc-800/50"
            )}
          >
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <div className="px-4 py-6">
                    <h2 className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">
                      Settings
                    </h2>
                  </div>
                  <SidebarMenu className="px-2 space-y-1">
                    {data.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.name === selectedTab}
                          onClick={() => setSelectedTab(item.name)}
                          className={cn(
                            "w-full text-sm rounded-md",
                            "transition-colors duration-200",
                            // Default state
                            "text-zinc-400 dark:text-zinc-500",
                            // Hover state
                            "hover:bg-zinc-800 hover:text-zinc-200",
                            "dark:hover:bg-zinc-900 dark:hover:text-zinc-300",
                            // Active state
                            item.name === selectedTab && [
                              "bg-zinc-300 text-zinc-200",
                              "dark:bg-zinc-300 dark:text-zinc-200"
                            ]
                          )}
                        >
                          <a className="flex items-center gap-3 px-3 py-2">
                            {(() => {
                              const IconComponent = getIcon(item.icon)
                              return IconComponent ? (
                                <IconComponent className={cn(
                                  "h-4 w-4",
                                  item.name === selectedTab 
                                    ? "text-zinc-200" 
                                    : "text-zinc-400 dark:text-zinc-500"
                                )} />
                              ) : null
                            })()}
                            <span>{item.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          {/* Content Area - Light background */}
          <main className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-zinc-950">
            <div className="flex flex-1 flex-col overflow-y-auto">
              <div className="flex-1 p-8">
                {selectedTab === 'Appearance' && <AppearanceSettings />}
                {selectedTab === 'Notifications' && <NotificationSettings />}
                
              </div>
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
