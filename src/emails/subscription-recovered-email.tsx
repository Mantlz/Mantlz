import React from 'react'
import { BrandedEmailTemplate } from './templates/branded-email-template'

interface SubscriptionRecoveredEmailProps {
  plan: string
  nextBillingDate: Date
}

const SubscriptionRecoveredEmail: React.FC<SubscriptionRecoveredEmailProps> = ({ plan, nextBillingDate }) => (
  <BrandedEmailTemplate previewText="Subscription Reactivated">
    <h1 style={{ margin: 0, fontSize: 22 }}>Subscription Reactivated</h1>
    <p>Your Mantle subscription has been successfully reactivated!</p>
    <p>Your <b>{plan}</b> plan is now active with all features restored.</p>
    <p>Next billing date: <b>{nextBillingDate.toLocaleDateString()}</b></p>
    <p>Thank you for your continued support!</p>
  </BrandedEmailTemplate>
)

export default SubscriptionRecoveredEmail 