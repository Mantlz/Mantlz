import { db } from "@/lib/db"
import { stripe, handleCheckoutSession, handleSubscriptionUpdate } from "@/lib/stripe"
import { headers } from "next/headers"
import Stripe from "stripe"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature ?? "",
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error(`Webhook signature verification failed: ${errorMessage}`)
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 })
  }

  console.log(`Processing webhook: ${event.type}`)

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSession(session)
        break
      }
      
      case "customer.subscription.created": 
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        // Retrieve the subscription with expanded customer and items to get metadata
        const expandedSubscription = await stripe.subscriptions.retrieve(subscription.id, {
          expand: ['customer', 'items.data.price']
        })
        await handleSubscriptionUpdate(expandedSubscription as any)
        break
      }
      
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        // Retrieve the subscription with expanded customer and items to get metadata
        const expandedSubscription = await stripe.subscriptions.retrieve(subscription.id, {
          expand: ['customer', 'items.data.price']
        })
        await handleSubscriptionUpdate(expandedSubscription as any)
        break
      }
      
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice & { 
          subscription?: string;
          payment_intent?: string;
          customer_email?: string;
          amount_paid: number;
          amount_due?: number;
          created: number;
          currency: string;
          metadata?: {
            userId?: string;
          };
        }
        const subscriptionId = invoice.subscription
        
        if (subscriptionId) {
          // Create payment record
          await db.payment.create({
            data: {
              stripeId: invoice.payment_intent || '',
              email: invoice.customer_email || '',
              amount: invoice.amount_paid / 100, // Convert from cents to dollars
              paymentTime: new Date(invoice.created * 1000),
              currency: invoice.currency,
              clerkId: invoice.metadata?.userId || '',
              customerDetails: {},
              paymentIntent: invoice.payment_intent || '',
              userId: invoice.metadata?.userId || '',
            }
          })

          // Create invoice record
          await db.invoice.create({
            data: {
              invoiceId: invoice.id || '',
              subscriptionId: subscriptionId,
              amountPaid: invoice.amount_paid / 100,
              amountDue: invoice.amount_due ? invoice.amount_due / 100 : null,
              currency: invoice.currency,
              status: 'PAID',
              email: invoice.customer_email || '',
              clerkId: invoice.metadata?.userId || '',
              userId: invoice.metadata?.userId || '',
            }
          })

          // Update subscription status
          await db.subscription.update({
            where: { subscriptionId },
            data: {
              status: "ACTIVE",
              updatedAt: new Date()
            }
          })
        }
        break
      }
      
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string }
        const subscriptionId = invoice.subscription
        
        if (subscriptionId) {
          await db.subscription.update({
            where: { subscriptionId },
            data: {
              status: "PAST_DUE",
              updatedAt: new Date()
            }
          })
        }
        break
      }
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    )
  }
}