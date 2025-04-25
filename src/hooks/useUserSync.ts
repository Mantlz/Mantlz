import { client } from "@/lib/client"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"

interface UseUserSyncProps {
  redirectTo?: string
  redirectDelay?: number
}

export function useUserSync({ 
  redirectTo = "/dashboard",
  redirectDelay = 2000 
}: UseUserSyncProps = {}) {
  const router = useRouter()
  const [showingMessage, setShowingMessage] = useState(true)
  const startTime = useRef(Date.now())
  const [syncTimeEstimate, setSyncTimeEstimate] = useState(15) // Initial estimate in seconds
  const [elapsedTime, setElapsedTime] = useState(0)

  // Track elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime.current) / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const { data: syncResponse, isSuccess } = useQuery({
    queryFn: async () => {
      const response = await client.auth.getDatabaseSyncStatus.$get()
      return response.json()
    },
    queryKey: ["get-database-sync-status"],
    refetchInterval: (query) => {
      return query.state.data?.isSynced ? false : 1000
    },
  })

  // Adjust sync time estimate based on elapsed time
  useEffect(() => {
    if (elapsedTime > 0 && elapsedTime % 3 === 0 && !syncResponse?.isSynced) {
      setSyncTimeEstimate(prev => {
        // Dynamically adjust the estimate based on how long it's actually taking
        if (elapsedTime > prev * 0.7) {
          return Math.max(prev + 5, Math.floor(elapsedTime * 1.5))
        }
        return prev
      })
    }
  }, [elapsedTime, syncResponse])

  useEffect(() => {
    if (isSuccess && syncResponse?.isSynced && showingMessage) {
      const timer = setTimeout(() => {
        setShowingMessage(false)
        router.push(redirectTo)
      }, redirectDelay)

      return () => clearTimeout(timer)
    }
  }, [isSuccess, syncResponse, router, showingMessage, redirectTo, redirectDelay])

  return {
    isSuccess,
    isSynced: syncResponse?.isSynced,
    showingMessage,
    syncTime: syncTimeEstimate,
    elapsedTime
  }
} 