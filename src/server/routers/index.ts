import { j } from "../jstack"
import { paymentRouter } from "./payment-router"
import { userRouter } from "./user-router"

export const appRouter = j.router({
  payment: paymentRouter,
  user: userRouter
})

export type AppRouter = typeof appRouter 