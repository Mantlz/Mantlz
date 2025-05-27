"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

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
import UsageSettings from './usage';
import { getIcon, iconMap } from '@/types/iconMap';
import { cn } from '@/lib/utils';
import ApiKeySettings from './ApiKeySettings';
import EmailSettings from './EmailSettings';
import { AccessibilitySettings } from "./AccessibilitySettings"
import { AdvancedSettings } from "./AdvancedSettings"
import BillingSettings from "./BillingSettings";
import StripeSettings from "./StripeSettings";
import SlackSettings from "./SlackSettings";
import DiscordSettings from "./DiscordSettings";

// Define a more specific type for navigation data items
type NavigationItem = {
  name: string;
  icon: keyof typeof iconMap;
  [key: string]: string | number | boolean;
};

const data = navigationData as NavigationItem[];

interface SettingsDialogProps {
  children: React.ReactNode
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState('Appearance')
  const pathname = usePathname()

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      setSelectedTab('Appearance')
    }
  }

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger on dashboard pages
      if (!pathname?.startsWith('/dashboard')) return

      // Check for Cmd + S (Mac) or Ctrl + S (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault() // Prevent browser's save dialog
        setOpen(prev => !prev) // Toggle the dialog state
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pathname])

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className={cn(
          "overflow-hidden p-0",
          "w-[85vw]",
          "sm:w-[80vw]",
          "md:w-[80vw]",
          "lg:w-[75vw]",
          "xl:w-[65vw]",
          "max-w-[1100px]",
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
                "hidden md:flex border-r w-[200px]",
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
                              "w-full text-sm font-medium rounded-lg",
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
                  {selectedTab === 'Accessibility' && <AccessibilitySettings />}
                  {selectedTab === 'Billing' && <BillingSettings />}
                  {selectedTab === 'Usage' && <UsageSettings />}
                  {selectedTab === 'API Keys' && <ApiKeySettings />}
                  {selectedTab === 'Email' && <EmailSettings />}
                  {selectedTab === 'Stripe' && <StripeSettings />}
                  {selectedTab === 'Advanced' && <AdvancedSettings />}
                  {selectedTab === 'Slack' && <SlackSettings />}
                  {selectedTab === 'Discord' && <DiscordSettings />}
                </div>
              </div>
            </main>
          </SidebarProvider>
        </DialogContent>
      </Dialog>
    </>
  )
}