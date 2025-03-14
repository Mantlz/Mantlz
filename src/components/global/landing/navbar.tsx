'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, LayoutDashboard } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { UserButton, SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

type NavItem = {
  name: string
  href: string
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'Blog', href: '/blog' },
]

export default function Navbar() {
  const currentPath = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') {
      return currentPath === href
    }
    return currentPath?.startsWith(href) || false
  }



  return (
    <header className="fixed top-0 left-0 right-0 z-50  bg-background/95 backdrop-blur-xs ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <svg className="h-8 w-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span className="ml-2 text-xl font-bold bg-linear-to-bl from-primary to-primary-foreground bg-clip-text text-transparent">Waitlizt</span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`inline-flex flex-col items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-orange-500'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="h-1 w-1 mt-1 rounded-full bg-orange-600" aria-hidden="true" />
                )}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground transition-colors duration-200 bg-orange-500 text-white dark:bg-white hover:bg-orange-500 dark:text-black">
                  {/* <LayoutDashboard className="w-4 h-4 mr-2" /> */}
                  Dashboard
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="transition-colors duration-200">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className=" cursor-pointer bg-zinc-800  text-white hover:bg-primary/90 transition-colors duration-200">Sign Up</Button>
              </Link>
            </SignedOut>
          </div>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>
                  <div className="flex items-center justify-center">
                    <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    <span className="ml-2 text-xl font-bold bg-linear-to-r from-primary to-primary-foreground bg-clip-text text-transparent">Konect</span>
                  </div>
                </DrawerTitle>
              </DrawerHeader>
              <div className="px-4 py-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {item.name}
                    {isActive(item.href) && (
                      <span className="ml-2 h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
                    )}
                  </Link>
                ))}
                <SignedIn>
                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-orange-500 transition-colors duration-200"
                  >
                    {/* <LayoutDashboard className="w-4 h-4 mr-2" /> */}
                    Dashboard
                  </Link>

                </SignedIn>


                <SignOutButton>
                  <Button variant="ghost" size="sm" className="text-muted-foreground  hover:text-foreground transition-colors duration-200 bg-orange-500 text-white dark:bg-white hover:bg-orange-500 dark:text-black">Sign Out</Button>
                </SignOutButton>
              
              </div>
              <DrawerFooter>
                <div className="flex flex-col items-center space-y-4">
                  
    
                  <SignedOut>
                    <Link href="/sign-in" className="w-full">
                      <Button variant="outline" className="w-full transition-colors duration-200">Sign In</Button>
                    </Link>
                    <Link href="/sign-up" className="w-full">
                      <Button className="w-full bg-red-500 text-primary-foreground hover:bg-primary/90 transition-colors duration-200">Sign Up</Button>
                    </Link>
                  </SignedOut>
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full">Close</Button>
                  </DrawerClose>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  )
}