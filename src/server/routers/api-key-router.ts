import { z } from "zod";
import { j } from "../jstack";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { HTTPException } from "hono/http-exception";
import { nanoid } from 'nanoid';

export const apiKeyRouter = j.router({
  create: j.procedure
    .input(z.object({
      name: z.string().min(1),
    }))
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

  getCurrentKey: j.procedure.query(async ({ c }) => {
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

    return c.superjson(apiKey);
  }),

  revoke: j.procedure
    .mutation(async ({ c }) => {
      const auth = await currentUser();
      if (!auth) throw new HTTPException(401, { message: "Unauthorized" });

      const user = await db.user.findUnique({
        where: { clerkId: auth.id },
      });

      if (!user) throw new HTTPException(404, { message: "User not found" });

      await db.apiKey.updateMany({
        where: {
          userId: user.id,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });

      return c.superjson({ success: true });
    }),
}); 