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
import { Check, Sparkles, ArrowRight, FileText, Users, Building, ZapIcon } from "lucide-react"
import "@/styles/animations.css"

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
      "Standard": "STANDARD",
      "Professional": "PRO"
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
    <section className="py-24 relative " id="pricing">
      {/* Grid Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]" />

   
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>Simple Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
            Choose the plan that fits your needs
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Start for free, upgrade as you grow
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
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
  return (
    <div
      className={`relative flex flex-col p-6 rounded-lg bg-white dark:bg-zinc-900 transform-gpu translate-y-[-4px] translate-x-[-4px] hover:translate-y-[-8px] hover:translate-x-[-8px] transition-all duration-300 ${
        plan.isPopular
          ? "border-2 border-black dark:border-zinc-600 shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] dark:shadow-[4px_4px_0px_0px_rgba(249,115,22,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(249,115,22,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(249,115,22,0.5)]"
          : "border-2 border-black dark:border-zinc-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)]"
      }`}
    >
      {plan.isPopular && (
        <div className="absolute -top-5 left-0 right-0 mx-auto w-32">
          <div className="text-center py-1 px-3 rounded-lg bg-orange-500 text-white text-sm font-medium border-2 border-black dark:border-orange-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Most Popular
          </div>
        </div>
      )}

      <div className="mb-5">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
          {plan.title}
        </h3>
        <div className="flex items-baseline text-zinc-900 dark:text-white">
          <span className="text-4xl font-bold tracking-tight">${plan.monthlyPrice}</span>
          <span className="ml-1 text-sm font-semibold">/month</span>
        </div>
      </div>

      <ul className="space-y-3 flex-1 mb-6">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
            <Check className="h-5 w-5 flex-shrink-0 text-orange-500 dark:text-orange-400" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onCheckout}
        disabled={isLoading || isCurrentPlan}
        className={`w-full border-2 transform-gpu hover:-translate-y-1 transition-transform ${
          plan.isPopular
            ? "bg-orange-500 hover:bg-orange-600 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            : "bg-zinc-800 hover:bg-zinc-900 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]"
        }`}
      >
        {isCurrentPlan ? (
          "Current Plan"
        ) : isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            <span>Processing...</span>
          </div>
        ) : (
          plan.buttonText
        )}
      </Button>
    </div>
  )
}
