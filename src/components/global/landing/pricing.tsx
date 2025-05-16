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
    <section className="py-24 relative bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-950" id="pricing">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-zinc-200/30 dark:bg-zinc-800/20 rounded-full blur-3xl transform -translate-y-1/4 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-zinc-200/30 dark:bg-zinc-800/20 rounded-full blur-3xl transform translate-y-1/4 -translate-x-1/3"></div>
      </div>
      
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>Simple Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
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
  const price = plan.monthlyPrice
  const period = "/month"

  return (
    <div className={`relative group backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border ${
      plan.isPopular 
        ? "border-zinc-200 dark:border-zinc-700" 
        : "border-zinc-200 dark:border-zinc-800"
    } ${isCurrentPlan ? "ring-2 ring-zinc-700 dark:ring-zinc-300" : ""}`}>
      
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-50 dark:to-zinc-900/50 opacity-50"></div>
      
      {/* Popular badge */}
      {plan.isPopular && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-zinc-700 hover:bg-zinc-700 text-white dark:bg-zinc-300 dark:text-zinc-900 dark:hover:bg-zinc-300 font-medium px-2 py-1">
            <ZapIcon className="h-3.5 w-3.5 mr-1" />
            Popular
          </Badge>
        </div>
      )}

      <div className="p-6 flex flex-col h-full relative">
        {/* Plan icon and title */}
        <div className="mb-6">
          {plan.title === "Starter" && (
            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <FileText className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            </div>
          )}
          {plan.title === "Standard" && (
            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <Users className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            </div>
          )}
          {plan.title === "Professional" && (
            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <Building className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            </div>
          )}
          <h3 className="text-xl font-bold text-zinc-800 dark:text-white">{plan.title}</h3>
          {isCurrentPlan && (
            <Badge variant="outline" className="mt-2 bg-green-500 text-white">
              Current Plan
            </Badge>
          )}
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-zinc-800 dark:text-white">${price}</span>
            <span className="ml-1 text-sm text-zinc-500 dark:text-zinc-400">{period}</span>
          </div>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {plan.title === "Starter" && "Perfect for individuals just getting started"}
            {plan.title === "Standard" && "Great for growing businesses"}
            {plan.title === "Professional" && "Built for professional teams"}
          </p>
        </div>

        {/* Features list */}
        <div className="flex-grow mb-6">
          <div className="space-y-3">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="mr-3 mt-1">
                  <div className="w-4 h-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Check className="h-3 w-3 text-zinc-700 dark:text-zinc-300" />
                  </div>
                </div>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onCheckout}
          disabled={isLoading || isCurrentPlan}
          className={`w-full ${
            plan.isPopular
              ? "bg-zinc-800 hover:bg-zinc-700 text-white dark:bg-zinc-200 dark:text-zinc-800 dark:hover:bg-zinc-300"
              : "bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:border-zinc-700"
          } rounded-lg py-5 font-medium transition-colors duration-200`}
        >
          {isLoading ? "Processing..." : isCurrentPlan ? "Current Plan" : plan.buttonText}
          {!isCurrentPlan && !isLoading && (
            <ArrowRight className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Bottom accent for popular plan */}
      {plan.isPopular && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-400 to-zinc-600 dark:from-zinc-300 dark:to-zinc-500"></div>
      )}
    </div>
  )
}
