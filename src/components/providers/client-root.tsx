"use client"

import { memo, ReactNode } from "react"
import { PersistentNavbar } from "../sidebar/persistent-navbar"

interface ClientRootProps {
  children: ReactNode
}

export const ClientRoot = memo(function ClientRoot({ children }: ClientRootProps) {
  return (
    <>
      <PersistentNavbar />
      {children}
    </>
  )
}) 