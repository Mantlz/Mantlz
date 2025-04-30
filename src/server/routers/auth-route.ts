// routers/auth-route.ts
import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { HTTPException } from "hono/http-exception"
import { j } from "../jstack"
import { sendWelcomeEmail } from "@/services/welcome-email-service"

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
            clerkId: auth.id,
            email: primaryEmail.emailAddress,
            firstName: auth.firstName ?? null,
            lastName: auth.lastName ?? null,
            imageUrl: auth.imageUrl ?? null,
            //plan: "FREE",
            quotaLimit: 1,
          },
        })
        console.log('Created new user:', newUser)

        // Send welcome email
        try {
          await sendWelcomeEmail({
            userName: `${newUser.firstName || 'there'}`,
            userEmail: newUser.email,
            resendApiKey: process.env.RESEND_API_KEY || '',
          })
          console.log('Welcome email sent successfully')
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError)
          // Don't throw error here, just log it since email sending is not critical
        }

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