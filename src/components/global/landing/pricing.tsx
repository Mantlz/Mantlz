"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { FREE_QUOTA, STANDARD_QUOTA, PRO_QUOTA } from "@/config/usage"
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"
import Canceled from "./canceled"
import { useSubscription } from "@/hooks/useSubscription"
import { Badge } from "@/components/ui/badge"


type Plan = {
  title: string
  monthlyPrice: number
  features: string[]
  buttonText: string
  isFeatured?: boolean
  stripePriceIdMonthly: string
  includedPlans?: string[]
  quota: typeof FREE_QUOTA | typeof STANDARD_QUOTA | typeof PRO_QUOTA
}

const plans: Plan[] = [
  {
    title: "Starter",
    monthlyPrice: 0,
    features: [
      "1 Form",
      "200 submissions per month",
      "Basic form analytics",
      "Form validation",
      "Standard support",
    ],
    buttonText: "Register For Free!",
    stripePriceIdMonthly: "",
    quota: FREE_QUOTA,
  },
  {
    title: "Professional",
    monthlyPrice: 29,
    features: [
      "5 Forms",
      "5,000 submissions per month",
      "Advanced analytics",
      "Form campaigns (3/month)",
      "Up to 500 recipients per campaign",
      "Priority support",
      "Custom branding",
    ],
    buttonText: "Get Started",
    isFeatured: true,
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID ?? "",
    includedPlans: [],
    quota: STANDARD_QUOTA,
  },
  {
    title: "Business",
    monthlyPrice: 99,
    features: [
      "10 Forms",
      "10,000 submissions per month",
      "Complete analytics suite",
      "Form campaigns (10/month)",
      "Up to 10,000 recipients per campaign",
      "Premium support",
      "Custom domains",
      "Team collaboration",
      "API access",
    ],
    buttonText: "Get Started",
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? "",
    includedPlans: [],
    quota: PRO_QUOTA,
  },
]

export default function Pricing() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [processingPlan, setProcessingPlan] = useState<string | null>(null)
  const isCanceled = searchParams.get("canceled") === "true"
  
  // Always call the hook but conditionally enable the query
  const { subscription } = useSubscription()

  const { mutate: handleStripeCheckout } = useMutation({
    mutationFn: async ({ priceId }: { priceId: string }) => {
      if (!user?.id || !user?.primaryEmailAddress?.emailAddress) {
        throw new Error("User not found")
      }

      const res = await client.payment.createCheckoutSession.$post({
        priceId,
      })
      return await res.json()
    },
    onSuccess: ({ url }) => {
      if (url) router.push(url)
      setProcessingPlan(null)
    },
    onError: (error) => {
      console.error("Error during checkout:", error)
      toast.error("Error during checkout")
      setProcessingPlan(null)
    },
  })

  // Helper function to check if the current subscription matches the plan
  const isCurrentUserPlan = (planTitle: string) => {
    if (!isSignedIn || !subscription?.plan) return false
    
    // Map UI plan titles to subscription plan values
    const planMapping: Record<string, string> = {
      "Starter": "FREE",
      "Professional": "STANDARD",
      "Business": "PRO"
    }
    
    return subscription.plan === planMapping[planTitle]
  }

  const handleCheckout = async (plan: Plan) => {
    if (!isSignedIn) {
      toast.info("Please login or sign up to purchase", {
        action: {
          label: "Sign Up",
          onClick: () => router.push("/sign-up"),
        },
      })
      return
    }

    if (plan.title === "Free") {
      router.push("/dashboard")
      return
    }

    setProcessingPlan(plan.title)
    handleStripeCheckout({ priceId: plan.stripePriceIdMonthly })
  }

  // Render the Canceled component if canceled=true in URL
  if (isCanceled) {
    return (
      <>
        <main className="pt-8">
          <Canceled />
        </main>
      </>
    )
  }

  // Render the pricing section
  return (
    <>
      <main className="pt-16">
        <section className="overflow-hidden bg-white dark:bg-zinc-950" id="pricing">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Choose <span className="font-extrabold">The Plan</span> That&apos;s Right For
              </h2>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Your Form Management Needs
              </h2>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6">
              <div className="grid gap-8 lg:grid-cols-3">
                {plans.map((plan) => (
                  <PricingCard
                    key={plan.title}
                    plan={plan}
                    onCheckout={() => handleCheckout(plan)}
                    isLoading={processingPlan === plan.title}
                    isCurrentPlan={isCurrentUserPlan(plan.title)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function PricingCard({
  plan,
  onCheckout,
  isLoading,
  isCurrentPlan,
}: {
  plan: Plan
  onCheckout: () => void
  isLoading: boolean
  isCurrentPlan: boolean
}) {
  const price = plan.monthlyPrice
  const period = "/Month"

  return (
    <div
      className={`relative w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg overflow-hidden ${plan.isFeatured ? "ring-1 ring-blue-500 dark:ring-blue-400" : ""} ${isCurrentPlan ? "ring-2 ring-green-500 dark:ring-green-400" : ""}`}
    >
      <div className="p-8 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {plan.title === "Starter" && (
              <div className="w-8 h-8 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-700 dark:text-gray-300"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <line x1="9" y1="9" x2="15" y2="9" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                  <line x1="9" y1="15" x2="13" y2="15" />
                </svg>
              </div>
            )}
            {plan.title === "Professional" && (
              <div className="w-8 h-8 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-700 dark:text-gray-300"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
            )}
            {plan.title === "Business" && (
              <div className="w-8 h-8 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-700 dark:text-gray-300"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.title}</h3>
          </div>
          {isCurrentPlan && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800">
              Current Plan
            </Badge>
          )}
        </div>

        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">${price}</span>
          <span className="ml-1 text-gray-500 dark:text-gray-400">{period}</span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {plan.title === "Starter" &&
            "Perfect for individuals or small projects needing a simple form solution with essential features."}
          {plan.title === "Professional" &&
            "Ideal for growing businesses that need multiple forms and advanced features to engage with their audience."}
          {plan.title === "Business" &&
            "Enterprise-grade solution for organizations with high-volume form needs and advanced customization requirements."}
        </p>

        <ul className="space-y-4 text-sm mb-8 flex-grow">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-500 dark:text-blue-400 mt-0.5 min-w-[18px]"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l2 2 4-4" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={onCheckout}
          disabled={isLoading || isCurrentPlan}
          className={`w-full rounded-md py-6 text-center font-medium text-lg transition-colors duration-200 mt-auto ${
            plan.title === "Starter"
              ? "bg-[#0a1629] hover:bg-[#152a4a] text-white"
              : "bg-white hover:bg-gray-100 text-gray-900 border border-gray-200"
          } ${isCurrentPlan ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Processing..." : isCurrentPlan ? "Current Plan" : plan.buttonText}
          {plan.title !== "Starter" && !isCurrentPlan && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2 inline"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          )}
        </Button>
      </div>
    </div>
  )
}
