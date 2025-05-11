import { PaymentEmailService } from "@/services/payment-email-service"

export const sendPaymentFailureEmail = PaymentEmailService.sendPaymentFailureEmail
export const sendSubscriptionCanceledEmail = PaymentEmailService.sendSubscriptionCanceledEmail
export const sendSubscriptionRecoveredEmail = PaymentEmailService.sendSubscriptionRecoveredEmail 