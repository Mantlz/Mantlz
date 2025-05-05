"use client"

import { CampaignsTable } from "./table"

interface CampaignsTableProps {
  itemsPerPage?: number
  isPremium?: boolean
  onUpgradeClick?: () => void
}

export function CampaignsTableWrapper({ itemsPerPage = 8, isPremium = false, onUpgradeClick }: CampaignsTableProps) {
  return <CampaignsTable itemsPerPage={itemsPerPage} isPremium={isPremium} onUpgradeClick={onUpgradeClick} />
} 