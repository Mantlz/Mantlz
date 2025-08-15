import { j } from "./jstack"

// Dynamic imports for better performance
const routerImports = {
  formRouter: () => import("./routers/form-router").then(m => m.formRouter),
  authRouter: () => import("./routers/auth-route").then(m => m.authRouter),
  apiKeyRouter: () => import("./routers/api-key-router").then(m => m.apiKeyRouter),
  usageRouter: () => import("./routers/usage-router").then(m => m.usageRouter),
  userRouter: () => import("./routers/user-router").then(m => m.userRouter),
  paymentRouter: () => import("./routers/payment-router").then(m => m.paymentRouter),
  campaignRouter: () => import("./routers/campaign-router").then(m => m.campaignRouter),
  trackingRouter: () => import("./routers/tracking-router").then(m => m.trackingRouter),
  stripeRouter: () => import("./routers/stripe-router").then(m => m.stripeRouter),
  slackRouter: () => import("./routers/slack-router").then(m => m.slackRouter),
  discordRouter: () => import("./routers/discord-router").then(m => m.discordRouter),
  chatRouter: () => import("./routers/chat-router").then(m => m.chatRouter),
}

const api = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  .onError(j.defaults.errorHandler)

// Create router with lazy loading
const appRouter = j.mergeRouters(api, {
  forms: routerImports.formRouter,
  apiKey: routerImports.apiKeyRouter,
  auth: routerImports.authRouter,
  usage: routerImports.usageRouter,
  user: routerImports.userRouter,
  payment: routerImports.paymentRouter,
  campaign: routerImports.campaignRouter,
  tracking: routerImports.trackingRouter,
  stripe: routerImports.stripeRouter,
  slack: routerImports.slackRouter,
  discord: routerImports.discordRouter,
  chat: routerImports.chatRouter,
})

export type AppRouter = typeof appRouter
export default appRouter
