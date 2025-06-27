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
    buttonText: "Register For Free!",
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
    icon: <Zap className="m-auto size-5" strokeWidth={1} />
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
    isPopular: true
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
      <section className="py-20 md:py-32" id="pricing">
        <div className="mx-auto max-w-6xl px-2">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/70">Choose the plan that fits your needs</h1>
            <p className="mt-6 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">Start for free, upgrade as you grow. No hidden fees, cancel anytime.</p>
          </div>
          <div className="relative">           
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {plans.map((plan) => (
                <Card key={plan.title} className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${plan.isPopular ? 'border-primary/30 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 ring-1 ring-primary/20' : 'border-border/50 shadow-lg hover:shadow-xl hover:border-primary/20'}`}>
                  {/* Enhanced top accent */}
                  <div className={`absolute inset-x-0 top-0 h-1 ${plan.isPopular ? 'bg-gradient-to-r from-primary via-primary/90 to-primary/70' : 'bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40'}`}></div>
                  


                  
                  <CardContent className="relative flex h-full flex-col p-8 lg:p-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className={`relative flex aspect-square size-16 rounded-2xl items-center justify-center transition-all duration-300 ${plan.isPopular ? 'bg-primary/10 ring-2 ring-primary/20' : 'bg-muted/30 ring-1 ring-muted/40'}`}>
                        <div className={`size-7 transition-colors duration-300 ${plan.isPopular ? 'text-primary' : 'text-muted-foreground group-hover:text-primary/80'}`}>
                          {plan.icon}
                        </div>
                      </div>
                      {plan.isPopular && (
                        <Badge variant="default" className="bg-orange-500 text-white font-semibold px-4 py-1.5 text-sm shadow-md">
                          Most Popular
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-1 flex-col">
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-3 text-foreground">{plan.title}</h2>
                        <div className="flex items-baseline mb-2">
                          <span className="text-5xl lg:text-6xl font-bold text-foreground">${plan.monthlyPrice}</span>
                          <span className="ml-2 text-lg font-medium text-muted-foreground">/month</span>
                        </div>
                        {plan.monthlyPrice === 0 && (
                          <p className="text-sm text-muted-foreground">Forever free</p>
                        )}
                      </div>
                      
                      <ul className="flex-1 space-y-4 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3 text-muted-foreground group/item">
                            <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 transition-colors duration-200 ${plan.isPopular ? 'text-primary' : 'text-primary/60 group-hover/item:text-primary'}`} />
                            <span className="text-sm leading-relaxed group-hover/item:text-foreground transition-colors duration-200">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button
                        onClick={() => handleCheckout(plan)}
                        disabled={processingPlan === plan.title || isCurrentUserPlan(plan.title)}
                        className={`w-full py-4 text-base font-semibold transition-all duration-300 ${plan.isPopular ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl' : 'bg-background border-2 border-primary/20 text-foreground hover:bg-primary/5 hover:border-primary/40'}`}
                        variant={plan.isPopular ? "default" : "outline"}
                        size="lg"
                      >
                        {isCurrentUserPlan(plan.title) ? (
                          <span className="flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            Current Plan
                          </span>
                        ) : processingPlan === plan.title ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            <span>Processing...</span>
                          </div>
                        ) : (
                          plan.buttonText
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
  );
}
