import { z } from "zod";
import { j, privateProcedure } from '../jstack';
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { HTTPException } from "hono/http-exception";
import { nanoid } from 'nanoid';

// All inputs are validated using Zod
const createApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export const apiKeyRouter = j.router({
  create: privateProcedure
    .input(createApiKeySchema)
    .mutation(async ({ c, input }) => {
      const auth = await currentUser();
      if (!auth) throw new HTTPException(401, { message: "Unauthorized" });

      const user = await db.user.findUnique({
        where: { clerkId: auth.id },
        include: {
          apiKeys: {
            where: { isActive: true }
          }
        }
      });

      if (!user) throw new HTTPException(404, { message: "User not found" });

      // Check if user already has an active API key
      if (user.apiKeys.length > 0) {
        throw new HTTPException(400, { 
          message: "You already have an active API key. Please revoke it first if you need a new one." 
        });
      }

      // Generate a secure API key with prefix
      const key = `mk_${nanoid(32)}`;

      const apiKey = await db.apiKey.create({
        data: {
          key,
          name: input.name,
          userId: user.id,
        },
      });

      return c.superjson({
        id: apiKey.id,
        key,
        name: apiKey.name,
      });
    }),

  getCurrentKey: privateProcedure.query(async ({ c }) => {
    const auth = await currentUser();
    if (!auth) throw new HTTPException(401, { message: "Unauthorized" });

    const user = await db.user.findUnique({
      where: { clerkId: auth.id },
    });

    if (!user) throw new HTTPException(404, { message: "User not found" });

    const apiKey = await db.apiKey.findFirst({
      where: { 
        userId: user.id,
        isActive: true
      },
      select: {
        id: true,
        key: true,
        name: true,
        createdAt: true,
        lastUsedAt: true,
      },
    });

    return c.superjson({ data: apiKey });
  }),

  revoke: privateProcedure.mutation(async ({ c }) => {
    const auth = await currentUser();
    if (!auth) throw new HTTPException(401, { message: "Unauthorized" });

    const user = await db.user.findUnique({
      where: { clerkId: auth.id },
    });

    if (!user) throw new HTTPException(404, { message: "User not found" });

    // Delete the API key instead of marking it as inactive
    await db.apiKey.deleteMany({
      where: {
        userId: user.id,
        isActive: true,
      },
    });

    return c.superjson({ success: true });
  }),

  validate: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ c, input }) => {
      const apiKey = await db.apiKey.findFirst({
        where: { 
          key: input.key,
          isActive: true
        },
      });

      if (!apiKey) {
        throw new HTTPException(401, { message: "Invalid API key" });
      }

      // Update last used timestamp
      await db.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsedAt: new Date() },
      });

      return c.superjson({ valid: true });
    }),
}); 