import { createCheckoutSession, createPortalSession } from "@/lib/stripe"
import { db } from "@/lib/db"
import { SubscriptionStatus } from "@prisma/client"

// Price ID to Plan mapping
const PRICE_TO_PLAN = {
  [process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID ?? '']: 'STANDARD',
  [process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? '']: 'PRO'
} as const

export interface CreateCheckoutSessionParams {
  userEmail: string
  userId: string
  priceId: string
  metadata?: {
    userId: string
    userEmail: string
    plan: string
  }
}

export interface CreatePortalSessionParams {
  userId: string
}

export class PaymentService {
  static async createCheckoutSession({ userEmail, userId, priceId }: CreateCheckoutSessionParams) {
    // Determine the plan from the price ID
    const plan = PRICE_TO_PLAN[priceId] || 'FREE'
    
    console.log('Creating checkout session with:', { priceId, plan, userId })

    const session = await createCheckoutSession({
      userEmail,
      userId,
      priceId,
      metadata: {
        userId,
        userEmail,
        plan
      }
    })

    return session
  }

  static async createPortalSession({ userId }: CreatePortalSessionParams) {
    console.log('Received portal request for user:', userId)

    // Find user's subscription and Stripe customer ID
    const subscription = await db.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
      include: {
        user: true,
      },
    })

    if (!subscription?.stripeUserId) {
      console.log('No active subscription found for user')
      throw new Error("No active subscription found")
    }

    // Create Stripe portal session
    console.log('Creating portal session for customer:', subscription.stripeUserId)
    const portalSession = await createPortalSession({
      userId,
    })

    console.log('Portal session created:', portalSession.id)
    return portalSession
  }
} 