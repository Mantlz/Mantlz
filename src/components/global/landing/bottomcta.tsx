import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BottomCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
     
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 text-center">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center text-center backdrop-blur-sm p-8 ">
          
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Create Powerful Forms with Ease
          </h2>
          
          {/* Description */}
          <p className="mb-8 text-lg text-muted-foreground max-w-lg">
            Our platform allows users to create customizable forms in minutes. Design, deploy, and analyze responses all in one place.
          </p>
          
          {/* CTA Button */}
          <Link href="/dashboard">
            <Button
              className="h-10 px-2 text-md bg-amber-500 text-black dark:text-white dark:border-background border text-sm shadow-md shadow-zinc-950/30 ring ring-inset ring-white/20 transition-[filter] duration-200 hover:brightness-125 active:brightness-95"

              size="lg"
            >
              Start Building Forms
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

