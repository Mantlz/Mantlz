import Stripe from "stripe"
import { db } from "@/lib/db"
import { Plan, SubscriptionStatus } from "@prisma/client"


export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-03-31.basil",
  typescript: true,
})

// Get price IDs from environment variables
const STRIPE_PRICE_IDS = {
  STANDARD: {
    MONTHLY: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID || "",
  },
  PRO: {
    MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "",
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
  // Use the plan from metadata if provided, otherwise determine from price ID
  let plan = metadata?.plan || "FREE"
  if (!metadata?.plan) {
    if (priceId === STRIPE_PRICE_IDS.STANDARD.MONTHLY) {
      plan = "STANDARD"
    } else if (priceId === STRIPE_PRICE_IDS.PRO.MONTHLY) {
      plan = "PRO"
    }
  }

  console.log(`Creating checkout session for plan: ${plan} with priceId: ${priceId}`)

  const session = await stripe.checkout.sessions.create({
    customer_email: userEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
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
  const { metadata } = subscription
  const userId = metadata?.userId
  const userEmail = metadata?.userEmail
  const plan = metadata?.plan

  if (!userId || !userEmail || !plan) {
    console.error("Missing required metadata:", { userId, userEmail, plan })
    return
  }

  try {
    // Log subscription data for debugging
    console.log("Subscription data:", {
      id: subscription.id,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      status: subscription.status,
      plan
    })

    // Safely convert timestamps to Date objects
    let startDate = subscription.current_period_start 
      ? new Date(Number(subscription.current_period_start) * 1000) 
      : new Date()
    
    let endDate = subscription.current_period_end 
      ? new Date(Number(subscription.current_period_end) * 1000) 
      : null

    // Validate dates
    if (isNaN(startDate.getTime())) {
      console.error("Invalid start date:", subscription.current_period_start)
      startDate = new Date()
    }

    if (endDate && isNaN(endDate.getTime())) {
      console.error("Invalid end date:", subscription.current_period_end)
      endDate = null
    }

    // Get the customer ID as a string
    let stripeUserId: string
    if (typeof subscription.customer === 'string') {
      stripeUserId = subscription.customer
    } else if (subscription.customer && typeof subscription.customer === 'object' && 'id' in subscription.customer) {
      stripeUserId = subscription.customer.id
    } else {
      console.error("Invalid customer data:", subscription.customer)
      stripeUserId = "unknown"
    }

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

    // Get the current user to check if plan has changed
    const currentUser = await db.user.findUnique({
      where: { id: userId },
      select: { plan: true, quotaLimit: true }
    })

    // Determine the new quota limit based on the plan
    const newQuotaLimit = plan === "PRO" ? 10000 : plan === "STANDARD" ? 1000 : 100

    // Update user's plan and quota
    await db.user.update({
      where: { id: userId },
      data: {
        plan: plan.toUpperCase() as Plan,
        quotaLimit: newQuotaLimit,
      }
    })

    // Then update or create the subscription
    await db.subscription.upsert({
      where: { userId },
      create: {
        userId,
        subscriptionId: subscription.id,
        status: subscription.status.toUpperCase() as SubscriptionStatus,
        startDate,
        endDate,
        planId: subscriptionPlan.id,
        email: userEmail,
        clerkId: userId,
        stripeUserId,
      },
      update: {
        status: subscription.status.toUpperCase() as SubscriptionStatus,
        startDate,
        endDate,
        planId: subscriptionPlan.id,
      }
    })

    // If the plan has changed, update the quota records
    if (currentUser && currentUser.plan !== plan.toUpperCase()) {
      console.log(`Plan changed from ${currentUser.plan} to ${plan.toUpperCase()}, updating quota records`)
      
      // Get the current date
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1 // JavaScript months are 0-indexed
      
      // Check if a quota record exists for the current month
      const existingQuota = await db.quota.findFirst({
        where: {
          userId,
          year: currentYear,
          month: currentMonth
        }
      })

      if (existingQuota) {
        // Update existing quota record - only update the count if it's a new month
        await db.quota.update({
          where: { id: existingQuota.id },
          data: {
            // Don't reset the count when updating an existing quota
          }
        })
      } else {
        // Create new quota record
        await db.quota.create({
          data: {
            userId,
            year: currentYear,
            month: currentMonth,
            count: 0 // Reset count for new quota records
          }
        })
      }
    }

    console.log(`Successfully updated subscription for user ${userId} to plan ${plan}`)
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

  // Get the customer ID from the session
  const customerId = session.customer as string
  if (!customerId) {
    console.error("No customer ID found in session")
    throw new Error("No customer ID found in session")
  }

  console.log(`[DEBUG] Updating user ${userId} with Stripe customer ID: ${customerId}`)

  // Update user's stripe customer ID
  await db.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customerId }
  })

  // Handle subscription update
  const subscription = (await stripe.subscriptions.retrieve(session.subscription as string)) as unknown as StripeSubscription
  await handleSubscriptionUpdate(subscription)
}