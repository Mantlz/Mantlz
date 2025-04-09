import Stripe from "stripe"
import { db } from "@/lib/db"
import { Plan, SubscriptionStatus } from "@prisma/client"
import { FREE_QUOTA, STANDARD_QUOTA, PRO_QUOTA } from "@/config/usage"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-03-31.basil",
  typescript: true,
})

// Get price IDs from environment variables
const STRIPE_PRICE_IDS = {
  STANDARD: {
    MONTHLY: process.env.STRIPE_STANDARD_PRICE_ID || "",
    YEARLY: process.env.STRIPE_STANDARD_YEARLY_PRICE_ID || "",
  },
  PRO: {
    MONTHLY: process.env.STRIPE_PRO_PRICE_ID || "",
    YEARLY: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
  }
} as const

interface CreateCheckoutSessionParams {
  userEmail: string
  userId: string
  priceId: string
  metadata?: Record<string, string>
}

export async function createCheckoutSession({
  userEmail,
  userId,
  priceId,
  metadata
}: CreateCheckoutSessionParams) {
  // Determine plan based on price ID
  let plan = "FREE"
  if (priceId === STRIPE_PRICE_IDS.STANDARD.MONTHLY || priceId === STRIPE_PRICE_IDS.STANDARD.YEARLY) {
    plan = "STANDARD"
  } else if (priceId === STRIPE_PRICE_IDS.PRO.MONTHLY || priceId === STRIPE_PRICE_IDS.PRO.YEARLY) {
    plan = "PRO"
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: userEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: {
      userId,
      userEmail,
      plan,
      ...metadata
    },
    subscription_data: {
      metadata: {
        userId,
        userEmail,
        plan,
        ...metadata
      }
    }
  })

  return session
}

type StripeSubscription = Stripe.Subscription & {
  current_period_start: number;
  current_period_end: number;
}

export async function handleSubscriptionUpdate(subscription: StripeSubscription) {
  const { metadata, items } = subscription
  const userId = metadata?.userId
  const userEmail = metadata?.userEmail
  const plan = metadata?.plan

  if (!userId || !userEmail || !plan) {
    console.error("Missing required metadata:", { userId, userEmail, plan })
    return
  }

  try {
    // First, get or create the subscription plan
    const subscriptionPlan = await db.subscriptionPlan.upsert({
      where: { planId: plan },
      create: {
        planId: plan,
        name: plan,
        description: `${plan} Plan`,
        amount: subscription.items.data[0]?.price?.unit_amount || 0,
        currency: subscription.currency,
        maxForms: plan === "PRO" ? 100 : plan === "STANDARD" ? 50 : 10,
        maxSubmissionsPerMonth: plan === "PRO" ? 10000 : plan === "STANDARD" ? 1000 : 100,
      },
      update: {
        amount: subscription.items.data[0]?.price?.unit_amount || 0,
        currency: subscription.currency,
      }
    })

    // Then update or create the subscription
    await db.subscription.upsert({
      where: { userId },
      create: {
        userId,
        subscriptionId: subscription.id,
        status: subscription.status.toUpperCase() as SubscriptionStatus,
        startDate: new Date(Number(subscription.current_period_start) * 1000),
        endDate: subscription.current_period_end ? new Date(Number(subscription.current_period_end) * 1000) : null,
        planId: subscriptionPlan.id,
        email: userEmail,
        clerkId: userId,
        stripeUserId: subscription.customer as string,
      },
      update: {
        status: subscription.status.toUpperCase() as SubscriptionStatus,
        startDate: new Date(Number(subscription.current_period_start) * 1000),
        endDate: subscription.current_period_end ? new Date(Number(subscription.current_period_end) * 1000) : null,
        planId: subscriptionPlan.id,
      }
    })

    // Update user's plan and quota
    await db.user.update({
      where: { id: userId },
      data: {
        plan: plan.toUpperCase() as Plan,
        quotaLimit: plan === "PRO" ? 10000 : plan === "STANDARD" ? 1000 : 100,
      }
    })
  } catch (error) {
    console.error("Error updating subscription:", error)
    throw error
  }
}

export const handleCheckoutSession = async (session: Stripe.Checkout.Session) => {
  const { userId } = session.metadata || { userId: null }

  if (!userId) {
    throw new Error("Invalid metadata: userId missing")
  }

  // Retrieve the session with expanded line items
  const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items']
  })

  const priceId = expandedSession.line_items?.data?.[0]?.price?.id
  if (!priceId) {
    throw new Error("No price ID found in session")
  }

  // Update user's stripe customer ID
  await db.user.update({
    where: { id: userId },
    data: { stripeCustomerId: session.customer as string }
  })

  // Handle subscription update
  const subscription = (await stripe.subscriptions.retrieve(session.subscription as string)) as unknown as StripeSubscription
  await handleSubscriptionUpdate(subscription)
}