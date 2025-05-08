import type React from "react"
import type { Metadata } from "next"
import { Providers } from "../components/global/providers"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { MantlzProvider } from "@mantlz/nextjs"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Space_Mono, Space_Grotesk } from "next/font/google"
import { CookieConsent } from "@/components/global/cookie-consent"

const sansFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: "400",
});

const monoFont = Space_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: "400",
});



export const metadata: Metadata = {
  title: "Mantlz - Build Custom Forms with Ease",
  description: "Create powerful, customizable forms with Mantlz. The ultimate form builder platform for businesses and developers. Build, deploy, and analyze forms effortlessly.",
  metadataBase: new URL('https://mantlz.com'),
  keywords: [
    'form builder',
    'custom forms',
    'online forms',
    'form creation',
    'business forms',
    'form analytics',
    'form management',
    'form templates',
    'survey builder',
    'data collection'
  ],
  authors: [{ name: 'Mantlz Team' }],
  creator: 'Mantlz',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mantlz.com',
    siteName: 'Mantlz',
    title: 'Mantlz - Professional Form Builder Platform',
    description: 'Create powerful, customizable forms with Mantlz. The ultimate form builder platform for businesses and developers. Build, deploy, and analyze forms effortlessly.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mantlz - Form Builder Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mantlz - Professional Form Builder Platform',
    description: 'Create powerful, customizable forms with Mantlz. The ultimate form builder platform for businesses and developers.',
    images: ['/twitter-image.jpg'],
    creator: '@mantlz',
  },
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
    { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    { rel: 'icon', url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
  ],
  manifest: '/site.webmanifest',
  verification: {
    google: 'lTqIuvXz5sq4jT9YOLyja5LLMfvKAiZF3g5fTEa70fI',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    // appearance={{
    //   baseTheme: neobrutalism,  
    // }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${sansFont.variable} ${monoFont.variable} font-regular antialiased tracking-wide`}>
          <main className="h-screen bg-background text-foreground transition-colors duration-300">
            <Providers>
              <MantlzProvider apiKey={process.env.MANTLZ_KEY}>
                {children}
                <Toaster richColors position="top-center" theme="system" />
                <Analytics />
                <SpeedInsights />
                <CookieConsent />
              </MantlzProvider>
            </Providers>
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}

