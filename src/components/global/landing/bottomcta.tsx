import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export default function BottomCTA() {
  return (
    <section className="py-24 relative bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-zinc-200/50 dark:bg-zinc-800/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-zinc-200/50 dark:bg-zinc-800/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 text-center">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center text-center backdrop-blur-sm p-8 ">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>Get Started Today</span>
          </div>
          
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Create Powerful Forms with Ease
          </h2>
          
          {/* Description */}
          <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400 max-w-lg">
            Our platform allows users to create customizable forms in minutes. Design, deploy, and analyze responses all in one place.
          </p>
          
          {/* CTA Button */}
          <Button
            className="h-12 px-8 text-md bg-zinc-800 hover:bg-zinc-700 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            size="lg"
          >
            Start Building Forms
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

