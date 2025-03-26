import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { apiKeys } from '@/server/db/schema'
import { randomBytes } from 'crypto'
import { hash, compare } from 'bcryptjs'

const createApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export const apiKeyRouter = createTRPCRouter({
  getCurrentKey: protectedProcedure
    .query(async ({ ctx }) => {
      const key = await ctx.db.query.apiKeys.findFirst({
        where: eq(apiKeys.userId, ctx.session.user.id),
        orderBy: (apiKeys, { desc }) => [desc(apiKeys.createdAt)],
      })

      return key
    }),

  create: protectedProcedure
    .input(createApiKeySchema)
    .mutation(async ({ ctx, input }) => {
      // Generate a secure random API key
      const key = `mk_${randomBytes(32).toString('hex')}`
      
      // Hash the key before storing
      const hashedKey = await hash(key, 12)

      // Store the hashed key
      const [apiKey] = await ctx.db
        .insert(apiKeys)
        .values({
          userId: ctx.session.user.id,
          name: input.name,
          key: hashedKey,
        })
        .returning()

      // Return the original key only once
      return {
        ...apiKey,
        key, // Return the original unhashed key
      }
    }),

  revoke: protectedProcedure
    .mutation(async ({ ctx }) => {
      const [apiKey] = await ctx.db
        .delete(apiKeys)
        .where(eq(apiKeys.userId, ctx.session.user.id))
        .returning()

      if (!apiKey) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No API key found',
        })
      }

      return apiKey
    }),

  validate: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const apiKey = await ctx.db.query.apiKeys.findFirst({
        where: eq(apiKeys.userId, ctx.session.user.id),
      })

      if (!apiKey) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No API key found',
        })
      }

      const isValid = await compare(input.key, apiKey.key)

      if (!isValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid API key',
        })
      }

      // Update last used timestamp
      await ctx.db
        .update(apiKeys)
        .set({ lastUsedAt: new Date() })
        .where(eq(apiKeys.id, apiKey.id))

      return { valid: true }
    }),
}) 