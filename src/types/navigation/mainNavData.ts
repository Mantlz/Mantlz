import { Icon } from "@tabler/icons-react"
import {
  IconDashboard,
  IconListDetails,
  IconChartBar,
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
    icon: IconDashboard,
  },
  {
    title: "Lifecycle",
    url: "/lifecycle",
    icon: IconListDetails,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: IconChartBar,
  },
  
] 