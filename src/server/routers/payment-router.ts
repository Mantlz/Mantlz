import { createCheckoutSession } from "@/lib/stripe"
import { j, privateProcedure } from "../jstack"
import { z } from "zod"

// Price ID to Plan mapping
const PRICE_TO_PLAN = {
  [process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID ?? '']: 'STANDARD',
  [process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? '']: 'PRO'
} as const

export const paymentRouter = j.router({
  createCheckoutSession: privateProcedure
    .input(z.object({ priceId: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
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
})