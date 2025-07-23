'use client'

import { PostHogProvider } from "@/components/providers/posthog-provider"
import {
  ConsentManagerProvider,
  CookieBanner,
  ConsentManagerDialog
} from "@c15t/nextjs"

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <PostHogProvider>
      <ConsentManagerProvider options={{
        mode: 'c15t',
        backendURL: process.env.NEXT_PUBLIC_C15T_URL || 'https://daly-jean-111nte1o-europe-onboarding.c15t.dev'
      }}>
        {children}
        <CookieBanner />
        <ConsentManagerDialog />
      </ConsentManagerProvider>
    </PostHogProvider>
  )
}