import { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Mantle',
    template: '%s | Mantle'
  },
  description: 'Your application description here',
  keywords: ['your', 'keywords', 'here'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name/Company',
  publisher: 'Your Name/Company',
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
    siteName: 'Mantle',
    images: [
      {
        url: '/og-image.jpg', // Add your OG image path
        width: 1200,
        height: 630,
        alt: 'Mantle',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mantle',
    description: 'Your application description here',
    images: ['/og-image.jpg'], // Same as OG image
  },
} 