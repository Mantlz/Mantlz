"use client"

import { memo, ReactNode } from "react"
import { PersistentNavbar } from "../topbar/persistent-navbar"

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