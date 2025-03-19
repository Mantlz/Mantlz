// config/navigation.ts
//Bell, BarChart 
import { Grid, Users, Sliders, Home, Settings, LayoutDashboard} from "lucide-react"
import { NavigationPath, type NavItems } from "@/types/navigation/nagivation"

export const mainNavItems: NavItems = [
  {
    title: "Dashboard",
    url: NavigationPath.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: "Waitlist",
    url: NavigationPath.WAITLIST,
    icon: Users,
  
  },
  {
    title: "Settings",
    url: NavigationPath.SETTINGS,
    icon: Sliders,
    
  },
//   {
//     title: "Notifications",
//     url: NavigationPath.NOTIFICATIONS,
//     icon: Bell,
//     items: [
//       { title: "All", url: NavigationPath.NOTIFICATIONS },
//       { title: "Mentions", url: NavigationPath.NOTIFICATIONS_MENTIONS },
//     ]
//   },
//   {
//     title: "Analytics",
//     url: NavigationPath.ANALYTICS,
//     icon: BarChart,
//     items: [
//       { title: "Overview", url: NavigationPath.ANALYTICS },
//       { title: "Reports", url: NavigationPath.ANALYTICS_REPORTS },
//       { title: "Export", url: NavigationPath.ANALYTICS_EXPORT },
//     ]
//   }
]