"use client"

import { useUserSync } from "@/hooks/useUserSync"
import { SyncMessage } from "@/components/auth/sync-message"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

export default function WelcomeBackPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <WelcomeBackContent />
    </Suspense>
  )
}

function WelcomeBackContent() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/dashboard"
  
  const { isSynced, syncTime } = useUserSync({ redirectTo })

  return (
    <SyncMessage 
      title="Welcome Back"
      message="Preparing your workspace. You'll be redirected shortly..."
      syncStatus={isSynced}
      syncTime={syncTime}
    />
  )
}