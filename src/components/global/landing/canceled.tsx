"use client"

import { AlertCircle, ArrowLeft, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Canceled() {
  const router = useRouter()

  return (
    <section className="relative flex min-h-[70vh] w-full flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-1/3 h-1/2 bg-zinc-200/30 dark:bg-zinc-800/20 rounded-full blur-3xl transform -translate-y-1/4 translate-x-1/4 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-zinc-200/30 dark:bg-zinc-800/20 rounded-full blur-3xl transform translate-y-1/4 -translate-x-1/4 opacity-60"></div>
      </div>
      
      <div className="relative z-10 max-w-md w-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <AlertCircle className="h-8 w-8 text-zinc-700 dark:text-zinc-300" />
        </div>

        <h1 className="mb-4 text-3xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
          Subscription Canceled
        </h1>

        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Your subscription has been canceled. You can still use your current plan until the end of your billing period.
        </p>

        <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-500">
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
            className="border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            View Plans
          </Button>
        </div>
      </div>
    </section>
  )
}
