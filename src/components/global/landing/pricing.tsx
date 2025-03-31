"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { type Stripe, loadStripe } from "@stripe/stripe-js"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { FREE_QUOTA, STANDARD_QUOTA, PRO_QUOTA } from "@/config/usage"

type Plan = {
  title: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  buttonText: string
  isFeatured?: boolean
  stripePriceIdMonthly: string
  stripePriceIdYearly: string
  includedPlans?: string[]
  quota: typeof FREE_QUOTA | typeof STANDARD_QUOTA | typeof PRO_QUOTA
}

const plans: Plan[] = [
  {
    title: "Hobby",
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      "Access to basic analytics reports",
      "Up to 10,000 data points per month",
      "Email support",
      "Community forum access",
      "Cancel anytime"
    ],
    buttonText: "Get Hobby",
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_HOBBY_PRICE_ID || "",
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_HOBBY_YEARLY_PRICE_ID || "",
    quota: FREE_QUOTA
  },
  {
    title: "Starter",
    monthlyPrice: 299,
    yearlyPrice: 2990,
    features: [
      "Advanced analytics dashboard",
      "Customizable reports and charts",
      "Real-time data tracking",
      "Integration with third-party tools"
    ],
    buttonText: "Get Starter",
    isFeatured: true,
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || "",
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_STARTER_YEARLY_PRICE_ID || "",
    includedPlans: ["Everything in Hobby Plan"],
    quota: STANDARD_QUOTA
  },
  {
    title: "Pro",
    monthlyPrice: 1490,
    yearlyPrice: 14900,
    features: [
      "Unlimited data storage",
      "Customizable dashboards",
      "Advanced data segmentation",
      "Real-time data processing",
      "AI-powered insights and recommendations"
    ],
    buttonText: "Get Pro",
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "",
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || "",
    includedPlans: ["Everything in Hobby Plan", "Everything in Starter Plan"],
    quota: PRO_QUOTA
  },
]

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const { isSignedIn, user } = useUser()
  const router = useRouter()

  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null)

  useEffect(() => {
    setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!))
  }, [])

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

    const priceId = isYearly ? plan.stripePriceIdYearly : plan.stripePriceIdMonthly

    try {
      const response = await axios.post("/api/payment/checkout-session", {
        priceId: priceId,
        userId: user?.id,
        email: user?.primaryEmailAddress?.emailAddress,
      })

      if (response.data.sessionId) {
        const stripe = await stripePromise
        const { error } = await stripe!.redirectToCheckout({
          sessionId: response.data.sessionId,
        })

        if (error) {
          console.error("Stripe checkout error:", error)
          toast.error("An error occurred. Please try again.")
        }
      } else {
        console.error("Failed to create checkout session", response.data)
        toast.error("Failed to create checkout session")
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error during checkout:", error.response.data)
        toast.error(`Error during checkout: ${error.response.data.error || "Unknown error"}`)
      } else {
        console.error("Error during checkout:", error)
        toast.error("Error during checkout")
      }
    }
  }

  return (
    <section className="overflow-hidden  bg-accent-foreground dark:bg-black bg-opacity-95 dark:bg-opacity-100" id="pricing">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.title} plan={plan} isYearly={isYearly} onCheckout={() => handleCheckout(plan)} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingCard({
  plan,
  isYearly,
  onCheckout,
}: {
  plan: Plan
  isYearly: boolean
  onCheckout: () => void
}) {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
  const period = "/month"

  return (
    <div className="relative w-full rounded-2xl bg-neutral-900 dark:bg-neutral-900 shadow-xl">
      {plan.isFeatured && (
        <div className="absolute right-6 top-6">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
            Featured
          </span>
        </div>
      )}
      
      <div className="p-6">
        <h3 className="mb-6 text-xl font-semibold text-white dark:text-white">{plan.title}</h3>
        
        <div className="mb-6 flex items-baseline">
          <span className="text-6xl font-bold text-white dark:text-white">${price}</span>
          <span className="ml-1 text-gray-400 dark:text-gray-400">{period}</span>
        </div>
        
        <Button
          onClick={onCheckout}
          className="mb-8 w-full rounded-md bg-blue-600 py-5 text-center font-medium text-white hover:bg-blue-700 transition-colors duration-200"
        >
          {plan.buttonText}
        </Button>
        
        <ul className="space-y-4 text-sm">
          <li className="flex items-start gap-3 text-white dark:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400 dark:text-gray-400 mt-0.5 min-w-[18px]"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l2 2 4-4" />
            </svg>
            <span>{plan.quota.maxForms} {plan.quota.maxForms === 1 ? 'form' : 'forms'}</span>
          </li>
          <li className="flex items-start gap-3 text-white dark:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400 dark:text-gray-400 mt-0.5 min-w-[18px]"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l2 2 4-4" />
            </svg>
            <span>{new Intl.NumberFormat().format(plan.quota.maxSubmissionsPerMonth)} submissions per month</span>
          </li>
          
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-white dark:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-400 dark:text-gray-400 mt-0.5 min-w-[18px]"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l2 2 4-4" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        {plan.includedPlans && plan.includedPlans.length > 0 && (
          <div className="mt-8 pt-6 border-t border-neutral-800 dark:border-neutral-800">
            <ul className="space-y-3">
              {plan.includedPlans.map((includedPlan, index) => (
                <li key={index} className="flex items-start gap-3 text-white dark:text-white text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-blue-400 dark:text-blue-400 mt-0.5 min-w-[18px]"
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

