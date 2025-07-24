'use client'

import { PostHogProvider } from "@/components/providers/posthog-provider"
import C15TWrapper from "./c15t-wrapper"

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <PostHogProvider>
      <C15TWrapper>
        {children}
      </C15TWrapper>
    </PostHogProvider>
  )
}