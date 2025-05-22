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

        
        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                     Forms for <span className="relative inline-block">
                        <span className="absolute inset-0 bg-orange-500 transform -rotate-1 skew-x-3 origin-bottom-right clip-path-rough"></span>
                        <span className="absolute inset-0 bg-orange-600 transform rotate-1 skew-y-1 origin-top-left clip-path-rough-2"></span>
                        <span className="relative text-white text-6xl sm:text-6xl md:text-7xl px-6 py-3">Developers</span>
                     </span>
        </h1>
        
        {/* Description */}
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
          A modern form management platform that enables you to build customizable feedback, contact, and waitlist forms with multiple themes and analytics.
        </p>
        
        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button
            asChild
            className="h-12 px-6 bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-500 dark:hover:bg-orange-600 dark:text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            size="lg"
          >
            <Link href="/sign-up">
              Try Now. Free! <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
