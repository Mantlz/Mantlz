import { createCheckoutSession } from "@/lib/stripe"
import { j, privateProcedure } from "../jstack"
import { z } from "zod"

export const paymentRouter = j.router({
  createCheckoutSession: privateProcedure
    .input(z.object({ priceId: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx

      const session = await createCheckoutSession({
        userEmail: user.email,
        userId: user.id,
        priceId: input.priceId,
        metadata: {
          userId: user.id,
          userEmail: user.email
        }
      })

      return c.json({ url: session.url })
    }),

})