"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { FREE_QUOTA, STANDARD_QUOTA, PRO_QUOTA } from "@/config/usage"
import { client } from "@/lib/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import Canceled from "./canceled"
import Navbar from "./navbar"
import Footer from "./footer"

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
    title: "Free",
    monthlyPrice: 0,
    features: [
      "Basic form builder",
      "Up to 100 submissions per month",
      "Basic analytics",
      "Community support",
      "Cancel anytime"
    ],
    buttonText: "Get Started",
    stripePriceIdMonthly: "",
    quota: FREE_QUOTA
  },
  {
    title: "Standard",
    monthlyPrice: 29,
    features: [
      "Advanced form builder",
      "Custom form themes",
      "Advanced analytics",
      "Email notifications",
      "Priority support",
      "API access",
      "Webhook integrations"
    ],
    buttonText: "Get Standard",
    isFeatured: true,
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID ?? "",
    includedPlans: ["Everything in Free Plan"],
    quota: STANDARD_QUOTA
  },
  {
    title: "Pro",
    monthlyPrice: 99,
    features: [
      "Unlimited forms",
      "Unlimited submissions",
      "Advanced analytics & reporting",
      "Custom branding",
      "Team collaboration",
      "Advanced API features",
      "Priority support",
      "Dedicated account manager"
    ],
    buttonText: "Get Pro",
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? "",
    includedPlans: ["Everything in Free Plan", "Everything in Standard Plan"],
    quota: PRO_QUOTA
  },
]

export default function Pricing() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center">
        <div className="animate-pulse mx-auto h-8 w-64 bg-gray-200 dark:bg-zinc-800 rounded mb-4"></div>
        <div className="animate-pulse mx-auto h-4 w-48 bg-gray-100 dark:bg-zinc-700 rounded"></div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  )
}

function PricingContent() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)
  const isCanceled = searchParams.get("canceled") === "true"

  // Fetch the user's current plan if they're signed in
  const { data: userData } = useQuery({
    queryKey: ['user-plan'],
    queryFn: async () => {
      if (!isSignedIn || !user?.id) return null
      const res = await client.user.getUserPlan.$get()
      return res.json()
    },
    enabled: !!isSignedIn && !!user?.id
  })

  useEffect(() => {
    if (userData?.plan) {
      setCurrentPlan(userData.plan)
    }
  }, [userData])

  const { mutate: handleStripeCheckout, isPending } = useMutation({
    mutationFn: async ({ priceId }: { priceId: string }) => {
      if (!user?.id || !user?.primaryEmailAddress?.emailAddress) {
        throw new Error("User not found")
      }

      const res = await client.payment.createCheckoutSession.$post({
        priceId
      })
      return await res.json()
    },
    onSuccess: ({ url }) => {
      if (url) router.push(url)
    },
    onError: (error) => {
      console.error("Error during checkout:", error)
      toast.error("Error during checkout")
    }
  })

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

    handleStripeCheckout({ priceId: plan.stripePriceIdMonthly })
  }

  // Render the Canceled component if canceled=true in URL
  if (isCanceled) {
    return (
      <>
        <Navbar />
        <main className="pt-16">
          <Canceled />
        </main>
        <Footer />
      </>
    )
  }

  // Render the pricing section
  return (
    <>
      {/* <Navbar /> */}
      <main className="pt-16">
        <section className="overflow-hidden bg-white dark:bg-zinc-950" id="pricing">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Choose the plan that works best for you
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan) => (
                <PricingCard 
                  key={plan.title} 
                  plan={plan} 
                  onCheckout={() => handleCheckout(plan)}
                  isLoading={isPending}
                  isCurrentPlan={currentPlan === plan.title.toUpperCase()}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      {/* <Footer /> */}
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
  const period = "/month"

  return (
    <div className={`relative w-full rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-gray-200 dark:border-zinc-700 overflow-hidden ${plan.isFeatured ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}>
      {plan.isFeatured && (
        <div className="absolute right-0 top-0">
          <div className="bg-blue-500 dark:bg-blue-400 text-white text-xs font-semibold px-4 py-1 rounded-bl-lg">
            Featured
          </div>
        </div>
      )}
      
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.title}</h3>
          {isCurrentPlan && (
            <span className="inline-flex items-center rounded-lg bg-green-100 dark:bg-green-900 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-200">
              Current Plan
            </span>
          )}
        </div>
        
        <div className="mb-8 flex items-baseline">
          <span className="text-5xl font-bold text-gray-900 dark:text-white">${price}</span>
          <span className="ml-1 text-gray-500 dark:text-gray-400">{period}</span>
        </div>
        
        <Button
          onClick={onCheckout}
          disabled={isLoading || isCurrentPlan}
          className={`mb-8 w-full rounded-md py-5 text-center font-medium transition-colors duration-200 ${
            isCurrentPlan 
              ? "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-gray-300" 
              : plan.isFeatured
                ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white"
          }`}
        >
          {isLoading ? "Processing..." : isCurrentPlan ? "Current Plan" : plan.buttonText}
        </Button>
        
        <ul className="space-y-4 text-sm">
          <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-green-500 dark:text-green-400 mt-0.5 min-w-[18px]"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l2 2 4-4" />
            </svg>
            <span>{plan.quota.maxForms} {plan.quota.maxForms === 1 ? 'form' : 'forms'}</span>
          </li>
          <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-green-500 dark:text-green-400 mt-0.5 min-w-[18px]"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l2 2 4-4" />
            </svg>
            <span>{new Intl.NumberFormat().format(plan.quota.maxSubmissionsPerMonth)} submissions per month</span>
          </li>
          
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
                className="text-green-500 dark:text-green-400 mt-0.5 min-w-[18px]"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l2 2 4-4" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        {plan.includedPlans && plan.includedPlans.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-700">
            <ul className="space-y-3">
              {plan.includedPlans.map((includedPlan, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm">
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
                  <span>{includedPlan}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

