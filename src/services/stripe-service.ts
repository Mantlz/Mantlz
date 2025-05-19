import { db } from "@/lib/db";
import Stripe from "stripe";
import { Plan, StripeOrderStatus } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

// Initialize Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
});

export class StripeService {
  /**
   * Generate a Stripe OAuth link for connecting a user's Stripe account
   */
  static async generateConnectOAuthLink(userId: string, redirectUrl?: string) {
    // Check if user is on PRO plan
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { plan: true }
    });

    if (!user || user.plan !== Plan.PRO) {
      throw new HTTPException(403, { message: "Stripe connection is only available for PRO users" });
    }

    // Generate state parameter for security
    const state = Buffer.from(JSON.stringify({ userId })).toString('base64');
    
    // Create OAuth link
    const link = stripe.oauth.authorizeUrl({
      client_id: process.env.STRIPE_CLIENT_ID || "",
      state,
      suggested_capabilities: ['transfers', 'card_payments'],
      redirect_uri: redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/oauth/callback`,
      scope: 'read_write',
    });

    return { link };
  }

  /**
   * Handle the OAuth callback from Stripe
   */
  static async handleOAuthCallback(code: string, state: string) {
    try {
      // Decode state to get user ID
      const { userId } = JSON.parse(Buffer.from(state, 'base64').toString());
      
      if (!userId) {
        throw new HTTPException(400, { message: "Invalid state parameter" });
      }

      // Exchange authorization code for access token
      const response = await stripe.oauth.token({
        grant_type: 'authorization_code',
        code,
      });

      // Store the connection in the database
      const stripeConnection = await db.stripeConnection.upsert({
        where: {
          userId,
        },
        create: {
          userId,
          stripeAccountId: response.stripe_user_id!,
          accessToken: response.access_token!,
          refreshToken: response.refresh_token!,
          scope: response.scope,
          tokenType: response.token_type,
          expiresAt: response.expires_at ? new Date(response.expires_at * 1000) : undefined,
          isActive: true,
          lastRefreshedAt: new Date(),
        },
        update: {
          stripeAccountId: response.stripe_user_id!,
          accessToken: response.access_token!,
          refreshToken: response.refresh_token!,
          scope: response.scope,
          tokenType: response.token_type,
          expiresAt: response.expires_at ? new Date(response.expires_at * 1000) : undefined,
          isActive: true,
          lastRefreshedAt: new Date(),
        },
      });

      return stripeConnection;
    } catch (error) {
      console.error("Error handling Stripe OAuth callback:", error);
      throw new HTTPException(500, { message: "Failed to connect Stripe account" });
    }
  }

  /**
   * Get the connected Stripe account details for a user
   */
  static async getStripeConnection(userId: string) {
    const connection = await db.stripeConnection.findUnique({
      where: { userId, isActive: true },
    });
    
    return connection;
  }

  /**
   * Disconnect a user's Stripe account
   */
  static async disconnectStripeAccount(userId: string) {
    try {
      const connection = await db.stripeConnection.findUnique({
        where: { userId },
      });

      if (!connection) {
        throw new HTTPException(404, { message: "Stripe connection not found" });
      }

      // Deauthorize the connected account
      await stripe.oauth.deauthorize({
        client_id: process.env.STRIPE_CLIENT_ID || "",
        stripe_user_id: connection.stripeAccountId,
      });

      // Update the database record
      await db.stripeConnection.update({
        where: { id: connection.id },
        data: { isActive: false },
      });

      return { success: true };
    } catch (error) {
      console.error("Error disconnecting Stripe account:", error);
      throw new HTTPException(500, { message: "Failed to disconnect Stripe account" });
    }
  }

  /**
   * Fetch products from user's connected Stripe account
   */
  static async fetchStripeProducts(userId: string) {
    try {
      const connection = await db.stripeConnection.findUnique({
        where: { userId, isActive: true },
      });

      if (!connection) {
        throw new HTTPException(404, { message: "Active Stripe connection not found" });
      }

      // Create connected account Stripe instance
      const connectedStripe = new Stripe(connection.accessToken, {
        apiVersion: "2023-10-16",
      });

      // Fetch products with associated prices
      const productsResponse = await connectedStripe.products.list({
        active: true,
        expand: ['data.default_price'],
        limit: 100,
      });

      // Process and store products in the database
      const products = await Promise.all(
        productsResponse.data.map(async (product) => {
          // Skip products without prices
          if (!product.default_price) return null;

          // Get price details
          const price = typeof product.default_price === 'string'
            ? await connectedStripe.prices.retrieve(product.default_price)
            : product.default_price;

          // Skip if price is not valid
          if (!price || price.unit_amount === null) return null;

          // Upsert the product in the database
          return db.stripeProduct.upsert({
            where: {
              stripeConnectionId_stripeProductId_stripePriceId: {
                stripeConnectionId: connection.id,
                stripeProductId: product.id,
                stripePriceId: price.id,
              },
            },
            create: {
              stripeConnectionId: connection.id,
              stripeProductId: product.id,
              stripePriceId: price.id,
              name: product.name,
              description: product.description || null,
              price: price.unit_amount / 100,
              currency: price.currency,
              image: product.images?.length ? product.images[0] : null,
              active: product.active,
              metadata: product.metadata || {},
            },
            update: {
              name: product.name,
              description: product.description || null,
              price: price.unit_amount / 100,
              currency: price.currency,
              image: product.images?.length ? product.images[0] : null,
              active: product.active,
              metadata: product.metadata || {},
            },
          });
        })
      );

      // Filter out null products
      const validProducts = products.filter(Boolean);

      return validProducts;
    } catch (error) {
      console.error("Error fetching Stripe products:", error);
      throw new HTTPException(500, { message: "Failed to fetch Stripe products" });
    }
  }

  /**
   * Create a checkout session for a Stripe order
   */
  static async createCheckoutSession(
    formId: string,
    userId: string,
    productItems: Array<{ productId: string; quantity: number }>,
    customerEmail?: string,
    successUrl?: string,
    cancelUrl?: string
  ) {
    try {
      // Check if user is on PRO plan
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { plan: true }
      });

      if (!user || user.plan !== Plan.PRO) {
        throw new HTTPException(403, { message: "Stripe checkout is only available for PRO users" });
      }

      // Verify form ownership
      const form = await db.form.findFirst({
        where: { id: formId, userId },
      });

      if (!form) {
        throw new HTTPException(404, { message: "Form not found or you do not have permission" });
      }

      // Get Stripe connection
      const connection = await db.stripeConnection.findUnique({
        where: { userId, isActive: true },
      });

      if (!connection) {
        throw new HTTPException(404, { message: "Active Stripe connection not found" });
      }

      // Fetch products from database
      const dbProducts = await db.stripeProduct.findMany({
        where: {
          id: { in: productItems.map(item => item.productId) },
          stripeConnectionId: connection.id,
        },
      });

      if (dbProducts.length !== productItems.length) {
        throw new HTTPException(400, { message: "One or more products not found" });
      }

      // Calculate order total
      let totalAmount = 0;
      const currency = dbProducts[0]?.currency || 'usd';

      // Create connected account Stripe instance
      const connectedStripe = new Stripe(connection.accessToken, {
        apiVersion: "2023-10-16",
      });

      // Create line items for checkout
      const lineItems = productItems.map(item => {
        const product = dbProducts.find(p => p.id === item.productId);
        
        if (!product) {
          throw new HTTPException(400, { message: `Product not found: ${item.productId}` });
        }
        
        // Add to total
        totalAmount += Number(product.price) * item.quantity;
        
        return {
          price: product.stripePriceId,
          quantity: item.quantity,
        };
      });

      // Create checkout session
      const session = await connectedStripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/form/${formId}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/form/${formId}/cancel`,
        customer_email: customerEmail,
        metadata: {
          formId,
          userId,
        },
      });

      // Create order record
      const order = await db.stripeOrder.create({
        data: {
          formId,
          stripeConnectionId: connection.id,
          stripeCheckoutSessionId: session.id,
          status: StripeOrderStatus.PENDING,
          amount: totalAmount,
          currency,
          customerEmail,
          items: {
            createMany: {
              data: productItems.map(item => {
                const product = dbProducts.find(p => p.id === item.productId);
                if (!product) throw new Error(`Product not found: ${item.productId}`);
                
                return {
                  stripeProductId: product.id,
                  quantity: item.quantity,
                  price: product.price,
                  currency: product.currency,
                };
              }),
            },
          },
        },
      });

      return {
        checkoutUrl: session.url,
        sessionId: session.id,
        orderId: order.id,
      };
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw new HTTPException(500, { message: "Failed to create checkout session" });
    }
  }

  /**
   * Handle webhook events from Stripe
   */
  static async handleWebhook(payload: any, signature: string) {
    try {
      // Verify the webhook signature
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );

      // Process different event types
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          
          // Update the order status in the database
          if (session.metadata?.formId) {
            await db.stripeOrder.updateMany({
              where: {
                stripeCheckoutSessionId: session.id,
                formId: session.metadata.formId,
              },
              data: {
                status: StripeOrderStatus.COMPLETED,
                stripePaymentIntentId: session.payment_intent as string,
                updatedAt: new Date(),
              },
            });
          }
          break;
        }
        
        case 'checkout.session.expired': {
          const session = event.data.object as Stripe.Checkout.Session;
          
          // Update the order status in the database
          if (session.metadata?.formId) {
            await db.stripeOrder.updateMany({
              where: {
                stripeCheckoutSessionId: session.id,
                formId: session.metadata.formId,
              },
              data: {
                status: StripeOrderStatus.FAILED,
                updatedAt: new Date(),
              },
            });
          }
          break;
        }

        // Add more event handlers as needed
      }

      return { received: true };
    } catch (error) {
      console.error("Error handling Stripe webhook:", error);
      throw new HTTPException(400, { message: "Webhook Error" });
    }
  }
} 