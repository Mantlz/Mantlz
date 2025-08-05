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
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-gradient-to-b from-background via-background/50 to-background" id="pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-4 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="text-sm font-medium text-primary">Pricing Plans</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 leading-tight mb-6">Simple, transparent pricing</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">Choose the perfect plan for your needs. Start free, scale as you grow.</p>
          </div>
          <div className="relative">           
            
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {plans.map((plan) => (
                <Card key={plan.title} className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] ${plan.isPopular ? 'border-0 bg-gradient-to-b from-primary/5 via-background to-background shadow-none ring-2 ring-primary/20 sm:col-span-2 lg:col-span-1' : 'border border-border/50 bg-gradient-to-b from-background to-muted/20 shadow-none hover:shadow-sm hover:border-primary/30'}`}>
                  {plan.isPopular && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50"></div>
                  )}
                  
                  <CardContent className="relative flex h-full flex-col p-6 sm:p-8 lg:p-10">
                    <div className="flex items-start justify-between mb-6 sm:mb-8">
                      <div className={`relative flex aspect-square size-12 sm:size-14 lg:size-16 rounded-2xl items-center justify-center transition-all duration-300 group-hover:scale-110 ${plan.isPopular ? 'bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/30' : 'bg-gradient-to-br from-muted/40 to-muted/20 ring-1 ring-muted/30 group-hover:ring-primary/40'}`}>
                        <div className={`size-5 sm:size-6 lg:size-7 transition-all duration-300 ${plan.isPopular ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
                          {plan.icon}
                        </div>
                      </div>
                      {plan.isPopular && (
                        <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm shadow-lg border-0">
                          ✨ Most Popular
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-1 flex-col">
                      <div className="mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground group-hover:text-primary transition-colors duration-300">{plan.title}</h2>
                        <div className="flex items-baseline mb-3">
                          <span className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">${plan.monthlyPrice}</span>
                          <span className="ml-2 text-base sm:text-lg font-medium text-muted-foreground">/month</span>
                        </div>
                        {plan.monthlyPrice === 0 ? (
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                            <span className="text-xs font-medium text-green-700 dark:text-green-400">Forever free</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <span className="text-xs font-medium text-primary">Billed monthly</span>
                          </div>
                        )}
                      </div>
                      
                      <ul className="flex-1 space-y-4 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3 group/item">
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 transition-all duration-200 ${plan.isPopular ? 'bg-primary/20 text-primary' : 'bg-muted/40 text-muted-foreground group-hover/item:bg-primary/20 group-hover/item:text-primary'}`}>
                              <Check className="h-3 w-3" />
                            </div>
                            <span className="text-sm leading-relaxed text-muted-foreground group-hover/item:text-foreground transition-colors duration-200">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button
                        onClick={() => handleCheckout(plan)}
                        disabled={processingPlan === plan.title || isCurrentUserPlan(plan.title)}
                        className={`w-full py-2 text-sm sm:text-base font-semibold transition-all duration-300 rounded-xl ${plan.isPopular ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02]' : 'bg-background border-2 border-border hover:border-primary/50 text-foreground hover:bg-primary/5 hover:scale-[1.02]'}`}
                        variant={plan.isPopular ? "default" : "outline"}
                        size="lg"
                      >
                        {isCurrentUserPlan(plan.title) ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                            <span className="hidden sm:inline">Current Plan</span>
                            <span className="sm:hidden">Active</span>
                          </span>
                        ) : processingPlan === plan.title ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <span className="truncate">{plan.buttonText}</span>
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
