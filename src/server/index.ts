import { j } from "./jstack"

import { formRouter } from "./routers/form-router"
import { authRouter } from "./routers/auth-route"
import { apiKeyRouter } from "./routers/api-key-router"
import { usageRouter } from "./routers/usage-router"
import { userRouter } from "./routers/user-router"
import { paymentRouter } from "./routers/payment-router"


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

})

export type AppRouter = typeof appRouter

export default appRouter
