// app/(auth)/welcome/page.tsx
"use client"

import { useUserSync } from "@/hooks/useUserSync"
import { SyncMessage } from "@/components/auth/sync-message"
import { useSearchParams } from "next/navigation"

export default function WelcomePage() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/dashboard"
  
  const { isSynced } = useUserSync({ redirectTo })

  return (
    <SyncMessage 
      title="Welcome to Mantle"
      message="Setting up your workspace..."
      syncStatus={isSynced}
    />
  )
}