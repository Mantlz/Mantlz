'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, LayoutDashboard } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { UserButton, SignedIn, SignedOut, SignOutButton, useClerk } from '@clerk/nextjs'
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
import { Logo } from '@/components/global/logo'

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
  const { loaded } = useClerk()

  const isActive = (href: string) => {
    if (href === '/') {
      return currentPath === href
    }
    return currentPath?.startsWith(href) || false
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-white/[0.02] dark:bg-black/[0.02] backdrop-blur-[12px] border-b border-white/[0.05] dark:border-gray-800/[0.2]" />
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center group">
              <Logo className="h-8 w-8" size={32} />
              <div className="flex items-center relative">
                <span className="ml-1 text-lg font-semibold text-gray-900 dark:text-white">
                  Mantlz
                </span>
                <div className="absolute -top-2 -right-9 inline-flex items-center justify-center px-1 h-[14px] rounded-sm bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 dark:border-blue-400/20">
                  <span className="text-[10px] leading-none font-medium text-blue-500 dark:text-blue-400 tracking-wider">BETA</span>
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative py-2 text-sm transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-gray-200 dark:bg-white/30 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <SignedIn>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="h-9 px-4 cursor-pointer bg-zinc-500 text-white dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors duration-200">
                    Dashboard
                  </Button>
                </Link>
                {loaded && <UserButton afterSignOutUrl="/" />}
              </SignedIn>
              <SignedOut>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm" className="h-9 px-4 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors duration-200">
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="h-9 px-4 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-white/90 transition-colors duration-200">
                    Sign up
                  </Button>
                </Link>
              </SignedOut>
            </div>

            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06]">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-white dark:bg-black/95 backdrop-blur-md border-t border-gray-200 dark:border-white/[0.05]">
                <DrawerHeader>
                  <DrawerTitle>
                    <div className="flex items-center justify-center">
                      <Logo className="h-8 w-8" />
                      <div className="flex items-center">
                        <span className="ml-3 text-lg font-semibold text-white">
                          Mantlz
                        </span>
                        <div className="ml-2 inline-flex items-center px-1.5 h-[18px] rounded-md bg-blue-500/10 border border-blue-500/20">
                          <span className="text-[10px] leading-none font-medium text-blue-400">BETA</span>
                        </div>
                      </div>
                    </div>
                  </DrawerTitle>
                </DrawerHeader>
                <div className="px-4 py-2">
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block px-4 py-2 text-base rounded-lg transition-colors duration-200 ${
                          isActive(item.href)
                            ? 'text-white bg-white/[0.06]'
                            : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                    {!loaded && (
                      <>
                        <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
                      </>
                    )}
                  </div>
                </div>
                <DrawerFooter>
                  <div className="space-y-2">
                    {!loaded && (
                      <div className="space-y-2">
                        <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
                        <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
                      </div>
                    )}
                    <DrawerClose asChild>
                      <Button variant="ghost" className="w-full h-10 text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors duration-200">
                        Close
                      </Button>
                    </DrawerClose>
                  </div>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  )
}