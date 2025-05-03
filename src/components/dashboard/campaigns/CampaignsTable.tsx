"use client"

import { CampaignsTable as ModularTable } from "./table"

interface CampaignsTableProps {
  itemsPerPage?: number
}

export function CampaignsTable({ itemsPerPage = 8 }: CampaignsTableProps) {
  return <ModularTable itemsPerPage={itemsPerPage} />
} 