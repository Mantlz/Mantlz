"use client"

import { memo, useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, HelpCircle, Settings, Activity, TestTube2, Plus, Menu, User, LogOut, Home } from "lucide-react"
import { useUser, useClerk } from "@clerk/nextjs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
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
        <Button
          variant="ghost"
          className="flex items-center gap-1 xs:gap-2 p-1 xs:p-2 hover:bg-zinc-200 cursor-pointer dark:hover:bg-zinc-800"
        >
          <Avatar className="h-7 w-7 xs:h-8 xs:w-8">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
            <AvatarFallback className="bg-zinc-700">
              {user?.firstName?.[0] || user?.lastName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-xs md:text-sm">{user?.fullName || "User"}</span>
          <ChevronDown className="hidden sm:inline h-3 w-3 md:h-4 md:w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[200px] p-2 m-1 bg-zinc-100 border-zinc-800 dark:bg-zinc-900 dark:border-zinc-800"
      >
        <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer" onClick={() => openUserProfile()}>
          <User className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer" onClick={() => openUserProfile()}>
          <Settings className="h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-zinc-800 bg-red-400 p-2 cursor-pointer" onClick={() => signOut()}>
          <LogOut className="h-4 w-4" />
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

// Mobile navigation menu
const MobileNavMenu = memo(function MobileNavMenu() {
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[250px] xs:w-[280px] sm:w-[320px] md:w-[350px] p-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
            <Link href="/dashboard" className="flex items-center gap-1 xs:gap-2 font-semibold">
              <Logo />
              <span className="hidden xs:inline text-sm sm:text-base">Mantlz</span>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-6">
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-2">
                  Navigation
                </h3>
                <div className="space-y-1">
                  <SheetClose asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/dashboard/logs"
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Activity className="h-4 w-4" />
                      <span>Logs</span>
                    </Link>
                  </SheetClose>


                  <SheetClose asChild>
                    <Link
                      href="/dashboard/test"
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <TestTube2 className="h-4 w-4" />
                      <span>Test</span>
                    </Link>
                  </SheetClose>

                  <div className="px-3 py-2">
                    <TemplateDialog
                      trigger={
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Plus className="h-4 w-4" />
                          <span>Create Form</span>
                        </Button>
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-2">
                  Account
                </h3>
                <div className="space-y-1">
                  {user && (
                    <div className="flex items-center gap-3 px-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
                        <AvatarFallback className="bg-zinc-700">
                          {user?.firstName?.[0] || user?.lastName?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user?.fullName || "User"}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {user?.primaryEmailAddress?.emailAddress}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => openUserProfile()}
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors w-full"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => openUserProfile()}
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors w-full"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>Help & Support</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
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

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 dark:bg-zinc-900 flex h-14 items-center justify-between backdrop-blur-sm border-b px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 text-black dark:text-white transition-all duration-200",
        scrolled
          ? "bg-white dark:bg-zinc-950 border-zinc-200/70 dark:border-zinc-800/70"
          : "bg-white dark:bg-zinc-950/10 border-zinc-200 dark:border-zinc-800",
      )}
    >
      <div className="flex items-center gap-2 md:gap-6">
        <MobileNavMenu />

        <Link href="/dashboard" className="flex items-center gap-1 xs:gap-2 font-semibold">
          <Logo />
          <span className="hidden xs:inline text-sm sm:text-base">Mantlz</span>
        </Link>

        <div className="hidden md:flex items-center gap-2 lg:gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1 px-1 text-xs lg:text-sm hover:bg-zinc-200 cursor-pointer dark:hover:bg-zinc-800"
              >
                <span>Navigation</span>
                <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[180px] md:w-[200px] lg:w-[220px] p-2 m-1 bg-zinc-100 border-zinc-800 dark:bg-zinc-900 dark:border-zinc-800"
            >
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
              <DropdownMenuItem className="hover:bg-zinc-800 p-0" onSelect={(e) => e.preventDefault()}>
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
            className={cn("mx-1 lg:mx-2", "bg-zinc-400 dark:bg-zinc-800 data-[orientation=vertical]:h-4")}
          />

          <div className="ml-0 lg:ml-1">
            <BreadcrumbSection />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 xs:gap-2 md:gap-3 lg:gap-4">
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:h-9 lg:w-9 rounded-lg hover:bg-zinc-200 cursor-pointer dark:hover:bg-zinc-800"
          >
            <HelpCircle className="h-4 w-4 lg:h-5 lg:w-5" />
          </Button>

          <SettingsDialog>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 lg:h-9 lg:w-9 rounded-lg hover:bg-zinc-200 cursor-pointer dark:hover:bg-zinc-800 relative"
            >
              <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
          </SettingsDialog>
        </div>

        <UserDropdown />
      </div>
    </nav>
  )
})

