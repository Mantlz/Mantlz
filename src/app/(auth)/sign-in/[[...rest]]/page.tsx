"use client"

import { SignIn } from "@clerk/nextjs"
import { useSearchParams } from "next/navigation"

export default function Page() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/dashboard"
  
  return (
    <div className="flex text-center justify-center">
      <SignIn fallbackRedirectUrl="/welcome-back" forceRedirectUrl="/welcome-back" />
    </div>
  )
}