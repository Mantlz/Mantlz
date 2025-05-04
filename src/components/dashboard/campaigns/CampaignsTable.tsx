"use client"

import { CampaignsTable as ModularTable } from "./table"

interface CampaignsTableProps {
  itemsPerPage?: number
  isPremium?: boolean
  onUpgradeClick?: () => void
}

export function CampaignsTable({ itemsPerPage = 8, isPremium = false, onUpgradeClick }: CampaignsTableProps) {
  return <ModularTable itemsPerPage={itemsPerPage} isPremium={isPremium} onUpgradeClick={onUpgradeClick} />
} 