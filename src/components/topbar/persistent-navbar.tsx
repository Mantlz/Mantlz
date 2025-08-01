"use client"

import { memo, useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, HelpCircle, Settings, Activity, Plus, Menu, User, LogOut, Home, Mail } from "lucide-react"
import { useUser, useClerk } from "@clerk/nextjs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet"
import Image from "next/image"
import { SettingsDialog } from "@/components/settings/settings-dialog"
import { NavUserSkeleton } from "@/components/skeletons/navUser-skeleton"
import { BreadcrumbNav } from "@/components/dashboard/breadcum-nav"
import { BreadcrumbSkeleton } from "@/components/skeletons/breadcrumb-skeleton"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { QuestionModal } from "@/components/modals/QuestionModal"
import { UpgradeButton } from "@/components/global/upgrade-button"

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
            className="flex items-center gap-2 p-1 rounded-lg bg-background dark:bg-background hover:backdrop-blur-sm cursor-pointer transition-all duration-200"
          >
            <Avatar className="h-7 w-7 xs:h-8 xs:w-8 ring-2 ring-border">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
              <AvatarFallback className="bg-background text-black dark:text-white">
                {user?.firstName?.[0] || user?.lastName?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm font-medium">{user?.fullName || "User"}</span>
            <ChevronDown className="hidden sm:inline h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[220px] p-2 m-1 mt-2 bg-popover/95 backdrop-blur-sm border border-border shadow-lg rounded-xl"
        >
          <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-lg transition-all duration-200 my-0.5" onClick={() => openUserProfile()}>
            <User className="h-4 w-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-lg transition-all duration-200 my-0.5" 
            asChild
          >
            <SettingsDialog>
              <div className="flex items-center w-full text-sm px-2 py-1.5 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-lg transition-all duration-200">
                <Settings className="h-4 w-4 mr-2" />

                <span className="ml-2">Settings</span> 

              </div>
            </SettingsDialog>
          </DropdownMenuItem>
          <Separator className="my-1.5 bg-border" />
          <DropdownMenuItem className="hover:bg-destructive/90 bg-destructive text-destructive-foreground p-2 cursor-pointer rounded-lg transition-all duration-200 my-0.5" onClick={() => signOut()}>
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
          <Button variant="ghost" size="icon" className="md:hidden cursor-pointer">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[250px] xs:w-[280px] sm:w-[320px] md:w-[350px] p-0 bg-background border-r border-border"
        >
          <SheetTitle className="sr-only">Mantlz Navigation</SheetTitle>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Link href="/dashboard" className="flex items-center gap-1 xs:gap-2 font-semibold cursor-pointer">
                <Image 
                  src="/logo.png" 
                  alt="Mantlz Logo" 
                  width={24} 
                  height={24} 
                  className="mb-0.5" 
                />
                <span className="text-sm sm:text-base">Mantlz</span>
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                    Navigation
                  </h3>
                  <div className="space-y-1.5">
                    <SheetClose asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                      >
                        <Home className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/dashboard/campaigns"
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                      >
                        <Mail className="h-4 w-4" />
                        <span>Campaigns</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/dashboard/logs"
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                      >
                        <Activity className="h-4 w-4" />
                        <span>Logs</span>
                      </Link>
                    </SheetClose>
                  

                    <SheetClose asChild>
                      <Link
                        href="/dashboard/form"
                        className="w-full cursor-pointer"
                      >
                        <Button variant="outline" 
                            className="h-8 px-2 text-md  bg-amber-500 text-black dark:text-white dark:border-background border text-sm shadow-md shadow-zinc-950/30 ring ring-inset ring-white/20 transition-[filter] duration-200 hover:brightness-125 active:brightness-95"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Create Form</span>
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                    Account
                  </h3>
                  <div className="space-y-1.5">
                    {user && (
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
                        <Avatar className="h-8 w-8 ring-2 ring-border">
                          <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user?.firstName?.[0] || user?.lastName?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{user?.fullName || "User"}</span>
                          <span className="text-xs text-muted-foreground">
                            {user?.primaryEmailAddress?.emailAddress}
                          </span>
                        </div>
                      </div>
                    )}

                    <SheetClose asChild>
                      <button
                        onClick={() => openUserProfile()}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors w-full cursor-pointer"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </button>
                    </SheetClose>

                    <SheetClose asChild>
                      <SettingsDialog>
                        <button className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors w-full cursor-pointer">
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </button>
                      </SettingsDialog>
                    </SheetClose>

                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors w-full cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border">
              <QuestionModal
                trigger={
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2 rounded-lg border-border cursor-pointer"
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
          className="h-9 w-9 rounded-lg hover:bg-accent hover:text-accent-foreground  cursor-pointer transition-all duration-200"
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
          className="h-9 w-9 rounded-lg hover:bg-accent hover:text-accent-foreground  cursor-pointer transition-all duration-200"
          aria-label="Settings"
        >
          <Settings className="h-4.5 w-4.5" />
        </Button>
      </SettingsDialog>
        <UpgradeButton />
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
        "fixed top-0 left-0 right-0 z-50  flex h-16 items-center justify-between backdrop-blur-sm border-b px-3 sm:px-4 md:px-6 lg:px-8 text-foreground transition-all duration-300",
        scrolled
          ? "bg-background border-border/70 "
          : "bg-background border-border/50"
      )}
    >
      <div className="flex items-center gap-2 md:gap-6">
        <MobileNavMenu />

        <Link href="/dashboard" className="hidden md:flex items-center gap-1 xs:gap-2 font-semibold group cursor-pointer">
        <Image 
          src="/logo.png" 
          alt="Mantlz Logo" 
          width={24} 
          height={24} 
          className="mb-0.5 " 
        />

          <span className="text-sm sm:text-base group-hover:text-muted-foreground transition-colors duration-200">Mantlz</span>
        </Link>

        <div className="hidden md:flex items-center gap-2 lg:gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1.5 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground  cursor-pointer rounded-lg transition-all duration-200"
              >
                <span>Menu</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[220px] p-2 m-1  bg-popover/95 backdrop-blur-sm border border-border shadow-lg rounded-lg"
            >
              <DropdownMenuItem asChild className="hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-lg transition-all duration-200 my-0.5">
                <Link href="/dashboard" className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-lg transition-all duration-200 my-0.5">
                <Link href="/dashboard/campaigns" className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                  <Mail className="h-4 w-4" />
                  <span>Campaigns</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-lg transition-all duration-200 my-0.5">
                <Link href="/dashboard/logs" className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                  <Activity className="h-4 w-4" />
                  <span>Logs</span>
                </Link>
              </DropdownMenuItem>
    
              <DropdownMenuItem asChild className="rounded-lg my-1">
                <Link 
                  href="/dashboard/form"
                            className="h-9 px-2 text-md  bg-amber-500 text-black/70  hover:text-black dark:text-white dark:border-backgroundborder text-sm shadow-zinc-950/30 ring-2 ring-inset ring-white hover:ring-amber-600 transition-[filter] duration-200 hover:brightness-125 active:brightness-95 cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-black/70 dark:text-white" />
                  <span>Create Form</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator
            orientation="vertical"
            className={cn("mx-1 lg:mx-2", "bg-border data-[orientation=vertical]:h-5 opacity-70")}
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

