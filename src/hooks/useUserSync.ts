import { client } from "@/lib/client"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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
    showingMessage
  }
} 