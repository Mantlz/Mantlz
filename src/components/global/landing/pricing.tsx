"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"
import Canceled from "./canceled"
import { useSubscription } from "@/hooks/useSubscription"
import { Check, Shield, Zap, Users } from "lucide-react"
import { pricingPlans, Plan as PricingPlan, Subscription } from "@/config/pricing-plans"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import React from "react"
import "@/styles/animations.css"


// Helper function to render icons based on iconName
const renderIcon = (iconName: 'Shield' | 'Zap' | 'Users') => {
  const iconProps = { className: "m-auto size-5", strokeWidth: 1 };
  
  switch (iconName) {
    case 'Shield':
      return <Shield {...iconProps} />;
    case 'Zap':
      return <Zap {...iconProps} />;
    case 'Users':
      return <Users {...iconProps} />;
    default:
      return <Shield {...iconProps} />;
  }
};

// Use the imported pricing plans
const plans = pricingPlans;

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
    if (!subscription?.plan) return false
    
    const planMap: Record<string, PricingPlan['title']> = {
      'FREE': 'Starter',
      'STANDARD': 'Standard', 
      'PRO': 'Professional'
    }
    
    return planMap[subscription.plan] === planTitle
  }

  const handleCheckout = async (plan: PricingPlan) => {
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
                         <div className="flex items-center gap-3">
                           <div className="bg-muted border-foreground/5 flex size-10 items-center justify-center rounded-lg border">
                             {renderIcon(plan.iconName)}
                           </div>
                           <h2 className="text-2xl font-semibold text-black dark:text-white">{plan.title}</h2>
                         </div>
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
