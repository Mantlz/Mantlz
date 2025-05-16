"use client"
import Link from "next/link"
import "@/styles/animations.css"
// import { InstallCommand } from "./install-command"
// import { WaitlistExample } from "./waitlist-example"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative py-6 overflow-hidden">
      {/* Background elements */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-zinc-200/30 dark:bg-zinc-800/20 rounded-full blur-3xl transform -translate-y-1/4 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-zinc-200/30 dark:bg-zinc-800/20 rounded-full blur-3xl transform translate-y-1/4 -translate-x-1/4"></div>
      </div> */}
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center">
        {/* Top badge */}
        {/* <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 mb-6">
          <Sparkles className="h-4 w-4 mr-2" />
          <span>Form Management Simplified</span>
        </div> */}
        
        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent mb-6">
          Forms for developers
        </h1>
        
        {/* Description */}
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
          A modern form management platform that enables you to build customizable feedback, contact, and waitlist forms with multiple themes and analytics.
        </p>
        
        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button
            asChild
            className="h-12 px-6 bg-zinc-800 hover:bg-zinc-700 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            size="lg"
          >
            <Link href="/sign-up">
              Try Now. Free! <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            className="h-12 px-6 border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 rounded-lg"
            size="lg"
          >
            <Link href="/pricing">
              View Plans
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
