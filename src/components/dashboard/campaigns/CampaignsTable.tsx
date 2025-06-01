"use client"

import { CampaignsTable } from "./table"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { fetchUserForms } from "./table/tableUtils"

interface CampaignsTableProps {
  itemsPerPage?: number
  isPremium?: boolean
  onUpgradeClick?: () => void
}

export function CampaignsTableWrapper({ itemsPerPage = 8, isPremium = false, onUpgradeClick }: CampaignsTableProps) {
  const queryClient = useQueryClient()
  
  // Single focused effect for data preparation
  useEffect(() => {
    // Immediate data setup on mount
    queryClient.prefetchQuery({
      queryKey: ["userForms", 1, itemsPerPage],
      queryFn: () => fetchUserForms(1, itemsPerPage)
    })
  }, [queryClient, itemsPerPage])
  
  return <CampaignsTable itemsPerPage={itemsPerPage} isPremium={isPremium} onUpgradeClick={onUpgradeClick} />
} 