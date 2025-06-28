import Stripe from "stripe"
import { db } from "@/lib/db"
import { Plan, SubscriptionStatus } from "@prisma/client"
import { PaymentEmailService } from "@/services/payment-email-service"
import { FREE_QUOTA } from "@/config/usage"


export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-05-28.basil",
  typescript: true,
})


  // apiVersion: "2025-05-28.basil",

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

  // Ensure NEXT_PUBLIC_APP_URL is set
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_APP_URL is not set")
    throw new Error("NEXT_PUBLIC_APP_URL is not set")
  }

  // Log the success URL for debugging
  const successUrl = `${baseUrl}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`
  console.log("Stripe checkout success URL:", successUrl)

  const session = await stripe.checkout.sessions.create({
    customer_email: userEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: `${baseUrl}/pricing?canceled=true`,
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

  console.log("Created Stripe checkout session:", {
    id: session.id,
    successUrl: session.success_url,
    cancelUrl: session.cancel_url
  })

  return session
}

interface CreatePortalSessionParams {
  userId: string
}

export async function createPortalSession({
  userId
}: CreatePortalSessionParams) {
  // Get the customer ID from the database
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true }
  })

  if (!user?.stripeCustomerId) {
    throw new Error("No Stripe customer ID found for user")
  }

  // Create a portal session
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
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
  let plan = metadata?.plan

  if (!userId || !userEmail) {
    console.error("Missing required metadata:", { userId, userEmail, plan })
    return
  }

  // If subscription is canceled or incomplete_expired, downgrade to FREE plan
  if (subscription.status === 'canceled' || subscription.status === 'incomplete_expired') {
    plan = 'FREE'
    console.log(`Subscription ${subscription.id} is ${subscription.status}, downgrading user ${userId} to FREE plan`)
  }

  if (!plan) {
    console.error("Missing plan metadata and subscription is not canceled:", { userId, userEmail, status: subscription.status })
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
    const newQuotaLimit = plan === "PRO" ? 10000 : plan === "STANDARD" ? 1000 : plan === "FREE" ? FREE_QUOTA.maxSubmissionsPerMonth : 100

    // Check if this is a downgrade to FREE plan
    const isDowngradeToFree = currentUser && currentUser.plan !== "FREE" && plan === "FREE"

    // Update user's plan and quota
    await db.user.update({
      where: { id: userId },
      data: {
        plan: plan.toUpperCase() as Plan,
        quotaLimit: newQuotaLimit,
      }
    })

    // Send cancellation email if downgraded to FREE plan
    if (isDowngradeToFree) {
      await PaymentEmailService.sendSubscriptionCanceledEmail({
        to: userEmail,
        currentPlan: currentUser.plan,
        reactivationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`
      })
      console.log(`Sent subscription cancellation email to ${userEmail} for downgrade from ${currentUser.plan} to FREE`)
    }

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

    // If the plan has changed, update the quota records and send success email
    if (currentUser && currentUser.plan !== plan.toUpperCase()) {
      console.log(`Plan changed from ${currentUser.plan} to ${plan.toUpperCase()}, updating quota records and sending email`)
      
      // Get plan features based on the new plan
      const planFeatures = plan === "PRO" ? [
        "10 Forms",
        "10,000 submissions per month",
        "Complete analytics suite",
        "Form campaigns (10/month)",
        "Up to 10,000 recipients per campaign",
        "Premium support",
        "Custom domains",
        "Team collaboration",
        "API access"
      ] : plan === "STANDARD" ? [
        "5 Forms",
        "5,000 submissions per month",
        "Advanced analytics",
        "Form campaigns (3/month)",
        "Up to 500 recipients per campaign",
        "Priority support",
        "Custom branding"
      ] : [
        "1 Form",
        "200 submissions per month",
        "Basic form analytics",
        "Form validation",
        "Standard support"
      ]

      // Send success email
      await PaymentEmailService.sendSubscriptionUpgradeSuccessEmail({
        to: userEmail,
        plan: plan.charAt(0) + plan.slice(1).toLowerCase(), // Capitalize first letter
        nextBillingDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now if no end date
        features: planFeatures
      })
      
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
            submissionCount: 0 // Reset count for new quota records
          }
        })
      } else {
        // Create new quota record
        await db.quota.create({
          data: {
            userId,
            year: currentYear,
            month: currentMonth,
            submissionCount: 0 // Reset count for new quota records
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