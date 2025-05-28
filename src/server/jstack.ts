import { HTTPException } from "hono/http-exception"
import { jstack } from "jstack"
import { db } from "../lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { ratelimitConfig } from "@/lib/ratelimiter"
import { cache, CACHE_KEYS } from "./cache"

interface Env {
  Bindings: { DATABASE_URL: string }
}

export const j = jstack.init<Env>()

const authMiddleware = j.middleware(async ({ c, next }) => {
  const authHeader = c.req.header("Authorization")

  if (authHeader) {
    const apiKey = authHeader.split(" ")[1]
    if (!apiKey) {
      throw new HTTPException(401, { message: "Invalid API key format" })
    }

    // Try to get API key from cache first
    const cachedKey = await cache.getApiKey(apiKey)
    if (cachedKey?.isActive && cachedKey.user) {
      return next({ user: cachedKey.user })
    }

    const keyRecord = await db.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true }
    })

    if (keyRecord?.isActive && keyRecord.user) {
      // Cache the API key for future requests
      await cache.set(`${CACHE_KEYS.API_KEY}${apiKey}`, keyRecord, 60 * 30) // Cache for 30 minutes
      return next({ user: keyRecord.user })
    }
  }

  const auth = await currentUser()

  if (!auth) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  // Try to get user from cache first
  const cachedUser = await cache.getUser(auth.id)
  if (cachedUser) {
    return next({ user: cachedUser })
  }

  const user = await db.user.findUnique({
    where: { clerkId: auth.id },
  })

  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  // Cache the user for future requests
  await cache.set(`${CACHE_KEYS.USER}${auth.id}`, user, 60 * 15) // Cache for 15 minutes

  return next({ user })
})

// Create a rate limiting middleware
const rateLimitMiddleware = j.middleware(async ({ c, next }) => {
  // Check if rate limiter is properly configured
  if (!ratelimitConfig.enabled || !ratelimitConfig.ratelimit) {
    // In production, fail if rate limiting isn't enabled
    if (process.env.NODE_ENV === 'production') {
      throw new Error("Rate limiter is not configured! Cannot start server without rate limiting in production.");
    } else {
      // In development/test, warn but continue
      console.warn("Rate limiter is not configured. Continuing without rate limiting in development mode.");
      return next();
    }
  }

  // Get identifier for rate limiting (IP address or user ID if authenticated)
  let identifier = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'anonymous'
  
  // If user is authenticated, use their ID as the identifier for more precise rate limiting
  const auth = await currentUser()
  if (auth) {
    identifier = `user_${auth.id}`
  }

  // Apply rate limiting
  const result = await ratelimitConfig.ratelimit.limit(identifier)
  
  // Add rate limit headers to the response
  c.header('X-RateLimit-Limit', result.limit.toString())
  c.header('X-RateLimit-Remaining', result.remaining.toString())
  c.header('X-RateLimit-Reset', result.reset.toString())
  
  // If rate limit is exceeded, throw a 429 error
  if (!result.success) {
    throw new HTTPException(429, { 
      message: "Too many requests. Please try again later." 
    })
  }
  
  return next()
})

/**
 * Public (unauthenticated) procedures
 * This is the base part you use to create new procedures.
 */
export const publicProcedure = j.procedure.use(rateLimitMiddleware)
export const privateProcedure = publicProcedure.use(authMiddleware)

// Add type declarations for context
declare module 'jstack' {
  interface Context {
    user?: {
      id: string;
      clerkId: string;
      email: string;
      plan: string;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}