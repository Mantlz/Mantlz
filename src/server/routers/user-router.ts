import { z } from "zod";
import { j, privateProcedure } from "../jstack";
import { HTTPException } from "hono/http-exception";
import { db } from "@/lib/db";

export const userRouter = j.router({
  // Get the user's Resend API key
  getResendApiKey: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx;
    if (!user) {
      throw new HTTPException(401, { message: "You must be logged in to get your Resend API key" });
    }

    // Get user with email settings
    const userWithSettings = await db.user.findUnique({
      where: { id: user.id },
      include: {
        forms: {
          include: {
            emailSettings: true
          }
        }
      }
    });

    if (!userWithSettings) {
      throw new HTTPException(404, { message: "User not found" });
    }

    // Check if any form has developer notifications enabled
    const hasDeveloperNotifications = userWithSettings.forms.some(
      form => form.emailSettings?.developerNotificationsEnabled
    );

    return c.superjson({
      resendApiKey: user.resendApiKey || "",
      plan: user.plan,
      developerNotificationsEnabled: hasDeveloperNotifications,
    });
  }),

  // Update the user's Resend API key
  updateResendApiKey: privateProcedure
    .input(
      z.object({
        resendApiKey: z.string().min(1),
        developerNotificationsEnabled: z.boolean().optional(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx;
      if (!user) {
        throw new HTTPException(401, { message: "You must be logged in to update your Resend API key" });
      }

      // Validate that the API key starts with re_
      if (!input.resendApiKey.startsWith("re_")) {
        throw new HTTPException(400, { message: "Invalid Resend API key format. It should start with 're_'" });
      }

      try {
        // Update user's Resend API key
        const updatedUser = await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            resendApiKey: input.resendApiKey,
          },
          select: {
            id: true,
          },
        });

        // If developer notifications setting is provided, update all forms' email settings
        if (input.developerNotificationsEnabled !== undefined) {
          await db.emailSettings.updateMany({
            where: {
              form: {
                userId: user.id
              }
            },
            data: {
              developerNotificationsEnabled: input.developerNotificationsEnabled
            }
          });
        }

        return c.superjson({
          success: true,
          userId: updatedUser.id,
        });
      } catch (error) {
        throw new HTTPException(500, { message: "Failed to update Resend API key", cause: error });
      }
    }),

    // Get user's current plan
  getUserPlan: privateProcedure.query(async ({ ctx, c }) => {
    const { user } = ctx

    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: { plan: true }
    })

    return c.json({
      plan: userData?.plan || "FREE"
    })
  }),
}); 