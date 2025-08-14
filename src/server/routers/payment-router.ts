import { createCheckoutSession, createPortalSession } from "@/lib/stripe"
import { j, privateProcedure } from "../jstack"
import { z } from "zod"
import { db } from "@/lib/db"
import { SubscriptionStatus } from "@prisma/client"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
})

// Price ID to Plan mapping
const PRICE_TO_PLAN = {
  [process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID ?? '']: 'STANDARD',
  [process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? '']: 'PRO'
} as const

export const paymentRouter = j.router({
  createCheckoutSession: privateProcedure
    .input(z.object({ priceId: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx as { user: { id: string; clerkId: string; email: string; plan: string; createdAt: Date; updatedAt: Date; } }
      const { priceId } = input

      // Determine the plan from the price ID
      const plan = PRICE_TO_PLAN[priceId] || 'FREE'
      
      console.log('Creating checkout session with:', { priceId, plan, userId: user.id })

      const session = await createCheckoutSession({
        userEmail: user.email,
        userId: user.id,
        priceId: input.priceId,
        metadata: {
          userId: user.id,
          userEmail: user.email,
          plan // Explicitly pass the plan in metadata
        }
      })

      return c.json({ url: session.url })
    }),
  createPortalSession: privateProcedure
    .mutation(async ({ c, ctx }) => {
      const { user } = ctx
      
      console.log('Received portal request for user:', user.id)

      // Find user's subscription and Stripe customer ID
      const subscription = await db.subscription.findFirst({
        where: {
          userId: user.id,
          status: SubscriptionStatus.ACTIVE,
        },
        include: {
          user: true,
        },
      })

      if (!subscription?.stripeUserId) {
        console.log('No active subscription found for user')
        return c.json(
          { error: "No active subscription found" },
          { status: 404 }
        )
      }

      // Create Stripe portal session
      console.log('Creating portal session for customer:', subscription.stripeUserId)
      const portalSession = await createPortalSession({
        userId: user.id,
      })

      console.log('Portal session created:', portalSession.id)
      return c.json({ url: portalSession.url })
    }),
  getInvoices: privateProcedure
    .mutation(async ({ c, ctx }) => {
      const { user } = ctx
      
      // Find user's subscription and Stripe customer ID
      const subscription = await db.subscription.findFirst({
        where: {
          userId: user.id,
          status: SubscriptionStatus.ACTIVE,
        },
      })

      if (!subscription?.stripeUserId) {
        return c.json(
          { error: "No active subscription found" },
          { status: 404 }
        )
      }

      // Get all invoices from Stripe
      const invoices = await stripe.invoices.list({
        customer: subscription.stripeUserId,
        limit: 100, // Increased limit to get more invoices
      })

      return c.json({
        invoices: invoices.data.map(invoice => ({
          id: invoice.id,
          number: invoice.number,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: invoice.status,
          created: invoice.created,
          pdf: invoice.invoice_pdf,
          hostedUrl: invoice.hosted_invoice_url,
        }))
      })
    }),
})