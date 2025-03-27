import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { LucideProps } from 'lucide-react';

export type NavIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;

export interface NavItem {
  title: string;
  icon: NavIcon;
  url: string;
}

import { Settings, HelpCircle, Search } from 'lucide-react';

export const icons = {
  settings: Settings as NavIcon,
  help: HelpCircle as NavIcon,
  search: Search as NavIcon,
} as const;

export const secondaryNavItems = [
  {
    title: 'Settings',
    icon: icons.settings,
    url: '/settings',
  },
  {
    title: 'Help',
    icon: icons.help,
    url: '/help',
  },
];
