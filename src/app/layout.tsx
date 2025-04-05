import type React from "react"
import type { Metadata } from "next"
import { Providers } from "../components/global/providers"
import { ClerkProvider } from "@clerk/nextjs"
import { neobrutalism } from "@clerk/themes"
import "./globals.css"
import { MantlzProvider } from "@mantlz/nextjs"
import { Toaster } from "@/components/ui/sonner"
import { Space_Mono, Space_Grotesk } from "next/font/google"

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
  title: "Mantlz",
  description: "Mantlz - Your Personalized Forms Platform",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
              <MantlzProvider apiKey={process.env.MANTLZ_KEY}>{children}</MantlzProvider>
            </Providers>
          </main>
          <Toaster richColors position="top-center" theme="system" />
        </body>
      </html>
    </ClerkProvider>
  )
}

