"use client"

import { LogsTable as ModularTable } from "./table"

interface LogsTableProps {
  itemsPerPage?: number
}

export function LogsTable({ itemsPerPage = 8 }: LogsTableProps) {
  return <ModularTable itemsPerPage={itemsPerPage} />
}

