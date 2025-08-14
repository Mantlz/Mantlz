// app/(auth)/welcome/page.tsx
"use client"

import { useUserSync } from "@/hooks/useUserSync"
import { SyncMessage } from "@/components/auth/sync-message"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

export default function WelcomePage() {
  return (
    <Suspense>
      <WelcomeContent />
    </Suspense>
  )
}

function WelcomeContent() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/dashboard"
  
  const { isSynced, syncTime } = useUserSync({ redirectTo })

  return (
    <SyncMessage 
      title="Welcome to Mantlz"
      message="Setting up your workspace for the first time. This should only take a moment..."
      syncStatus={isSynced}
      syncTime={syncTime}
    />
  )
}