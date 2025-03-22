import { HTTPException } from "hono/http-exception"
import { jstack } from "jstack"
import { db } from "../lib/db"
import { currentUser } from "@clerk/nextjs/server"

interface Env {
  Bindings: { DATABASE_URL: string }
}

export const j = jstack.init<Env>()

const authMiddleware = j.middleware(async ({ c, next }) => {
  const authHeader = c.req.header("Authorization")

  if (authHeader) {
    const apiKey = authHeader.split(" ")[1] // bearer <API_KEY>

    const keyRecord = await db.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true }
    })

    if (keyRecord?.isActive && keyRecord.user) return next({ user: keyRecord.user })
  }

  const auth = await currentUser()

  if (!auth) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  const user = await db.user.findUnique({
    where: { clerkId: auth.id },
  })

  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  return next({ user })
})

/**
 * Public (unauthenticated) procedures
 * This is the base part you use to create new procedures.
 */
export const publicProcedure = j.procedure
export const privateProcedure = publicProcedure.use(authMiddleware)