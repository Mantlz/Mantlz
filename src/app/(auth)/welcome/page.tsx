// app/(auth)/welcome/page.tsx
"use client"

import { Heading } from "@/components/global/heading"
import { LoadingSpinner } from "@/components/global/loading-spinner"
import { BackgroundPattern } from "@/components/global/background-pattern"
import { client } from "@/lib/client"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Page = () => {
  const router = useRouter()
  const [showingMessage, setShowingMessage] = useState(true)

  const { data: syncResponse, isSuccess } = useQuery({
    queryFn: async () => {
      const response = await client.auth.getDatabaseSyncStatus.$get()
      const data = await response.json()
      console.log('Sync response:', data)
      return data
    },
    queryKey: ["get-database-sync-status"],
    refetchInterval: (query) => {
      const data = query.state.data
      console.log('Current sync state:', data)
      return data?.isSynced ? false : 1000
    },
  })

  useEffect(() => {
    if (isSuccess && syncResponse?.isSynced && showingMessage) {
      console.log('Starting redirect timer...')
      const timer = setTimeout(() => {
        setShowingMessage(false)
        console.log('Redirecting to dashboard...')
        router.push("/dashboard")
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isSuccess, syncResponse, router, showingMessage])

  return (
    <div className="flex w-full flex-1 items-center justify-center px-4 min-h-screen">
      <BackgroundPattern className="absolute inset-0" />

      <div className="relative z-10 flex -translate-y-1/2 flex-col items-center gap-4 md:gap-6 text-center max-w-[90%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%]">
        <LoadingSpinner size="md" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
        <Heading className="text-2xl sm:text-3xl md:text-4xl">
            Creating your account...
          </Heading>
        <div className="">
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-prose px-4">
            Just a moment while we set things up for you.
          </p>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs sm:text-sm text-gray-400">
            Sync status: {syncResponse?.isSynced ? 'Synced' : 'Syncing...'}
          </div>
        )}
      </div>
    </div>
  )
}

export default Page