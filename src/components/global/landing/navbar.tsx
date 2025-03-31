"use client"
import Link from "next/link"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { UserButton, SignedIn, SignedOut, useClerk } from "@clerk/nextjs"
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
import { Logo } from "@/components/global/logo"

type NavItem = {
  name: string
  href: string
}

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Blog", href: "/blog" },
]

export default function Navbar() {
  const currentPath = usePathname()
  const { loaded } = useClerk()

  const isActive = (href: string) => {
    if (href === "/") {
      return currentPath === href
    }
    return currentPath?.startsWith(href) || false
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-[#fffdf7]/90 dark:bg-neutral-950/90 backdrop-blur-[8px] border-b border-neutral-200 dark:border-neutral-800" />
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center group">
              <Logo className="h-8 w-8" size={32} />
              <div className="flex items-center relative">
                <span className="ml-1 text-lg font-bold text-neutral-900 dark:text-neutral-50 ">Mantlz</span>
                <div className="absolute -top-2 -right-9 inline-flex items-center justify-center px-1 h-[14px] rounded-sm bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
                  <span className="text-[10px] leading-none font-medium text-neutral-800 dark:text-neutral-200 tracking-wider ">
                    BETA
                  </span>
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative py-2 text-sm transition-colors duration-200  ${
                    isActive(item.href)
                      ? "text-neutral-900 dark:text-neutral-50"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-neutral-800 dark:bg-neutral-200" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <SignedIn>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 cursor-pointer bg-neutral-800 text-neutral-50 dark:bg-neutral-200 dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-300 border-2 border-neutral-700 dark:border-neutral-300 rounded-sm"
                  >
                    Dashboard
                  </Button>
                </Link>
                {loaded && <UserButton afterSignOutUrl="/" />}
              </SignedIn>
              <SignedOut>
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-4 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-[#fff5e6] dark:hover:bg-neutral-800 transition-colors duration-200  rounded-sm"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    size="sm"
                    className="h-9 px-4 bg-neutral-800 dark:bg-neutral-200 text-neutral-50 dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors duration-200 border-2 border-neutral-700 dark:border-neutral-300  rounded-sm"
                  >
                    Sign up
                  </Button>
                </Link>
              </SignedOut>
            </div>

            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-[#fff5e6] dark:hover:bg-neutral-800 rounded-sm"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-[#fffdf7] dark:bg-neutral-950 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800">
                <DrawerHeader>
                  <DrawerTitle>
                    <div className="flex items-center justify-center">
                      <Logo className="h-8 w-8" />
                      <div className="flex items-center">
                        <span className="ml-3 text-lg font-bold text-neutral-900 dark:text-neutral-50 ">
                          Mantlz
                        </span>
                        <div className="ml-2 inline-flex items-center px-1.5 h-[18px] rounded-sm bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
                          <span className="text-[10px] leading-none font-medium text-neutral-800 dark:text-neutral-200 ">
                            BETA
                          </span>
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
                        className={`block px-4 py-2 text-base rounded-sm transition-colors duration-200  ${
                          isActive(item.href)
                            ? "text-neutral-900 dark:text-neutral-50 bg-neutral-200 dark:bg-neutral-800"
                            : "text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 dark:hover:text-neutral-50 dark:hover:bg-neutral-800"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                    {!loaded && (
                      <>
                        <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-sm" />
                      </>
                    )}
                  </div>
                </div>
                <DrawerFooter>
                  <div className="space-y-2">
                    {!loaded && (
                      <div className="space-y-2">
                        <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-sm" />
                        <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-sm" />
                      </div>
                    )}
                    <DrawerClose asChild>
                      <Button
                        variant="outline"
                        className="w-full h-10 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors duration-200 rounded-sm border-2 border-neutral-300 dark:border-neutral-700"
                      >
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

