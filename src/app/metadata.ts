import { Metadata } from 'next'

// Public pages metadata
export const privacyMetadata: Metadata = {
  title: 'Privacy Policy | Mantle',
  description: 'Learn about how we collect, use, and protect your personal information',
  openGraph: {
    title: 'Privacy Policy | Mantle',
    description: 'Learn about how we collect, use, and protect your personal information',
  },
}

export const termsMetadata: Metadata = {
  title: 'Terms of Service | Mantle',
  description: 'Read our terms of service and user agreement',
  openGraph: {
    title: 'Terms of Service | Mantle',
    description: 'Read our terms of service and user agreement',
  },
}

export const pricingMetadata: Metadata = {
  title: 'Pricing | Mantle',
  description: 'Choose the perfect plan for your needs - Free, Standard, and Pro plans available',
  openGraph: {
    title: 'Pricing | Mantle',
    description: 'Choose the perfect plan for your needs - Free, Standard, and Pro plans available',
  },
}

// Dashboard pages metadata
export const dashboardMetadata: Metadata = {
  title: 'Dashboard | Mantle',
  description: 'Manage your campaigns and forms in one place',
  robots: {
    index: false,
    follow: false,
  },
}

export const logsMetadata: Metadata = {
  title: 'Activity Logs | Dashboard',
  description: 'View your system activity and email campaign logs',
  robots: {
    index: false,
    follow: false,
  },
} 