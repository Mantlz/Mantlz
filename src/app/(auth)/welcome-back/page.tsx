"use client"

import { useUserSync } from "@/hooks/useUserSync"
import { SyncMessage } from "@/components/auth/sync-message"
import { useSearchParams } from "next/navigation"

export default function WelcomeBackPage() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/dashboard"
  
  const { isSynced, syncTime, elapsedTime } = useUserSync({ redirectTo })

  return (
    <SyncMessage 
      title="Welcome Back"
      message="Preparing your workspace. You'll be redirected shortly..."
      syncStatus={isSynced}
      syncTime={syncTime}
    />
  )
}