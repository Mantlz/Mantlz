"use client"

import { AlertCircle, ArrowLeft, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Canceled() {
  const router = useRouter()

  return (
    <section className="relative flex min-h-[40vh] w-full flex-col items-center justify-center py-16 ">

    
      <div className="relative z-10 max-w-sm sm:max-w-xl w-full text-center px-4">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <AlertCircle className="h-8 w-8 text-zinc-700 dark:text-zinc-300" />
        </div>

        <h1 className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent whitespace-nowrap">
          Subscription Canceled
        </h1>

        <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400">
          Your subscription has been canceled. You can still use your current plan until the end of your billing period.
        </p>

        <p className="mb-8 text-base text-zinc-600 dark:text-zinc-600">
          If you have any questions about your subscription or need help, please contact our support team.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => router.push("/dashboard")} 
            className="bg-zinc-800 hover:bg-zinc-700 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-800"
          >
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button 
            onClick={() => router.push("/pricing")} 
            variant="outline" 
            className="border-zinc-300 text-zinc-700  hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            View Plans
          </Button>
        </div>
      </div>
    </section>
  )
}
