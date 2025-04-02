"use client"

import { createContext, useContext, useRef, useState, useEffect, ReactNode, memo } from "react"
import { Navbar } from "@/components/topbar/top-navbar"

// Context to store the navbar reference
const NavbarContext = createContext<{ navbarElement: HTMLDivElement | null }>({
  navbarElement: null,
})

export function useNavbar() {
  return useContext(NavbarContext)
}

interface NavbarProviderProps {
  children: ReactNode
}

export const NavbarProvider = memo(function NavbarProvider({ children }: NavbarProviderProps) {
  const [isMounted, setIsMounted] = useState(false)
  const navbarRef = useRef<HTMLDivElement | null>(null)

  // Set mounted state
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Effect to create portal container
  useEffect(() => {
    const portalContainer = document.createElement("div")
    portalContainer.id = "navbar-portal"
    portalContainer.className = "fixed top-0 left-0 right-0 z-50"
    document.body.insertBefore(portalContainer, document.body.firstChild)
    navbarRef.current = portalContainer

    return () => {
      if (portalContainer && document.body.contains(portalContainer)) {
        document.body.removeChild(portalContainer)
      }
    }
  }, [])

  // Only render once mounted to prevent hydration issues
  if (!isMounted || !navbarRef.current) {
    return <>{children}</>
  }

  return (
    <NavbarContext.Provider value={{ navbarElement: navbarRef.current }}>
      <NavbarPortal />
      {children}
    </NavbarContext.Provider>
  )
})

// Component that renders the navbar in the portal
const NavbarPortal = memo(function NavbarPortal() {
  const { navbarElement } = useNavbar()
  
  useEffect(() => {
    if (!navbarElement) return

    // Render the navbar inside the portal container
    const navbarInstance = document.createElement("div")
    navbarElement.appendChild(navbarInstance)
    
    // Clean up function
    return () => {
      if (navbarElement.contains(navbarInstance)) {
        navbarElement.removeChild(navbarInstance)
      }
    }
  }, [navbarElement])
  
  return null
})

// The actual navbar component that will be rendered only once
export const PersistentNavbar = memo(function PersistentNavbar() {
  return <Navbar />
}) 