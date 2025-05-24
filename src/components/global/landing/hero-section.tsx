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

      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center">

        
        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 flex items-center justify-center whitespace-nowrap">
                     Forms for <span className="relative inline-flex items-center ml-4" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
                        <span className="absolute inset-0 bg-orange-500 transform -rotate-1 skew-x-3 origin-bottom-right clip-path-rough animate-float"></span>
                        <span className="absolute inset-0 bg-orange-600 transform rotate-1 skew-y-1 origin-top-left clip-path-rough-2"></span>
                        <span className="relative text-white text-6xl sm:text-7xl md:text-8xl px-6 py-3">Developers</span>
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
            className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white rounded-lg border-2 border-black dark:border-zinc-600 transform-gpu translate-y-[-4px] translate-x-[-4px] hover:translate-y-[-8px] hover:translate-x-[-8px] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)]"
            size="lg"
          >
            <Link href="/sign-up" className="flex items-center font-semibold">
              Try Now. Free! <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
