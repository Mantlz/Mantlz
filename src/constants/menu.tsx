import React, { type JSX } from 'react'




import DashboardIcon from '@/components/icons/dashboard-icon'
import EmailIcon from '@/components/icons/email-icon'
import IntegrationsIcon from '@/components/icons/integration-icon'
import LogIcon from '@/components/icons/log'
import TestIcon from '@/components/icons/test'






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
    title: 'Logs',
    icon: <LogIcon />,
    url: 'dashboard/logs',
  },
  {
    title: 'Test',
    icon: <TestIcon />,
    url: 'dashboard/test',
  },
]