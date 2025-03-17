// hooks/useUser.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { useUser as useClerkUser } from "@clerk/nextjs"
import { getDatabaseSyncStatus } from "@/app/actions/users"

export function useUser() {
  const { user, isLoaded: isClerkLoaded } = useClerkUser()

  const { data: syncData, isLoading: isSyncLoading } = useQuery({
    queryKey: ["userSync", user?.id],
    queryFn: getDatabaseSyncStatus,
    enabled: isClerkLoaded && !!user,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true,
  })

  const isAuthenticated = isClerkLoaded && !!user
  const isSynced = isAuthenticated && syncData?.isSynced

  return {
    user,
    isAuthenticated,
    isSynced,
    isLoading: !isClerkLoaded || (isAuthenticated && isSyncLoading),
  }
}