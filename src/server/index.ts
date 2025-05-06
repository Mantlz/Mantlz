import { j } from "./jstack"

import { formRouter } from "./routers/form-router"
import { authRouter } from "./routers/auth-route"
import { apiKeyRouter } from "./routers/api-key-router"
import { usageRouter } from "./routers/usage-router"
import { userRouter } from "./routers/user-router"
import { paymentRouter } from "./routers/payment-router"
import { campaignRouter } from "./routers/campaign-router"
import { trackingRouter } from "./routers/tracking-router"

// This is the main router for the API
// It combines all the routers into a single router
// It also sets the base path for the API
// It also sets the error handler for the API
// It also sets the cors for the API
// It also sets the defaults for the API
// It also sets the router for the API

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
