"use client"

import { Suspense } from "react"
import { CampaignsGridSkeleton } from "../../../../components/skeletons"
import { CampaignsTableContent } from "./CampaignsTableContent"

interface CampaignsTableProps {
  itemsPerPage?: number
  isPremium?: boolean
  onUpgradeClick?: () => void
}

export function CampaignsTable({ itemsPerPage = 8, isPremium = false, onUpgradeClick }: CampaignsTableProps) {
  return (
    <Suspense fallback={<CampaignsGridSkeleton />}>
      <CampaignsTableContent itemsPerPage={itemsPerPage} isPremium={isPremium} onUpgradeClick={onUpgradeClick} />
    </Suspense>
  )
} 