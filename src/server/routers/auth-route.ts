// routers/auth-route.ts
import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { HTTPException } from "hono/http-exception"
import { j } from "../jstack"

export const authRouter = j.router({
  getDatabaseSyncStatus: j.procedure.query(async ({ c }) => {
    try {
      const auth = await currentUser()
      console.log('Auth status:', !!auth)

      if (!auth) {
        return c.superjson({ isSynced: false, message: "Not authenticated" })
      }

      const primaryEmail = auth.emailAddresses?.find(email => email.id === auth.primaryEmailAddressId)
      if (!primaryEmail?.emailAddress) {
        return c.superjson({ isSynced: false, message: "No valid email address found" })
      }

      const user = await db.user.findFirst({
        where: { clerkId: auth.id },
      })

      console.log('User in Database 👨:', user)

      if (!user) {
        // If no user, create one
        const newUser = await db.user.create({
          data: {
            quotaLimit: 100,
            clerkId: auth.id,
            email: primaryEmail.emailAddress,
            name: auth.firstName ?? "",
            plan: "FREE"
          },
        })
        console.log('Created new user:', newUser)
        return c.superjson({ isSynced: true }) // Important: return isSynced true after creation
      }

      // User exists
      return c.superjson({ isSynced: true })

    } catch (error) {
      console.error('Error in sync endpoint:', error)
      throw new HTTPException(500, { message: 'Failed to sync user' })
    }
  }),
})