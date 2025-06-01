"use client"

import { LogsTable as ModularTable } from "./table"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { fetchUserForms } from "./table/tableUtils"

interface LogsTableProps {
  itemsPerPage?: number
}

export function LogsTable({ itemsPerPage = 8 }: LogsTableProps) {
  const queryClient = useQueryClient()
  
  // Single focused effect for data preparation
  useEffect(() => {
    // Immediate data setup on mount
    queryClient.prefetchQuery({
      queryKey: ["userForms", 1, itemsPerPage],
      queryFn: () => fetchUserForms(1, itemsPerPage)
    })
  }, [queryClient, itemsPerPage])
  
  return <ModularTable itemsPerPage={itemsPerPage} />
}

