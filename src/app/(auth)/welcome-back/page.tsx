"use client"

import { useUserSync } from "@/hooks/useUserSync"
import { SyncMessage } from "@/components/auth/sync-message"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

export default function WelcomeBackPage() {
  return (
    <Suspense>
      <WelcomeBackContent />
    </Suspense>
  )
}

function WelcomeBackContent() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/dashboard"
  const paymentSuccess = searchParams.get("payment")
  const sessionId = searchParams.get("session_id")
  
  // Preserve payment success parameters if they exist
  const finalRedirectTo = paymentSuccess === "success" && sessionId
    ? `${redirectTo}?payment=success&session_id=${sessionId}`
    : redirectTo
  
  const { isSynced, syncTime } = useUserSync({ redirectTo: finalRedirectTo })

  return (
    <SyncMessage 
      title="Welcome Back"
      message="Preparing your workspace. You'll be redirected shortly..."
      syncStatus={isSynced}
      syncTime={syncTime}
    />
  )
}