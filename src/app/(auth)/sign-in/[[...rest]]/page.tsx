"use client"

import { SignIn } from "@clerk/nextjs"
import { useSearchParams } from "next/navigation"

const Page = () => {
  const searchParams = useSearchParams()
  const intent = searchParams.get("intent")
  
  // Determine the final destination
  const finalDestination = intent ? `/dashboard?intent=${intent}` : "/dashboard"
  
  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <SignIn
        // Redirect to welcome-back page first, but pass the final destination as a parameter
        forceRedirectUrl={`/welcome-back?redirect=${encodeURIComponent(finalDestination)}`}
      />
    </div>
  )
}

export default Page