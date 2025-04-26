"use client"

import { memo, useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, HelpCircle, Settings, Activity, TestTube2, Plus, Menu, User, LogOut, Home, Mail } from "lucide-react"
import { useUser, useClerk } from "@clerk/nextjs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet"
import { Logo } from "@/components/global/logo"
import { SettingsDialog } from "@/components/settings/settings-dialog"
import { NavUserSkeleton } from "@/components/skeletons/navUser-skeleton"
import { BreadcrumbNav } from "@/components/dashboard/breadcum-nav"
import { BreadcrumbSkeleton } from "@/components/skeletons/breadcrumb-skeleton"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { QuestionModal } from "@/components/modals/QuestionModal"

// User dropdown with loading state
const UserDropdown = memo(function UserDropdown() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { signOut, openUserProfile } = useClerk()


  // Show loading state when user data is not yet loaded
  if (!isUserLoaded) {
    return <NavUserSkeleton />
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-200/50 hover:backdrop-blur-sm hover:shadow-sm cursor-pointer dark:hover:bg-zinc-800/40 transition-all duration-200"
          >
            <Avatar className="h-7 w-7 xs:h-8 xs:w-8 ring-2 ring-zinc-100 dark:ring-zinc-800">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
              <AvatarFallback className="bg-zinc-700 text-zinc-100">
                {user?.firstName?.[0] || user?.lastName?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm font-medium">{user?.fullName || "User"}</span>
            <ChevronDown className="hidden sm:inline h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[220px] p-2 m-1 bg-zinc-100/90 backdrop-blur-sm border border-zinc-200/70 dark:bg-zinc-900/90 dark:border-zinc-800/70 shadow-lg rounded-xl"
        >
          <DropdownMenuItem className="hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70 cursor-pointer rounded-lg transition-all duration-200 my-0.5" onClick={() => openUserProfile()}>
            <User className="h-4 w-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70 cursor-pointer rounded-lg transition-all duration-200 my-0.5" 
            asChild
          >
            <SettingsDialog>
              <div className="flex items-center w-full px-2 py-1.5">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </div>
            </SettingsDialog>
          </DropdownMenuItem>
          <Separator className="my-1.5 bg-zinc-300 dark:bg-zinc-700" />
          <DropdownMenuItem className="hover:bg-red-100/70 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 p-2 cursor-pointer rounded-lg transition-all duration-200 my-0.5" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
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
    <>
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
          <SheetTitle className="sr-only">Mantlz Navigation</SheetTitle>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <Link href="/dashboard" className="flex items-center gap-1 xs:gap-2 font-semibold">
                <Logo />
                <span className="text-sm sm:text-base">Mantlz</span>
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-2">
                    Navigation
                  </h3>
                  <div className="space-y-1.5">
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
                        href="/dashboard/campaigns"
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        <span>Campaigns</span>
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

                    <SheetClose asChild>
                      <Link
                        href="/dashboard/form-builder"
                        className="w-full cursor-pointer"
                      >
                        <Button variant="outline" className="w-full cursor-pointer bg-zinc-100/90 dark:bg-zinc-900/90 hover:bg-zinc-200/90 dark:hover:bg-zinc-800/90 backdrop-blur-sm border justify-start gap-2 rounded-lg border-zinc-300 dark:border-zinc-700">
                          <Plus className="h-4 w-4" />
                          <span>Create Form</span>
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-2">
                    Account
                  </h3>
                  <div className="space-y-1.5">
                    {user && (
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-100/50 dark:bg-zinc-800/50">
                        <Avatar className="h-8 w-8 ring-2 ring-zinc-200 dark:ring-zinc-700">
                          <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
                          <AvatarFallback className="bg-zinc-700 text-zinc-100">
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

                    <SheetClose asChild>
                      <button
                        onClick={() => openUserProfile()}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors w-full"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <SettingsDialog>
                        <button className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors w-full">
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </button>
                      </SettingsDialog>
                    </SheetClose>

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
              <QuestionModal
                trigger={
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2 rounded-lg border-zinc-300 dark:border-zinc-700"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Help & Support</span>
                  </Button>
                }
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
})

// Memoized action buttons section with QuestionModal
const ActionButtonsSection = memo(function ActionButtonsSection() {
  return (
    <>
      <QuestionModal 
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg hover:bg-zinc-200/50 hover:backdrop-blur-sm hover:shadow-sm cursor-pointer dark:hover:bg-zinc-800/40 transition-all duration-200"
            aria-label="Help"
          >
            <HelpCircle className="h-4.5 w-4.5" />
          </Button>
        } 
      />

      <SettingsDialog>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg hover:bg-zinc-200/50 hover:backdrop-blur-sm hover:shadow-sm cursor-pointer dark:hover:bg-zinc-800/40 transition-all duration-200"
          aria-label="Settings"
        >
          <Settings className="h-4.5 w-4.5" />
        </Button>
      </SettingsDialog>
    </>
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
        "fixed top-0 left-0 right-0 z-50 dark:bg-zinc-900 flex h-16 items-center justify-between backdrop-blur-sm border-b px-3 sm:px-4 md:px-6 lg:px-8 text-black dark:text-white transition-all duration-300",
        scrolled
          ? "bg-white/90 dark:bg-zinc-950/90 border-zinc-200/70 dark:border-zinc-800/70 shadow-sm"
          : "bg-white/80 dark:bg-zinc-950/80 border-zinc-200/50 dark:border-zinc-800/50"
      )}
    >
      <div className="flex items-center gap-2 md:gap-6">
        <MobileNavMenu />

        <Link href="/dashboard" className="flex items-center gap-1 xs:gap-2 font-semibold group">
          <Logo />
          <span className="text-sm sm:text-base group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-200">Mantlz</span>
        </Link>

        <div className="hidden md:flex items-center gap-2 lg:gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1.5 px-3 py-2 text-sm hover:bg-zinc-200/50 hover:backdrop-blur-sm hover:shadow-sm cursor-pointer dark:hover:bg-zinc-800/40 rounded-lg transition-all duration-200"
              >
                <span>Menu</span>
                <ChevronDown className="h-4 w-4 text-zinc-500 dark:text-zinc-400 transition-transform duration-200" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[220px] p-2 m-1 bg-zinc-100/90 backdrop-blur-sm border border-zinc-200/70 dark:bg-zinc-900/90 dark:border-zinc-800/70 shadow-lg rounded-lg"
            >
              <DropdownMenuItem asChild className="hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70 cursor-pointer rounded-lg transition-all duration-200 my-0.5">
                <Link href="/dashboard" className="flex items-center gap-2.5 py-1.5">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70 cursor-pointer rounded-lg transition-all duration-200 my-0.5">
                <Link href="/dashboard/campaigns" className="flex items-center gap-2.5 py-1.5">
                  <Mail className="h-4 w-4" />
                  <span>Campaigns</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70 cursor-pointer rounded-lg transition-all duration-200 my-0.5">
                <Link href="/dashboard/logs" className="flex items-center gap-2.5 py-1.5">
                  <Activity className="h-4 w-4" />
                  <span>Logs</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70 cursor-pointer rounded-lg transition-all duration-200 my-0.5">
                <Link href="/dashboard/test" className="flex items-center gap-2.5 py-1.5">
                  <TestTube2 className="h-4 w-4" />
                  <span>Test</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70 p-0 rounded-lg my-0.5">
                <Link 
                  href="/dashboard/form-builder"
                  className="flex items-center gap-2.5 w-full px-2 py-1.5 cursor-pointer bg-zinc-100/90 dark:bg-zinc-900/90 hover:bg-zinc-200/90 dark:hover:bg-zinc-800/90 backdrop-blur-sm border justify-start  rounded-lg border-zinc-300 dark:border-zinc-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Form</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator
            orientation="vertical"
            className={cn("mx-1 lg:mx-2", "bg-zinc-300 dark:bg-zinc-700 data-[orientation=vertical]:h-5 opacity-70")}
          />

          <div className="ml-0 lg:ml-1">
            <BreadcrumbSection />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden md:flex items-center gap-2">
          <ActionButtonsSection />
        </div>

        <UserDropdown />
      </div>
    </nav>
  )
})

