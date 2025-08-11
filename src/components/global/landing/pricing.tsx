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
import { Check, Shield, Zap, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import React from "react"
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
  icon?: React.ReactNode
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
    buttonText: "Start for free",
    stripePriceIdMonthly: "",
    quota: FREE_QUOTA,
    icon: <Shield className="m-auto size-5" strokeWidth={1} />
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
    ],
    buttonText: "Get Standard",
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID ?? "",
    includedPlans: [],
    quota: STANDARD_QUOTA,
    icon: <Zap className="m-auto size-5" strokeWidth={1} />,
    isPopular: true
  },
  {
    title: "Professional",
    monthlyPrice: 15,
    features: [
      "10 Forms",
      "10,000 submissions per month",
      "Complete analytics suite",
      "Form campaigns (10/month)",
      "Up to 2,000 recipients per campaign",
      "Premium support",
    ],
    buttonText: "Get Pro",
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? "",
    includedPlans: [],
    quota: PRO_QUOTA,
    icon: <Users className="m-auto size-5" strokeWidth={1} />,
    isFeatured: true,
    isPopular: false
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
      <section className="py-16 bg-background" id="pricing">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-4">Simple, transparent pricing</h1>
            <p className="text-lg text-muted-foreground">Choose the perfect plan for your needs. Start free, scale as you grow.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-8xl mx-auto">
              {plans.map((plan) => (
                <Card key={plan.title} className="border border-amber-500/20 ring-2 ring-amber-500/50 rounded-lg p-6 hover:ring-amber-500/30 transition-all duration-300 w-full shadow-none">
                  <CardContent className="p-0">
                    <div className="mb-8">
                       <div className="flex items-center justify-between mb-2">
                         <h2 className="text-2xl font-semibold text-black dark:text-white">{plan.title}</h2>
                         {plan.isPopular && (
                           <Badge className="bg-amber-500 hover:bg-amber-500 text-black dark:text-white text-xs font-medium px-2 py-1">
                             Most Popular
                           </Badge>
                         )}
                       </div>
                       <div className="flex items-baseline mb-1">
                         <span className="text-4xl font-bold text-black dark:text-white">${plan.monthlyPrice}</span>
                         <span className="ml-1 text-gray-600 dark:text-gray-400">per month.</span>
                       </div>
                       <p className="text-sm text-gray-600 dark:text-gray-400">
                          {plan.title === "Starter" ? "For Hobbyists" : plan.title === "Standard" ? "For Small Teams" : "For Growing Businesses"}
                        </p>
                     </div>
                    
                    <Button
                       onClick={() => handleCheckout(plan)}
                       disabled={processingPlan === plan.title || isCurrentUserPlan(plan.title)}
                       className="w-full mb-8 bg-amber-500 hover:bg-amber-600 text-black dark:text-white font-medium py-2 px-4 rounded transition-colors"
                       size="lg"
                     >
                      {isCurrentUserPlan(plan.title) ? (
                        <span>Current Plan</span>
                      ) : processingPlan === plan.title ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <span>{plan.buttonText}</span>
                      )}
                    </Button>
                    
                    <ul className="space-y-4">
                       {plan.features.map((feature, i) => (
                         <li key={i} className="flex items-start gap-3">
                           <div className="flex-shrink-0 w-4 h-4 rounded-sm flex items-center justify-center mt-0.5">
                             <Check className="h-3 w-3 text-amber-600 dark:text-amber-500" />
                           </div>
                           <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                         </li>
                       ))}
                     </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
        </div>
      </section>
  );
}
