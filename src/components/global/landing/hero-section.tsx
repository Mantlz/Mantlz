"use client"
import Link from "next/link"
import "@/styles/animations.css"


import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative py-4 sm:py-5 md:py-6 lg:py-8 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
        {/* Main heading */}
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-5 md:mb-6 flex items-center justify-center whitespace-nowrap">
                     Forms for <span className="relative inline-flex items-center ml-2 sm:ml-3 md:ml-4" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
                        <span className="absolute inset-0 bg-orange-900 transform -rotate-1 skew-x-3 origin-bottom-right clip-path-rough animate-float"></span>
                        <span className="absolute inset-0 bg-orange-950 transform rotate-1 skew-y-1 origin-top-left clip-path-rough-2"></span>
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
            className="bg-orange-900 hover:bg-orange-800 dark:bg-orange-950 dark:hover:bg-orange-900 text-white border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-200 text-sm sm:text-base md:text-lg font-semibold"
            size="lg"
          >
            <Link href="/sign-up" className="flex items-center font-semibold text-sm sm:text-base md:text-lg">
              Try Now. Free! 

            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

"here here pelase "
