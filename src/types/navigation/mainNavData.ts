import { Icon } from "@tabler/icons-react"
import {
  IconLayoutDashboard,
  IconBrandCampaignmonitor,
  IconChartHistogram,
  IconFolder,
  IconUsers,
} from "@tabler/icons-react"

export interface MainNavItem {
  title: string
  url: string
  icon: Icon
}

export const mainNavItems: MainNavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconLayoutDashboard,
  },
  {
    title: "Campaigns",
    url: "/dashboard/campaigns",
    icon: IconBrandCampaignmonitor,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: IconChartHistogram,
  },
  
] 