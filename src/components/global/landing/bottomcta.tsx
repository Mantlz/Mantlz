import { Button } from "@/components/ui/button"

export default function BottomCTA() {
  return (
    <section className="bg-[#fffdf7] dark:bg-neutral-950 relative border-t border-neutral-200 dark:border-neutral-800">
      <div className="relative mx-auto max-w-7xl px-4 py-24 text-center md:py-32">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50  md:text-4xl lg:text-5xl">
            Create Powerful Forms with Ease
          </h2>
          <p className="mb-8 max-w-md text-lg text-neutral-600 dark:text-neutral-300 ">
            Our platform allows users to create customizable forms in minutes. Design, deploy, and analyze responses all in one place.
          </p>
          <Button
            className="h-12 px-8 text-lg bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-200 dark:hover:bg-neutral-300 text-neutral-50 dark:text-neutral-900  border-2 border-neutral-700 dark:border-neutral-300 rounded-sm shadow-md"
            size="lg"
          >
            Start Building Forms
          </Button>
        </div>
      </div>
    </section>
  )
}

