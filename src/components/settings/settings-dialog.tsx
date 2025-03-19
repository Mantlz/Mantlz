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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { navigationData } from '@/config/settings';
import { AppearanceSettings } from './AppearanceSettings';
import NotificationSettings  from './NotificationSettings';
import { getIcon, iconMap } from '@/types/iconMap';

const data = navigationData as Array<{ name: string; icon: keyof typeof iconMap } & { [key: string]: any }>;

export function SettingsDialog() {
  const [open, setOpen] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState('');

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setSelectedTab('Appearance');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden bg-white p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.name === selectedTab}
                          onClick={() => setSelectedTab(item.name)}
                        >
                          <a>
                            {(() => {
                              const iconComponent = getIcon(item.icon);
                              return iconComponent ? React.createElement(iconComponent, {}) : null;
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
          <main className="flex h-[580px] flex-1 flex-col overflow-hidden">
            <header className="flex h-[--header-height] p-2 shrink-0 items-center gap-2 transition-[width,height] ease-linear w-full">
              <div className="flex items-center gap-2 px-4">
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
                <div className="settings-content">
                  {selectedTab === 'Appearance' && <AppearanceSettings />}
                  {selectedTab === 'Notifications' && <NotificationSettings />}
                </div>
              </div>
            </div>
            </header>
            
          </main>
         
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
