import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { LucideProps } from 'lucide-react';

export type Icon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;

import { Settings as IconSettings, HelpCircle as IconHelp, Search as IconSearch } from 'lucide-react';

export const secondaryNavItems = [
  {
    title: 'Settings',
    icon: IconSettings as Icon,
    url: '/settings',
  },
  {
    title: 'Help',
    icon: IconHelp as Icon,
    url: '/help',
  },
  {
    title: 'Search',
    icon: IconSearch as Icon,
    url: '/search',
  },
];
