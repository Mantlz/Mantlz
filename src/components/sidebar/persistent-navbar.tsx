"use client"

import { memo, useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, HelpCircle, Settings, Activity, TestTube2, Plus } from "lucide-react"
import { useUser, useClerk } from "@clerk/nextjs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/global/logo"
import { SettingsDialog } from "@/components/settings/settings-dialog"
import { NavUserSkeleton } from "@/components/skeletons/navUser-skeleton"
import { BreadcrumbNav } from "@/components/dashboard/breadcum-nav"
import { BreadcrumbSkeleton } from "@/components/skeletons/breadcrumb-skeleton"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { TemplateDialog } from "@/components/forms/template-dialog"

// User dropdown with loading state
const UserDropdown = memo(function UserDropdown() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { signOut, openUserProfile } = useClerk()

  // Show loading state when user data is not yet loaded
  if (!isUserLoaded) {
    return <NavUserSkeleton />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 hover:bg-zinc-200 cursor-pointer dark:hover:bg-zinc-800">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
            <AvatarFallback className="bg-zinc-700">
              {user?.firstName?.[0] || user?.lastName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{user?.fullName || "User"}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] p-2 m-1 bg-zinc-100 border-zinc-800 dark:bg-zinc-900 dark:border-zinc-800">
        <DropdownMenuItem 
          className="hover:bg-zinc-800 cursor-pointer"
          onClick={() => openUserProfile()}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-zinc-800 cursor-pointer"
          onClick={() => openUserProfile()}
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-zinc-800 bg-red-400 p-2 cursor-pointer"
          onClick={() => signOut()}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

// Breadcrumb section with loading state
const BreadcrumbSection = memo(function BreadcrumbSection() {
  const [isLoading, setIsLoading] = useState(true)
  
  // Set a short timeout to simulate loading and avoid flashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <BreadcrumbSkeleton />
  }

  return <BreadcrumbNav />
})

export const PersistentNavbar = memo(function PersistentNavbar() {
  const [scrolled, setScrolled] = useState(false)
  
  // Effect to track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])
  
  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 dark:bg-zinc-900 flex h-14 items-center justify-between backdrop-blur-sm border-b px-4 text-black dark:text-white transition-all duration-200",
        scrolled 
          ? "bg-white dark:bg-zinc-950 border-zinc-200/70 dark:border-zinc-800/70" 
          : "bg-white dark:bg-zinc-950/10 border-zinc-200 dark:border-zinc-800"
      )}
    >
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Logo />
          <span>Mantlz</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-1 px-1 hover:bg-zinc-200 cursor-pointer dark:hover:bg-zinc-800">
              <span>Navigation</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[220px] p-2 m-1 bg-zinc-100 border-zinc-800 dark:bg-zinc-900 dark:border-zinc-800">
            <DropdownMenuItem asChild className="hover:bg-zinc-800 cursor-pointer">
              <Link href="/dashboard/logs" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span>Logs</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-zinc-800 cursor-pointer">
              <Link href="/dashboard/test" className="flex items-center gap-2">
                <TestTube2 className="h-4 w-4" />
                <span>Test</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="hover:bg-zinc-800 p-0"
              onSelect={(e) => e.preventDefault()}
            >
              <TemplateDialog 
                trigger={
                  <div className="flex items-center gap-2 w-full px-2 py-1.5">
                    <Plus className="h-4 w-4" />
                    <span>Create Form</span>
                  </div>
                }
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Separator
          orientation="vertical"
          className={cn(
            "mx-2",
            "bg-zinc-400 dark:bg-zinc-800 data-[orientation=vertical]:h-4"
          )}
        />
        
        <div className="ml-1">
          <BreadcrumbSection />
        </div>
      </div>

      <div className="flex items-center gap-4">

        <Button variant="ghost" size="icon" className="rounded-lg hover:bg-zinc-200 cursor-pointer dark:hover:bg-zinc-800">
          <HelpCircle className="h-5 w-5" />
        </Button>

        <SettingsDialog>
          <Button variant="ghost" size="icon" className="rounded-lg hover:bg-zinc-200 cursor-pointer dark:hover:bg-zinc-800">
            <Settings className="h-5 w-5" />
          </Button>
        </SettingsDialog>

        <UserDropdown />
      </div>
    </nav>
  )
}) 