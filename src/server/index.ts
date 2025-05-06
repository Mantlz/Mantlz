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

// Start the scheduler for background jobs with a delay to ensure database connection is ready
if (process.env.NODE_ENV !== "test") {
  // Use a short delay before starting the scheduler to allow server to fully initialize
  setTimeout(() => {
    try {
      scheduler.start();
      console.log("Background job scheduler started");
    } catch (error) {
      console.error("Failed to start background job scheduler:", error);
      // Try again once after a longer delay if initial start fails
      setTimeout(() => {
        try {
          scheduler.start();
          console.log("Background job scheduler started (retry)");
        } catch (retryError) {
          console.error("Failed to start background job scheduler on retry:", retryError);
        }
      }, 60000); // Try again after 1 minute
    }
  }, 5000); // Initial 5 second delay
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
