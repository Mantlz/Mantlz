import { j } from "./jstack"
import { postRouter } from "./routers/post-router"
import { formRouter } from "./routers/form-router"
import { authRouter } from "./routers/auth-route"

/**
 * This is your base API.
 * Here, you can handle errors, not-found responses, cors and more.
 *
 * @see https://jstack.app/docs/backend/app-router
 */
const api = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  .onError(j.defaults.errorHandler)

/**
 * This is the main router for your server.
 * All routers in /server/routers should be added here manually.
 */
const appRouter = j.mergeRouters(api, {
  post: postRouter,
  form: formRouter,
  auth: authRouter,
})

export type AppRouter = typeof appRouter

export default appRouter
