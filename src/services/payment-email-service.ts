import { sendEmail } from './email-service'
import { render } from '@react-email/render'
import PaymentFailureEmail from '@/emails/payment-failure-email'
import SubscriptionCanceledEmail from '@/emails/subscription-canceled-email'
import SubscriptionRecoveredEmail from '@/emails/subscription-recovered-email'
import SubscriptionUpgradeSuccessEmail from '@/emails/subscription-upgrade-success-email'
import { JSX } from 'react'

export class PaymentEmailService {
  static async sendPaymentFailureEmail({
    to,
    attemptNumber,
    nextAttemptDate,
    updatePaymentUrl
  }: {
    to: string
    attemptNumber: number
    nextAttemptDate: Date
    updatePaymentUrl: string
  }) {
    const emailComponent = PaymentFailureEmail({
      attemptNumber,
      nextAttemptDate,
      updatePaymentUrl
    }) as JSX.Element

    const emailHtml = await render(emailComponent)

    await sendEmail({
      to,
      subject: `Payment Failed - Attempt ${attemptNumber} of 3`,
      html: emailHtml
    })
  }

  static async sendSubscriptionCanceledEmail({
    to,
    currentPlan,
    reactivationUrl
  }: {
    to: string
    currentPlan: string
    reactivationUrl: string
  }) {
    const emailComponent = SubscriptionCanceledEmail({
      currentPlan,
      reactivationUrl
    }) as JSX.Element

    const emailHtml = await render(emailComponent)

    await sendEmail({
      to,
      subject: 'Your Subscription Has Been Canceled',
      html: emailHtml
    })
  }

  static async sendSubscriptionRecoveredEmail({
    to,
    plan,
    nextBillingDate
  }: {
    to: string
    plan: string
    nextBillingDate: Date
  }) {
    const emailComponent = SubscriptionRecoveredEmail({
      plan,
      nextBillingDate
    }) as JSX.Element

    const emailHtml = await render(emailComponent)

    await sendEmail({
      to,
      subject: 'Subscription Reactivated',
      html: emailHtml
    })
  }

  static async sendSubscriptionUpgradeSuccessEmail({
    to,
    plan,
    nextBillingDate,
    features
  }: {
    to: string
    plan: string
    nextBillingDate: Date
    features: string[]
  }) {
    const emailComponent = SubscriptionUpgradeSuccessEmail({
      plan,
      nextBillingDate,
      features
    }) as JSX.Element

    const emailHtml = await render(emailComponent)

    await sendEmail({
      to,
      subject: 'Subscription Successfully Upgraded',
      html: emailHtml
    })
  }
} 