import { z } from "zod";
import { j, privateProcedure } from "../jstack";
import { StripeService } from "@/services/stripe-service";
import { HTTPException } from "hono/http-exception";
import { Plan } from "@prisma/client";
import { db } from "@/lib/db";

export const stripeRouter = j.router({
  // Generate OAuth link for connecting Stripe account
  generateConnectLink: privateProcedure
    .input(z.object({
      redirectUrl: z.string().url().optional(),
    }).optional())
    .mutation(async ({ c, input, ctx }) => {
      try {
        // Check if user is on PRO plan
        const user = await db.user.findUnique({
          where: { id: ctx.user.id },
          select: { plan: true }
        });

        if (!user || user.plan !== Plan.PRO) {
          throw new HTTPException(403, { message: "Stripe connection is only available for PRO users" });
        }

        const result = await StripeService.generateConnectOAuthLink(
          ctx.user.id,
          input?.redirectUrl
        );
        return c.superjson(result);
      } catch (error) {
        if (error instanceof HTTPException) throw error;
        console.error("Error generating Stripe connect link:", error);
        throw new HTTPException(500, { message: "Failed to generate Stripe connect link" });
      }
    }),

  // Get current Stripe connection status
  getConnectionStatus: privateProcedure
    .query(async ({ c, ctx }) => {
      try {
        console.log('Checking connection status for user:', ctx.user.id);
        
        // Check if user is on PRO plan
        const user = await db.user.findUnique({
          where: { id: ctx.user.id },
          select: { plan: true }
        });
        console.log('User plan:', user?.plan);

        if (!user) {
          throw new HTTPException(404, { message: "User not found" });
        }

        // If not PRO, return early with error
        if (user.plan !== Plan.PRO) {
          console.log('User is not on PRO plan');
          return c.superjson({
            connected: false,
            proPlan: false,
            message: "Stripe connection is only available for PRO users",
          });
        }

        // Check connection status
        const connection = await StripeService.getStripeConnection(ctx.user.id);
        console.log('Found connection:', {
          id: connection?.id,
          stripeAccountId: connection?.stripeAccountId,
          isActive: connection?.isActive,
          status: connection?.status,
          createdAt: connection?.createdAt
        });
        
        const response = {
          connected: !!connection,
          proPlan: true,
          connection: connection ? {
            id: connection.id,
            stripeAccountId: connection.stripeAccountId,
            createdAt: connection.createdAt,
            lastRefreshedAt: connection.lastRefreshedAt,
          } : null,
        };
        console.log('Sending response:', response);
        
        return c.superjson(response);
      } catch (error) {
        console.error("Error checking Stripe connection status:", error);
        throw new HTTPException(500, { message: "Failed to check Stripe connection status" });
      }
    }),

  // Disconnect Stripe account
  disconnectAccount: privateProcedure
    .mutation(async ({ c, ctx }) => {
      try {
        const result = await StripeService.disconnectStripeAccount(ctx.user.id);
        return c.superjson(result);
      } catch (error) {
        if (error instanceof HTTPException) throw error;
        console.error("Error disconnecting Stripe account:", error);
        throw new HTTPException(500, { message: "Failed to disconnect Stripe account" });
      }
    }),

  // Fetch products from Stripe account
  getProducts: privateProcedure
    .query(async ({ c, ctx }) => {
      try {
        // Fetch fresh products and update database
        await StripeService.fetchStripeProducts(ctx.user.id);
        
        // Get products from database
        const connection = await db.stripeConnection.findUnique({
          where: { userId: ctx.user.id, isActive: true },
        });
        
        if (!connection) {
          throw new HTTPException(404, { message: "Active Stripe connection not found" });
        }
        
        const products = await db.stripeProduct.findMany({
          where: {
            stripeConnectionId: connection.id,
            active: true,
          },
          orderBy: {
            name: 'asc',
          },
        });
        
        return c.superjson({ products });
      } catch (error) {
        if (error instanceof HTTPException) throw error;
        console.error("Error fetching Stripe products:", error);
        throw new HTTPException(500, { message: "Failed to fetch Stripe products" });
      }
    }),

  // Create a checkout session
  createCheckoutSession: privateProcedure
    .input(z.object({
      formId: z.string(),
      products: z.array(z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })),
      customerEmail: z.string().email().optional(),
      successUrl: z.string().url().optional(),
      cancelUrl: z.string().url().optional(),
    }))
    .mutation(async ({ c, input, ctx }) => {
      try {
        const { formId, products, customerEmail, successUrl, cancelUrl } = input;
        
        const result = await StripeService.createCheckoutSession(
          formId,
          ctx.user.id,
          products,
          customerEmail,
          successUrl,
          cancelUrl
        );
        
        return c.superjson(result);
      } catch (error) {
        if (error instanceof HTTPException) throw error;
        console.error("Error creating checkout session:", error);
        throw new HTTPException(500, { message: "Failed to create checkout session" });
      }
    }),

  // Get orders for a form
  getFormOrders: privateProcedure
    .input(z.object({
      formId: z.string(),
      limit: z.number().min(1).max(100).default(10),
      cursor: z.string().optional(),
      status: z.string().optional(),
    }))
    .query(async ({ c, input, ctx }) => {
      try {
        const { formId, limit, cursor, status } = input;
        
        // Verify form ownership
        const form = await db.form.findFirst({
          where: { id: formId, userId: ctx.user.id },
        });
        
        if (!form) {
          throw new HTTPException(404, { message: "Form not found or you do not have permission" });
        }
        
        // Query orders
        const orders = await db.stripeOrder.findMany({
          where: {
            formId,
            ...(status ? { status: status as any } : {}),
          },
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              include: {
                stripeProduct: true,
              },
            },
          },
        });
        
        // Check if we have more results
        const hasMore = orders.length > limit;
        const data = hasMore ? orders.slice(0, limit) : orders;
        
        return c.superjson({
          orders: data,
          nextCursor: hasMore && data.length > 0 ? data[data.length - 1]?.id : undefined,
        });
      } catch (error) {
        if (error instanceof HTTPException) throw error;
        console.error("Error fetching form orders:", error);
        throw new HTTPException(500, { message: "Failed to fetch form orders" });
      }
    }),

  // Get order details
  getOrderDetails: privateProcedure
    .input(z.object({
      orderId: z.string(),
    }))
    .query(async ({ c, input, ctx }) => {
      try {
        const { orderId } = input;
        
        // Get order with items
        const order = await db.stripeOrder.findFirst({
          where: {
            id: orderId,
            form: {
              userId: ctx.user.id,
            },
          },
          include: {
            items: {
              include: {
                stripeProduct: true,
              },
            },
            form: {
              select: {
                id: true,
                name: true,
              },
            },
            submission: true,
          },
        });
        
        if (!order) {
          throw new HTTPException(404, { message: "Order not found or you do not have permission" });
        }
        
        return c.superjson({ order });
      } catch (error) {
        if (error instanceof HTTPException) throw error;
        console.error("Error fetching order details:", error);
        throw new HTTPException(500, { message: "Failed to fetch order details" });
      }
    }),
}); 