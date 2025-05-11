"use client"

import { TableHeader } from "./table/TableHeader"
import { LogsTableHeaderProps } from "./table/types"

export function LogsTableHeader(props: LogsTableHeaderProps) {
  return <TableHeader {...props} />
} 