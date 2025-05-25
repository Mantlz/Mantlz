"use client"
import Link from "next/link"
import "@/styles/animations.css"
// import { InstallCommand } from "./install-command"
// import { WaitlistExample } from "./waitlist-example"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative py-4 sm:py-5 md:py-6 lg:py-8 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
        {/* Main heading */}
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-5 md:mb-6 flex items-center justify-center whitespace-nowrap">
                     Forms for <span className="relative inline-flex items-center ml-2 sm:ml-3 md:ml-4" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
                        <span className="absolute inset-0 bg-orange-500 transform -rotate-1 skew-x-3 origin-bottom-right clip-path-rough animate-float"></span>
                        <span className="absolute inset-0 bg-orange-600 transform rotate-1 skew-y-1 origin-top-left clip-path-rough-2"></span>
                        <span className="relative text-white text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3">Developers</span>
                     </span>
        </h1>
        
        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-zinc-600 dark:text-zinc-400 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
          A modern form management platform that enables you to build customizable feedback, contact, and waitlist forms with multiple themes and analytics.
        </p>
        
        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
          <Button
            asChild
            className="h-10 sm:h-11 md:h-12 px-6 sm:px-7 md:px-8 bg-orange-500 hover:bg-orange-600 text-white rounded-lg border-2 border-black dark:border-zinc-600 transform-gpu translate-y-[-4px] translate-x-[-4px] hover:translate-y-[-8px] hover:translate-x-[-8px] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)]"
            size="lg"
          >
            <Link href="/sign-up" className="flex items-center font-semibold text-sm sm:text-base md:text-lg">
              Try Now. Free! <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
