'use client'

import dynamic from 'next/dynamic'
import { PostHogProvider } from "@/components/providers/posthog-provider"

const CookieConsent = dynamic(() => import("@/components/global/cookie-consent").then(mod => mod.CookieConsent), {
  ssr: false,
  loading: () => null
})

interface DynamicComponentsProps {
  children: React.ReactNode
}

export default function DynamicComponents({ children }: DynamicComponentsProps) {
  return (
    <PostHogProvider>
      {children}
      <CookieConsent />
    </PostHogProvider>
  )
} 