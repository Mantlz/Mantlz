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
  BarChart,
  Key,
} from "lucide-react"


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
import UsageSettings from './usage';
import { getIcon, iconMap } from '@/types/iconMap';
import { cn } from '@/lib/utils';
import ApiKeySettings from './ApiKeySettings';

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
        "border-2 border-zinc-300 dark:border-zinc-800",
        "shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.3)]",
        "bg-white dark:bg-zinc-950",
        "rounded-lg"
      )}>
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          {/* Navigation Sidebar - Subtle retro style */}
          <Sidebar 
            collapsible="none" 
            className={cn(
              "hidden md:flex border-r w-[280px]",
              // Light mode - light gray sidebar
              "bg-zinc-100 border-zinc-200",
              // Dark mode - dark gray sidebar
              "dark:bg-zinc-900 dark:border-zinc-800"
            )}
          >
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <div className="px-6 py-6">
                    <h2 className="text-lg font-bold tracking-wide text-zinc-900 dark:text-white">
                      Settings
                    </h2>
                  </div>
                  <SidebarMenu className="px-3 space-y-1">
                    {data.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.name === selectedTab}
                          onClick={() => setSelectedTab(item.name)}
                          className={cn(
                            "w-full text-sm font-medium rounded-md",
                            "transition-all duration-150",
                            "border",
                            // Default state
                            "text-zinc-700 dark:text-zinc-300",
                            "border-transparent",
                            // Hover state
                            "hover:bg-zinc-200 hover:text-zinc-900",
                            "dark:hover:bg-zinc-800 dark:hover:text-white",
                            // Active state
                            item.name === selectedTab && [
                              "bg-zinc-200 text-zinc-900 border-zinc-300",
                              "dark:bg-zinc-800 dark:text-white dark:border-zinc-700",
                              "shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]",
                              "dark:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
                            ]
                          )}
                        >
                          <a className="flex items-center gap-3 px-3 py-2.5">
                            {(() => {
                              const IconComponent = getIcon(item.icon)
                              return IconComponent ? (
                                <IconComponent className={cn(
                                  "h-4 w-4",
                                  item.name === selectedTab 
                                    ? "text-zinc-900 dark:text-white" 
                                    : "text-zinc-500 dark:text-zinc-400"
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

          {/* Content Area - Subtle retro style */}
          <main className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-zinc-950">
            <div className="flex flex-1 flex-col overflow-y-auto">
              <div className="flex-1 p-8">
                {selectedTab === 'Appearance' && <AppearanceSettings />}
                {selectedTab === 'Notifications' && <NotificationSettings />}
                {selectedTab === 'Usage' && <UsageSettings />}
                {selectedTab === 'API Keys' && <ApiKeySettings />}
              </div>
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}