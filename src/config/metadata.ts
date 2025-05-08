import { Metadata } from 'next'

// Base metadata that can be used across all pages
export const baseMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Mantlz - Headless Form Builder for Developers',
    template: '%s | Mantlz'
  },
  description: 'Modern headless form management platform with SDK for developers. Create beautiful, customizable forms with pre-built components, analytics, and TypeScript support.',
  keywords: ['form builder', 'headless forms', 'react forms', 'nextjs forms', 'typescript forms', 'developer tools', 'form sdk', 'form analytics'],
  authors: [{ name: 'Jean Daly' }],
  creator: 'Jean Daly',
  publisher: 'Mantlz',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'your-google-verification-code', // Add this later
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Mantlz',
    title: 'Mantlz - Headless Form Builder for Developers',
    description: 'Modern headless form management platform with SDK for developers. Create beautiful, customizable forms with pre-built components, analytics, and TypeScript support.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mantlz - Modern Form Builder for Developers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mantlz - Headless Form Builder for Developers',
    description: 'Modern headless form management platform with SDK for developers. Create beautiful, customizable forms with pre-built components, analytics, and TypeScript support.',
    images: ['/og-image.jpg'],
  },
}

// Public pages metadata
export const privacyMetadata: Metadata = {
  ...baseMetadata,
  title: 'Privacy Policy | Mantlz',
  description: 'Learn how Mantlz protects your data and handles form submissions securely',
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'Privacy Policy | Mantlz',
    description: 'Learn how Mantlz protects your data and handles form submissions securely',
  },
}

export const termsMetadata: Metadata = {
  ...baseMetadata,
  title: 'Terms of Service | Mantlz',
  description: 'Terms and conditions for using Mantlz form builder and SDK',
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'Terms of Service | Mantlz',
    description: 'Terms and conditions for using Mantlz form builder and SDK',
  },
}

export const pricingMetadata: Metadata = {
  ...baseMetadata,
  title: 'Pricing | Mantlz',
  description: 'Simple, transparent pricing for Mantlz. Start with our free tier and scale as you grow.',
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'Pricing | Mantlz',
    description: 'Simple, transparent pricing for Mantlz. Start with our free tier and scale as you grow.',
  },
}

// Landing page metadata
export const landingMetadata: Metadata = {
  ...baseMetadata,
  title: 'Mantlz - Modern Headless Form Builder for Developers',
  description: 'Create beautiful, customizable forms with our developer-friendly SDK. Features include multiple form types, themes, analytics, and TypeScript support.',
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'Mantlz - Modern Headless Form Builder for Developers',
    description: 'Create beautiful, customizable forms with our developer-friendly SDK. Features include multiple form types, themes, analytics, and TypeScript support.',
  },
}

// Dashboard pages metadata (protected routes)
export const dashboardMetadata: Metadata = {
  ...baseMetadata,
  title: 'Dashboard | Mantlz',
  description: 'Manage your forms, view analytics, and customize settings',
  robots: {
    index: false,
    follow: false,
  },
}

export const logsMetadata: Metadata = {
  ...baseMetadata,
  title: 'Activity Logs | Mantlz Dashboard',
  description: 'View form submission logs and activity history',
  robots: {
    index: false,
    follow: false,
  },
} 
