import type React from "react"
import type { Metadata } from "next"
import { Providers } from "../components/global/providers"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { MantlzProvider } from "@mantlz/nextjs"
import { Toaster } from "@/components/ui/sonner"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Space_Mono, Space_Grotesk } from "next/font/google"
import { Suspense } from 'react'
import ClientWrapper from "@/components/global/client-wrapper"
import { FONT_FAMILIES, type FontFamily } from "@/lib/fonts"
import { FontInitializer } from "@/components/global/font-initializer"
import Script from "next/script"
import { SeoConfig, generateMetadata } from "@/types/seo"

const sansFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: "400",
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial'],
});

const monoFont = Space_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: "400",
  preload: true,
  adjustFontFallback: true,
  fallback: ['monospace'],
});

const seoConfig: SeoConfig = {
  title: "Mantlz - Build Custom Forms with Ease",
  description: "Create powerful, customizable forms with Mantlz. The ultimate form builder platform for businesses and developers. Build, deploy, and analyze forms effortlessly.",
  baseUrl: 'https://mantlz.com',
  siteName: 'Mantlz',
  twitterHandle: '@trymantlz',
  googleSiteVerification: 'lTqIuvXz5sq4jT9YOLyja5LLMfvKAiZF3g5fTEa70fI',
  defaultLocale: 'en_GB'
}

export const metadata: Metadata = {
  ...generateMetadata(seoConfig),
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
  openGraph: {
    ...generateMetadata(seoConfig).openGraph,
    title: 'Mantlz - Professional Form Builder Platform',
    description: 'Create powerful, customizable forms with Mantlz. The ultimate form builder platform for businesses and developers. Build, deploy, and analyze forms effortlessly.',
    url: 'https://mantlz.com',
    siteName: 'Mantlz',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mantlz - Form Builder Platform',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    ...generateMetadata(seoConfig).twitter,
    card: 'summary_large_image',
    title: 'Mantlz - Professional Form Builder Platform',
    description: 'Create powerful, customizable forms with Mantlz. The ultimate form builder platform for businesses and developers. Build, deploy, and analyze forms effortlessly.',
    images: ['/og-image.png'],
    creator: '@trymantlz',
    site: '@trymantlz',
  },
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get the default font (inter)
  const defaultFont = FONT_FAMILIES['inter' as FontFamily]?.font;
  const fontVariable = defaultFont && 'variable' in defaultFont ? defaultFont.variable : '';
  
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" suppressHydrationWarning className={`${sansFont.variable} ${monoFont.variable}`}>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <Script src="https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js" strategy="afterInteractive" />
        </head>
        <body className={`${fontVariable} text-foreground antialiased tracking-wide min-h-screen`}>
          <main className="min-h-screen w-full  text-foreground transition-colors duration-300">
            <Providers>
              <MantlzProvider apiKey={process.env.MANTLZ_KEY}>
                <Suspense fallback={null}>
                  <ClientWrapper>
                    <FontInitializer />
                    {children}
                    <Toaster richColors position="top-center" theme="system" />
                    <SpeedInsights />
                  </ClientWrapper>
                </Suspense>
              </MantlzProvider>
            </Providers>
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}

