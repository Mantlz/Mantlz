import { db } from "@/lib/db"
import { stripe, handleCheckoutSession, handleSubscriptionUpdate } from "@/lib/stripe"
import { headers } from "next/headers"
import Stripe from "stripe"
import { NextResponse } from "next/server"
import { FREE_QUOTA, getQuotaByPlan } from "@/config/usage"
import { Plan } from "@prisma/client"


import { 
  sendPaymentFailureEmail, 
  sendSubscriptionCanceledEmail,
  sendSubscriptionRecoveredEmail 
} from "@/emails/index"

// Define a proper interface for our Stripe Subscription with necessary properties
interface StripeSubscription extends Stripe.Subscription {
  current_period_start: number;
  current_period_end: number;
  customer: string | Stripe.Customer;
}

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
        const subscription = event.data.object as StripeSubscription
        try {
          // Log the raw subscription data for debugging
          console.log(`Processing ${event.type} webhook:`, {
            id: subscription.id,
            status: subscription.status,
            // Access these properties safely
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end,
            customer: typeof subscription.customer === 'string' 
              ? subscription.customer 
              : (subscription.customer as Stripe.Customer)?.id
          })
          
          // Retrieve the subscription with expanded customer and items to get metadata
          const expandedSubscription = await stripe.subscriptions.retrieve(subscription.id, {
            expand: ['customer', 'items.data.price']
          })
          // Safe conversion using two-step assertion
          const typedSubscription = expandedSubscription as unknown as StripeSubscription
          
          // Log the expanded subscription data
          console.log("Expanded subscription data:", {
            id: typedSubscription.id,
            status: typedSubscription.status,
            // Access these properties safely
            current_period_start: typedSubscription.current_period_start,
            current_period_end: typedSubscription.current_period_end,
            customer: typeof typedSubscription.customer === 'string' 
              ? typedSubscription.customer 
              : (typedSubscription.customer as Stripe.Customer)?.id,
            metadata: typedSubscription.metadata
          })
          
          // Check if we have a userId in metadata
          const userId = typedSubscription.metadata?.userId
          if (!userId) {
            console.log(`[DEBUG] No userId in subscription metadata, trying to find user by customer ID`)
            
            // Get the customer ID
            const customerId = typeof typedSubscription.customer === 'string' 
              ? typedSubscription.customer 
              : (typedSubscription.customer as Stripe.Customer)?.id
            
            if (customerId) {
              // Try to find a user with this Stripe customer ID
              const user = await db.user.findFirst({
                where: { stripeCustomerId: customerId },
                select: { id: true }
              })
              
              if (user) {
                console.log(`[DEBUG] Found user with Stripe customer ID:`, user)
                // Add the userId to the metadata for handleSubscriptionUpdate
                typedSubscription.metadata = {
                  ...typedSubscription.metadata,
                  userId: user.id
                }
              } else {
                console.log(`[DEBUG] No user found with Stripe customer ID: ${customerId}`)
                
                // If we have a customer email, try to find the user by email
                const customerEmail = typeof typedSubscription.customer === 'string'
                  ? null
                  : (typedSubscription.customer as Stripe.Customer)?.email
                
                if (customerEmail) {
                  console.log(`[DEBUG] Trying to find user by email: ${customerEmail}`)
                  const userByEmail = await db.user.findUnique({
                    where: { email: customerEmail },
                    select: { id: true }
                  })
                  
                  if (userByEmail) {
                    console.log(`[DEBUG] Found user by email:`, userByEmail)
                    
                    // Update the user's stripeCustomerId
                    await db.user.update({
                      where: { id: userByEmail.id },
                      data: { stripeCustomerId: customerId }
                    })
                    console.log(`[DEBUG] Updated user's stripeCustomerId to: ${customerId}`)
                    
                    // Add the userId to the metadata for handleSubscriptionUpdate
                    typedSubscription.metadata = {
                      ...typedSubscription.metadata,
                      userId: userByEmail.id
                    }
                  } else {
                    console.log(`[DEBUG] No user found with email: ${customerEmail}`)
                  }
                }
              }
            }
          }
          
          await handleSubscriptionUpdate(typedSubscription)
        } catch (error) {
          console.error(`Error processing ${event.type} webhook:`, error)
          // Continue processing other webhooks even if this one fails
        }
        break
      }
      
      case "customer.subscription.deleted": {
        const subscription = event.data.object as StripeSubscription
        try {
          // Log the raw subscription data for debugging
          console.log(`Processing ${event.type} webhook:`, {
            id: subscription.id,
            status: subscription.status,
            // Access these properties safely
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end,
            customer: typeof subscription.customer === 'string' 
              ? subscription.customer 
              : (subscription.customer as Stripe.Customer)?.id
          })
          
          // Retrieve the subscription with expanded customer and items to get metadata
          const expandedSubscription = await stripe.subscriptions.retrieve(subscription.id, {
            expand: ['customer', 'items.data.price']
          })
          // Safe conversion using two-step assertion
          const typedSubscription = expandedSubscription as unknown as StripeSubscription
          
          // Log the expanded subscription data
          console.log("Expanded subscription data:", {
            id: typedSubscription.id,
            status: typedSubscription.status,
            // Access these properties safely
            current_period_start: typedSubscription.current_period_start,
            current_period_end: typedSubscription.current_period_end,
            customer: typeof typedSubscription.customer === 'string' 
              ? typedSubscription.customer 
              : (typedSubscription.customer as Stripe.Customer)?.id,
            metadata: typedSubscription.metadata
          })
          
          // Check if we have a userId in metadata
          const userId = typedSubscription.metadata?.userId
          if (!userId) {
            console.log(`[DEBUG] No userId in subscription metadata, trying to find user by customer ID`)
            
            // Get the customer ID
            const customerId = typeof typedSubscription.customer === 'string' 
              ? typedSubscription.customer 
              : (typedSubscription.customer as Stripe.Customer)?.id
            
            if (customerId) {
              // Try to find a user with this Stripe customer ID
              const user = await db.user.findFirst({
                where: { stripeCustomerId: customerId },
                select: { id: true }
              })
              
              if (user) {
                console.log(`[DEBUG] Found user with Stripe customer ID:`, user)
                // Add the userId to the metadata for handleSubscriptionUpdate
                typedSubscription.metadata = {
                  ...typedSubscription.metadata,
                  userId: user.id
                }
              } else {
                console.log(`[DEBUG] No user found with Stripe customer ID: ${customerId}`)
                
                // If we have a customer email, try to find the user by email
                const customerEmail = typeof typedSubscription.customer === 'string'
                  ? null
                  : (typedSubscription.customer as Stripe.Customer)?.email
                
                if (customerEmail) {
                  console.log(`[DEBUG] Trying to find user by email: ${customerEmail}`)
                  const userByEmail = await db.user.findUnique({
                    where: { email: customerEmail },
                    select: { id: true }
                  })
                  
                  if (userByEmail) {
                    console.log(`[DEBUG] Found user by email:`, userByEmail)
                    
                    // Update the user's stripeCustomerId
                    await db.user.update({
                      where: { id: userByEmail.id },
                      data: { stripeCustomerId: customerId }
                    })
                    console.log(`[DEBUG] Updated user's stripeCustomerId to: ${customerId}`)
                    
                    // Add the userId to the metadata for handleSubscriptionUpdate
                    typedSubscription.metadata = {
                      ...typedSubscription.metadata,
                      userId: userByEmail.id
                    }
                  } else {
                    console.log(`[DEBUG] No user found with email: ${customerEmail}`)
                  }
                }
              }
            }
          }
          
          await handleSubscriptionUpdate(typedSubscription)
        } catch (error) {
          console.error(`Error processing ${event.type} webhook:`, error)
          // Continue processing other webhooks even if this one fails
        }
        break
      }
      
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice & { 
          subscription: string; // Make this required since we only handle subscription payments
          payment_intent?: string;
          customer_email?: string;
          amount_paid: number;
          amount_due?: number;
          created: number;
          currency: string;
          metadata?: {
            userId?: string;
          };
          customer?: string | Stripe.Customer;
        }

        function isValidUserId(id: string | undefined): id is string {
          return typeof id === 'string' && id.length > 0
        }
        
        console.log(`[DEBUG] Processing subscription invoice webhook:`, {
          invoiceId: invoice.id,
          subscriptionId: invoice.subscription,
          amountPaid: invoice.amount_paid,
          amountDue: invoice.amount_due,
          customerEmail: invoice.customer_email,
          metadata: invoice.metadata,
          paymentIntent: invoice.payment_intent,
          customer: typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
        })
        
        try {
          // Get the user ID from metadata or by looking up the customer
          let userId = invoice.metadata?.userId
          
          // If we don't have a user ID from metadata, try to find it from the customer
          if (!isValidUserId(userId) && invoice.customer) {
            const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer.id
            console.log(`[DEBUG] Looking up user ID for customer: ${customerId}`)
            
            // Try to find a user with this Stripe customer ID
            const user = await db.user.findFirst({
              where: { stripeCustomerId: customerId },
              select: { id: true }
            })
            
            if (user) {
              userId = user.id
              console.log(`[DEBUG] Found user with Stripe customer ID:`, user)
            } else {
              console.log(`[DEBUG] No user found with Stripe customer ID: ${customerId}`)
              
              // If we have a customer email, try to find the user by email
              if (invoice.customer_email) {
                console.log(`[DEBUG] Trying to find user by email: ${invoice.customer_email}`)
                const userByEmail = await db.user.findUnique({
                  where: { email: invoice.customer_email },
                  select: { id: true }
                })
                
                if (userByEmail) {
                  userId = userByEmail.id
                  console.log(`[DEBUG] Found user by email:`, userByEmail)
                  
                  // Update the user's stripeCustomerId
                  await db.user.update({
                    where: { id: userId },
                    data: { stripeCustomerId: customerId }
                  })
                  console.log(`[DEBUG] Updated user's stripeCustomerId to: ${customerId}`)
                } else {
                  console.log(`[DEBUG] No user found with email: ${invoice.customer_email}`)
                }
              }
            }
          }
          
          if (!isValidUserId(userId)) {
            console.error(`[ERROR] Could not determine user ID for invoice: ${invoice.id}`)
            break
          }
          
          // Create payment record
          console.log(`[DEBUG] Creating payment record for subscription`)
          
          const stripeId = invoice.payment_intent || invoice.id
          if (!stripeId) {
            console.error(`[ERROR] Missing payment ID for invoice: ${invoice.id}`)
            break
          }

          const payment = await db.payment.create({
            data: {
              stripeId,
              email: invoice.customer_email || 'no-email',
              amount: invoice.amount_paid / 100,
              paymentTime: new Date(invoice.created * 1000),
              currency: invoice.currency,
              clerkId: userId,
              customerDetails: {},
              paymentIntent: invoice.payment_intent || stripeId,
              userId,
            }
          })
          
          console.log(`[DEBUG] Payment record created:`, payment)

          // Create invoice record
          console.log(`[DEBUG] Creating invoice record for subscription`)
          
          // Ensure invoice.id is defined
          if (!invoice.id) {
            console.error(`[ERROR] Missing invoice ID`)
            break
          }
          
          // Get subscription ID from the invoice or use a default value
          const subscriptionId = invoice.subscription || `unknown_${invoice.id}`
          
          const invoiceRecord = await db.invoice.create({
            data: {
              invoiceId: invoice.id as string,
              subscriptionId,
              amountPaid: invoice.amount_paid / 100,
              amountDue: invoice.amount_due ? invoice.amount_due / 100 : invoice.amount_paid / 100,
              currency: invoice.currency,
              status: 'PAID',
              email: invoice.customer_email || 'no-email',
              clerkId: userId,
              userId,
            }
          })
          
          console.log(`[DEBUG] Invoice record created:`, invoiceRecord)

          // Update subscription status
          console.log(`[DEBUG] Updating subscription status`)
          
          // Only update subscription if we have a valid subscription ID
          if (invoice.subscription) {
            try {
              const updatedSubscription = await db.subscription.update({
                where: { subscriptionId: invoice.subscription },
                data: {
                  status: "ACTIVE",
                  updatedAt: new Date()
                }
              })
              
              console.log(`[DEBUG] Subscription updated:`, updatedSubscription)
            } catch (error) {
              console.error(`[ERROR] Failed to update subscription status:`, error)
              // Continue processing even if subscription update fails
            }
          } else {
            console.log(`[DEBUG] No subscription ID found in invoice, skipping subscription update`)
          }
          
          console.log(`[DEBUG] Successfully processed subscription payment for invoice: ${invoice.id}`)
        } catch (error) {
          console.error(`[ERROR] Error processing subscription payment webhook:`, error)
          // Continue processing other webhooks even if this one fails
        }
        break
      }
      
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string }
        const subscriptionId = invoice.subscription
        
        console.log(`[DEBUG] Processing invoice.payment_failed webhook:`, {
          invoiceId: invoice.id,
          subscriptionId
        })
        
        if (subscriptionId) {
          try {
            // Get the subscription to find the user
            const subscription = await db.subscription.findUnique({
              where: { subscriptionId },
              include: { user: true }
            })

            if (subscription) {
              // Count failed attempts
              const failedAttempts = await db.paymentFailure.count({
                where: { subscriptionId }
              })

              if (failedAttempts < 3) { // Allow 3 failed attempts
                // Record the failed attempt
                await db.paymentFailure.create({
                  data: {
                    subscriptionId,
                    invoiceId: invoice.id as string,
                    amount: invoice.amount_due || 0,
                    failureReason: invoice.billing_reason || 'unknown',
                    attemptNumber: failedAttempts + 1
                  }
                })

                // Update subscription status to PAST_DUE but don't downgrade yet
                await db.subscription.update({
                  where: { subscriptionId },
                  data: {
                    status: "PAST_DUE",
                    updatedAt: new Date()
                  }
                })

                // Calculate next attempt date (3 days from now)
                const nextAttemptDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

                // Send email notification
                await sendPaymentFailureEmail({
                  to: subscription.user.email,
                  attemptNumber: failedAttempts + 1,
                  nextAttemptDate,
                  updatePaymentUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`
                })

                console.log(`[DEBUG] Payment failure recorded for user ${subscription.userId}, attempt ${failedAttempts + 1} of 3`)
              } else {
                // After 3 failed attempts, downgrade to free plan
                await db.subscription.update({
                  where: { subscriptionId },
                  data: {
                    status: "CANCELED",
                    updatedAt: new Date()
                  }
                })

                await db.user.update({
                  where: { id: subscription.userId },
                  data: {
                    plan: "FREE",
                    quotaLimit: FREE_QUOTA.maxSubmissionsPerMonth
                  }
                })



                // Send final notification
                await sendSubscriptionCanceledEmail({
                  to: subscription.user.email,
                  currentPlan: subscription.planId,
                  reactivationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`
                })

                console.log(`[DEBUG] User ${subscription.userId} downgraded to FREE plan after 3 failed payment attempts`)
              }
            }
          } catch (error) {
            console.error(`[ERROR] Error processing invoice.payment_failed webhook:`, error)
          }
        }
        break
      }

      case "customer.subscription.resumed": {
        const subscription = event.data.object as StripeSubscription
        
        if (subscription) {
          try {
            // Update subscription status
            await db.subscription.update({
              where: { subscriptionId: subscription.id },
              data: {
                status: "ACTIVE",
                updatedAt: new Date()
              }
            })

            // Get the plan from metadata
            const plan = subscription.metadata?.plan || "FREE"
            const quota = getQuotaByPlan(plan)
            
            // Update user's plan and quota
            await db.user.update({
              where: { id: subscription.metadata?.userId },
              data: {
                plan: plan as Plan,
                quotaLimit: quota.maxSubmissionsPerMonth
              }
            })



            // Mark payment failures as resolved
            await db.paymentFailure.updateMany({
              where: { 
                subscriptionId: subscription.id,
                resolved: false
              },
              data: {
                resolved: true,
                resolvedAt: new Date()
              }
            })

            // Send recovery confirmation email
            if (subscription.metadata?.userEmail) {
              await sendSubscriptionRecoveredEmail({
                to: subscription.metadata.userEmail,
                plan,
                nextBillingDate: new Date(subscription.current_period_end * 1000)
              })
            }

            console.log(`[DEBUG] Subscription ${subscription.id} resumed successfully`)
          } catch (error) {
            console.error(`[ERROR] Error processing subscription.resumed webhook:`, error)
          }
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