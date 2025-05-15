"use client"
import Link from "next/link"
import "@/styles/animations.css"
import { InstallCommand } from "./install-command"
import { WaitlistExample } from "./waitlist-example"

export function HeroSection() {
  return (
    
    <div className="max-w-3xl mx-auto px-2 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12 relative bg-white dark:bg-zinc-950 ">

      
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-2 sm:mb-4 dark:text-white">Forms for developers</h1>
      
      <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 md:mb-10">
        A modern form management platform that enables you to build customizable feedback, contact, and waitlist forms with multiple themes and analytics.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
        <Link
          href="/sign-up"
          className="px-2 sm:px-3 py-1.5 sm:py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-medium w-auto max-w-[200px] text-center pulse dark:hover:bg-zinc-100 hover:bg-zinc-900 hover:border-2 hover:border-white dark:hover:border-zinc-900 relative overflow-hidden transition-all duration-300 border-2 border-transparent ring-2 ring-black dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-black"
        >
          Try Now. Free!
        </Link>
      </div>
      
      {/* Floating components within hero section */}
      <div className="hidden lg:block">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-[120%]">
          {/* <WaitlistExample /> */}
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-[120%]">
          {/* <InstallCommand /> */}
        </div>
      </div>
    </div>
  )
}
