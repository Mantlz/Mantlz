"use client"

import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

export default function Canceled() {
  const router = useRouter()

  return (
    <section className="flex min-h-[calc(80vh-8rem)] w-full flex-col bg-white dark:bg-zinc-950 items-center justify-center px-4 py-12 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
      </div>

      <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">Subscription Canceled</h1>

      <p className="mb-6 max-w-md text-gray-600 dark:text-gray-300">
        Your subscription has been canceled. You can still use your current plan until the end of your billing period.
      </p>

      <p className="mb-8 max-w-md text-sm text-gray-500 dark:text-gray-400">
        If you have any questions about your subscription or need help, please contact our support team.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Button onClick={() => router.push("/dashboard")} className="min-w-[140px]">
          Go to Dashboard
        </Button>
        <Button onClick={() => router.push("/pricing")} variant="outline" className="min-w-[140px]">
          View Plans
        </Button>
      </div>
    </section>
  )
}
