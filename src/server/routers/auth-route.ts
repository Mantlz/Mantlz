// routers/auth-route.ts
import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { HTTPException } from "hono/http-exception"
import { j } from "../jstack"
import { sendWelcomeEmail } from "@/services/welcome-email-service"
import { FREE_QUOTA } from "@/config/usage"

export const authRouter = j.router({
  getDatabaseSyncStatus: j.procedure.query(async ({ c }) => {
    try {
      const auth = await currentUser()
      console.log('Auth status:', !!auth)

      if (!auth) {
        return c.superjson({ isSynced: false, message: "Not authenticated" })
      }

      const primaryEmail = auth.emailAddresses?.find((email: { id: string }) => email.id === auth.primaryEmailAddressId)
      if (!primaryEmail?.emailAddress) {
        return c.superjson({ isSynced: false, message: "No valid email address found" })
      }

      const user = await db.user.findFirst({
        where: { clerkId: auth.id },
      }) as { id: string; email: string; clerkId: string; firstName: string | null; lastName: string | null; imageUrl: string | null; quotaLimit: number; plan: string } | null

      // console.log('User in Database 👨:', user)

      if (!user) {
        // Get current month and year for quota
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth() + 1 // JavaScript months are 0-indexed

        // If no user, create one with FREE plan quotas
        const newUser = await db.user.create({
          data: {
            clerkId: auth.id,
            email: primaryEmail.emailAddress,
            firstName: auth.firstName ?? null,
            lastName: auth.lastName ?? null,
            imageUrl: auth.imageUrl ?? null,
            plan: "FREE",
            quotaLimit: FREE_QUOTA.maxSubmissionsPerMonth,
            globalSettings: {
              create: {
                developerNotificationsEnabled: false,
                maxNotificationsPerHour: FREE_QUOTA.maxSubmissionsPerMonth
              }
            },
            // Create initial quota for current month
            quota: {
              create: {
                year: currentYear,
                month: currentMonth,
                submissionCount: 0,
                formCount: 0,
                campaignCount: 0,
                emailsSent: 0,
                emailsOpened: 0,
                emailsClicked: 0
              }
            }
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

      // For existing users, ensure they have a quota record for the current month
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1

      const currentQuota = await db.quota.findFirst({
        where: {
          userId: user.id,
          year: currentYear,
          month: currentMonth
        }
      })

      // If no quota record exists for current month, create one
      if (!currentQuota) {
        await db.quota.create({
          data: {
            userId: user.id,
            year: currentYear,
            month: currentMonth,
            submissionCount: 0,
            formCount: 0,
            campaignCount: 0,
            emailsSent: 0,
            emailsOpened: 0,
            emailsClicked: 0
          }
        })
      }

      // User exists
      return c.superjson({ isSynced: true })

    } catch (error) {
      console.error('Error in sync endpoint:', error)
      throw new HTTPException(500, { message: 'Failed to sync user' })
    }
  }),
})