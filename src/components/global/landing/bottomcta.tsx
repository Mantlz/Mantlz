import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export default function BottomCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
     
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 text-center">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center text-center backdrop-blur-sm p-8 ">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>Get Started Today</span>
          </div>
          
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 bg-clip-text text-transparent">
            Create Powerful Forms with Ease
          </h2>
          
          {/* Description */}
          <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400 max-w-lg">
            Our platform allows users to create customizable forms in minutes. Design, deploy, and analyze responses all in one place.
          </p>
          
          {/* CTA Button */}
          <Button
            className="h-12 px-8 text-md bg-orange-500 hover:bg-orange-600 text-white rounded-lg border-2 border-black dark:border-zinc-600 transform-gpu translate-y-[-4px] translate-x-[-4px] hover:translate-y-[-8px] hover:translate-x-[-8px] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)]"
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

