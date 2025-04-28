import Link from "next/link"

export function HeroSection() {


  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-6xl font-bold tracking-tight mb-6 dark:text-white">Forms for developers</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
        A modern form management platform that enables you to build customizable feedback, contact, and waitlist forms with multiple themes and analytics.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        
        <Link
          href="/sign-up"
          className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors w-full sm:w-auto text-center animate-pulse"
        >
          Start for free
        </Link>

      </div>
    </div>
  )
}
