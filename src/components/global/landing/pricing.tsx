"use client"

import { useState, Suspense } from "react"
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

// Define subscription type
type Subscription = {
  plan: "FREE" | "STANDARD" | "PRO" | null;
  
}

type Plan = {
  title: string
  monthlyPrice: number
  features: string[]
  buttonText: string
  isFeatured?: boolean
  stripePriceIdMonthly: string
  includedPlans?: string[]
  quota: typeof FREE_QUOTA | typeof STANDARD_QUOTA | typeof PRO_QUOTA
  isPopular?: boolean
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
    title: "Standard",
    monthlyPrice: 8,
    features: [
      "5 Forms",
      "5,000 submissions per month",
      "Advanced analytics",
      "Form campaigns (3/month)",
      "Up to 500 recipients per campaign",
      "Priority support",
      "Custom branding",
    ],
    buttonText: "Get Standard",
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID ?? "",
    includedPlans: [],
    quota: STANDARD_QUOTA,
  },
  {
    title: "Professional",
    monthlyPrice: 15,
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
    buttonText: "Get Pro",
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? "",
    includedPlans: [],
    quota: PRO_QUOTA,
    isPopular: true,
    isFeatured: true,
  },
]

export default function Pricing() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  
  // Always call the hook but conditionally enable the query
  const { subscription } = useSubscription()

  // Render the pricing section
  return (
    <>
      <main className="pt-16">
        <Suspense>
          <PricingContent
            isSignedIn={isSignedIn}
            user={user}
            router={router}
            subscription={subscription ?? null}
          />
        </Suspense>
      </main>
    </>
  )
}

function PricingContent({
  isSignedIn,
  user,
  router,
  subscription
}: {
  isSignedIn: boolean | undefined;
  user: ReturnType<typeof useUser>['user'];
  router: ReturnType<typeof useRouter>;
  subscription: Subscription | null | undefined;
}) {
  const searchParams = useSearchParams()
  const [processingPlan, setProcessingPlan] = useState<string | null>(null)
  const isCanceled = searchParams.get("canceled") === "true"

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

  return (
    <section className="overflow-hidden bg-white dark:bg-zinc-950" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Choose <span className="font-extrabold">The Plan</span> That&apos;s Right For
          </h2>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Your Form Management Needs
          </h2>
        </div>

        <div className=" rounded-3xl p-4 sm:p-6">
          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
      className={`relative w-full rounded-2xl border border-zinc-200 dark:border-zinc-700  shadow-lg overflow-hidden ${plan.isFeatured ? "ring-1 ring-blue-500 dark:ring-blue-400" : ""} ${isCurrentPlan ? "ring-2 ring-green-500 dark:ring-green-400" : ""}`}
    >
      <div className="p-6 sm:p-8 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            {plan.title === "Starter" && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
            {plan.title === "Standard" && (
              <div className="w-7 h-7 sm:w-8 sm:h-8  rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
            {plan.title === "Professional" && (
              <div className="w-7 h-7 sm:w-8 sm:h-8  rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{plan.title}</h3>
          </div>
          {isCurrentPlan && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800 text-xs sm:text-sm">
              Current Plan
            </Badge>
          )}
          {plan.isPopular && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800 text-xs sm:text-sm">
              Most Popular
            </Badge>
          )}
        </div>

        <div className="mb-4 sm:mb-6">
          <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">${price}</span>
          <span className="ml-1 text-gray-500 dark:text-gray-400">{period}</span>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
          {plan.title === "Starter" &&
            "Perfect for individuals or small projects needing a simple form solution with essential features."}
          {plan.title === "Standard" &&
            "Ideal for growing businesses that need multiple forms and advanced features to engage with their audience."}
          {plan.title === "Professional" &&
            "Enterprise-grade solution for organizations with high-volume form needs and advanced customization requirements."}
        </p>

        <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm mb-6 sm:mb-8 flex-grow">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 sm:gap-3 text-gray-700 dark:text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-500 dark:text-blue-400 mt-0.5 min-w-[16px]"
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
          className={`w-full rounded-lg py-4 sm:py-6 text-center font-medium text-base sm:text-lg transition-colors duration-200 mt-auto ${
            plan.title === "Starter"
              ? "bg-gradient-to-bl from-zinc-800 via-zinc-600 to-zinc-950 hover:from-zinc-700 hover:to-zinc-900 text-white border border-zinc-200 dark:border-zinc-800"
              : "bg-gradient-to-bl from-zinc-800 via-zinc-600 to-zinc-950 hover:from-zinc-700 hover:to-zinc-900 text-white border border-zinc-200 dark:border-zinc-800"
          } ${isCurrentPlan ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Processing..." : isCurrentPlan ? "Current Plan" : plan.buttonText}
          {plan.title !== "Starter" && !isCurrentPlan && (
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
