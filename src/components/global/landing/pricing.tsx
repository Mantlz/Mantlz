"use client"

import { useState, useEffect, Suspense } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { FREE_QUOTA, STANDARD_QUOTA, PRO_QUOTA } from "@/config/usage"
import { client } from "@/lib/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import Canceled from "./canceled"
import Navbar from "./navbar"
import Footer from "./footer"
import PricingComparison from "./pricing-comparison"

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
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 mb-12">
                Choose the plan that works best for you
              </p>
            </div>
            
            {/* Pricing Comparison Table */}
            <PricingComparison
              plans={plans}
              currentPlan={currentPlan}
              isPending={isPending}
              onCheckout={handleCheckout}
            />
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </>
  )
}

