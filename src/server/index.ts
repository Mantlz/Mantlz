import { j } from "./jstack"

import { formRouter } from "./routers/form-router"
import { authRouter } from "./routers/auth-route"
import { apiKeyRouter } from "./routers/api-key-router"
import { usageRouter } from "./routers/usage-router"
import { userRouter } from "./routers/user-router"
import { paymentRouter } from "./routers/payment-router"
import { campaignRouter } from "./routers/campaign-router"
import { trackingRouter } from "./routers/tracking-router"
import { scheduler } from "./jobs/scheduler"

// Start the scheduler for background jobs
if (process.env.NODE_ENV !== "test") {
  scheduler.start();
  console.log("Background job scheduler started");
}

const api = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  .onError(j.defaults.errorHandler)


const appRouter = j.mergeRouters(api, {
  forms: formRouter,
  apiKey: apiKeyRouter,
  auth: authRouter,
  usage: usageRouter,
  user: userRouter,
  payment: paymentRouter,
  campaign: campaignRouter,
  tracking: trackingRouter,
})

export type AppRouter = typeof appRouter

export default appRouter
