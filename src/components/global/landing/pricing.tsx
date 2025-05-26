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
      "Custom branding",
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
      <section className="py-16 md:py-32" id="pricing">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Choose the plan that fits your needs</h1>
            <p className="mt-4 text-xl md:text-2xl text-muted-foreground">Start for free, upgrade as you grow</p>
          </div>
          <div className="relative">
            <div className="relative z-10 grid grid-cols-6 gap-3">
              {plans.map((plan) => (
                <Card key={plan.title} className={`relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 ${
                  plan.isPopular ? 'border-[3px] border-orange-900' : ''
                }`}>
                  <CardContent className="flex h-full flex-col pt-6">
                    <div className="flex items-center justify-between">
                      <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                        {plan.icon}
                      </div>
                      {plan.isPopular && (
                        <Badge variant="default" className="absolute right-6 bg-orange-950/80 text-white">Popular</Badge>
                      )}
                    </div>
                    <div className="mt-6 flex flex-1 flex-col">
                      <div className="space-y-2">
                        <h2 className="text-lg font-medium transition">{plan.title}</h2>
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold">${plan.monthlyPrice}</span>
                          <span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
                        </div>
                      </div>
                      <ul className="mt-6 flex-1 space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-muted-foreground">
                            <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => handleCheckout(plan)}
                        disabled={processingPlan === plan.title || isCurrentUserPlan(plan.title)}
                        className="mt-6 w-full"
                        variant={plan.isPopular ? "default" : "outline"}
                      >
                        {isCurrentUserPlan(plan.title) ? (
                          "Current Plan"
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
  )
}
