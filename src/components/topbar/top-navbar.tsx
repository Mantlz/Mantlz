"use client"

import { useState, useEffect, memo } from "react"
import Link from "next/link"
import { ChevronDown, HelpCircle, Settings, Activity, TestTube2 } from "lucide-react"
import { useUser, useClerk } from "@clerk/nextjs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BreadcrumbNav } from "@/components/dashboard/breadcum-nav"
import { Logo } from "@/components/global/logo"
import { SettingsDialog } from "@/components/settings/settings-dialog"
import { NavUserSkeleton } from "@/components/skeletons/navUser-skeleton"
import { BreadcrumbSkeleton } from "@/components/skeletons/breadcrumb-skeleton"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { QuestionModal } from "@/components/modals/QuestionModal"
import { UpgradeButton } from "@/components/global/upgrade-button"

// Custom hook for handling mounted state
function useIsMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}

// Memoized user profile section
const UserProfileSection = memo(function UserProfileSection() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { signOut, openUserProfile } = useClerk()

  if (!isUserLoaded) {
    return <NavUserSkeleton />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center cursor-pointer gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-800">
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
      <DropdownMenuContent align="end" className="w-[220px] bg-zinc-200 border-zinc-800 dark:bg-zinc-900 dark:border-zinc-800">
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

// Memoized navigation section
const NavigationSection = memo(function NavigationSection() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1 px-1 hover:bg-zinc-800 cursor-pointer">
          <span>Navigation</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[220px] bg-white dark:bg-zinc-900 border-zinc-800">
        <DropdownMenuItem asChild className="hover:bg-zinc-800 cursor-pointer">
          <Link href="/dashboard/logs" className="flex items-center gap-2 cursor-pointer">
            <Activity className="h-4 w-4" />
            <span>Logs</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-zinc-800 cursor-pointer">
          <Link href="/dashboard/test" className="flex items-center gap-2 cursor-pointer">
            <TestTube2 className="h-4 w-4" />
            <span>Test</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-zinc-800 p-0 cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >

        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

// Memoized action buttons section
const ActionButtonsSection = memo(function ActionButtonsSection() {
  return (
    <div className="flex items-center gap-4">
      
      <QuestionModal 
        trigger={
          <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-lg hover:bg-zinc-800 cursor-pointer"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        }
      />

      <SettingsDialog>
        <Button variant="ghost" size="icon" className="rounded-lg hover:bg-zinc-800 relative cursor-pointer">
          <Settings className="h-5 w-5" />
          <span className="absolute top-0.5 -right-1 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">⌘/S</span>
        </Button>
      </SettingsDialog>
      <UpgradeButton />
    </div>
  )
})

export const Navbar = memo(function Navbar() {
  const mounted = useIsMounted()
  const [scrolled, setScrolled] = useState(false)
  
  // Effect to track scroll position
  useEffect(() => {
    if (!mounted) return
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled, mounted])

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between bg-black px-4 text-white">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold cursor-pointer">
            <Logo />
            <p className="text-xs text-gray-500 dark:text-gray-400">Beta</p>
            <span>Mantlz</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">v0.0.1</p>
          </Link>
        </div>
      </nav>
    )
  }

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between backdrop-blur-md border-b px-4 text-black dark:text-white transition-all duration-200",
        scrolled 
          ? "bg-white dark:bg-zinc-950/70 border-zinc-200/70 dark:border-zinc-800/70" 
          : "bg-white dark:bg-zinc-950/95 border-zinc-200 dark:border-zinc-800"
      )}
    >
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-semibold cursor-pointer">
          <Logo />
          <span>Mantlz</span>
        </Link>

        <NavigationSection />
        
        <Separator
          orientation="vertical"
          className={cn(
            "mx-2",
            "bg-zinc-300 dark:bg-zinc-800 data-[orientation=vertical]:h-4"
          )}
        />
        
        <div className="ml-1">
          <BreadcrumbSection />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ActionButtonsSection />
        <UserProfileSection />
      </div>
    </nav>
  )
})

