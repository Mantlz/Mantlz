// types/navigation.ts

import { type LucideIcon } from "lucide-react"

export const enum NavigationPath {
  // Dashboard
  DASHBOARD = "/dashboard",
  DASHBOARD_ANALYTICS = "/dashboard/analytics",
  
  // Waitlist
  WAITLIST = "/dashboard/waitlist",
  WAITLIST_MEMBERS = "/dashboard/waitlist/members",
  WAITLIST_INVITES = "/dashboard/waitlist/invites",
  WAITLIST_RULES = "/dashboard/waitlist/rules",
  
  // Settings
  SETTINGS = "/dashboard/settings",
 
  
  // Notifications
  NOTIFICATIONS = "/dashboard/notifications",
  NOTIFICATIONS_MENTIONS = "/dashboard/notifications/mentions",
  
  // Analytics
  ANALYTICS = "/waitlizt/dashboard/analytics",
  ANALYTICS_REPORTS = "/dashboard/analytics/reports",
  ANALYTICS_EXPORT = "/dashboard/analytics/export",
}

export interface NavSubItem {
  title: string
  url: NavigationPath
}

export interface NavItem {
  title: string
  url: NavigationPath
  icon?: LucideIcon
  items?: NavSubItem[]
}

export type NavItems = NavItem[]