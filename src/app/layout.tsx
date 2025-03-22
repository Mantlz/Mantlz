import type { Metadata } from "next"
import { Providers } from "../components/global/providers"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import MantlzWrapper from "../components/MantlzWrapper"

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
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">
          <main className="min-h-[calc(100vh-1px)] flex flex-col font-sans bg-white dark:bg-zinc-800 text-foreground">
            <Providers>
              <MantlzWrapper apiKey={process.env.MANTLZ_KEY}
              
              
              >
                {children}
              </MantlzWrapper>
            </Providers>
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}