import React, { type JSX } from 'react'
import { type Icon } from '@tabler/icons-react'
import { IconDashboard, IconSettings, IconMail, IconPlugConnected } from '@tabler/icons-react'

// import CalIcon from '@/components/icons/cal-icon'
// import WorkflowIcon from '@/components/icons/workflow-icon'
import DashboardIcon from '@/components/icons/dashboard-icon'
import EmailIcon from '@/components/icons/email-icon'
import IntegrationsIcon from '@/components/icons/integration-icon'
import SettingsIcon from '@/components/icons/settings-icon'
// import NotesIcon from '@/components/icons/notes'
// import BarChar from '@/components/icons/bar-char'




type SIDE_BAR_DOCUMENT_MENU_PROPS = {
  title: string
  url: string
  icon: React.ReactNode
}



type SIDE_BAR_DOMAIN_MENU_PROPS = {
  title: string
  url: string
  icon: React.ReactNode
}

export const SIDE_BAR_DOMAIN_MENU: SIDE_BAR_DOMAIN_MENU_PROPS[] = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    url: 'dashboard',
  },
  {
    title: 'Integrations',
    icon: <IntegrationsIcon />,
    url: 'integrations',
  },
//   {
//     label: 'Bar Chart',
//     icon: <BarChar />,
//     path: 'bar-chart',
//   },

]

export const SIDE_BAR_DOCUMENT_MENU: SIDE_BAR_DOCUMENT_MENU_PROPS[] = [
  {
    title: 'Email',
    icon: <EmailIcon />,
    url: 'email',
  },
]