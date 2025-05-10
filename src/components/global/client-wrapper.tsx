'use client'

import dynamic from 'next/dynamic'
import { PostHogProvider } from "@/components/providers/posthog-provider"

const CookieConsent = dynamic(() => import("@/components/global/cookie-consent").then(mod => mod.CookieConsent), {
  ssr: false,
  loading: () => null
})

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <PostHogProvider>
      {children}
      <CookieConsent />
    </PostHogProvider>
  )
} 