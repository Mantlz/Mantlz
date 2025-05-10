import React from 'react'
import { BrandedEmailTemplate } from './templates/branded-email-template'

interface SubscriptionCanceledEmailProps {
  currentPlan: string
  reactivationUrl: string
}

const SubscriptionCanceledEmail: React.FC<SubscriptionCanceledEmailProps> = ({ currentPlan, reactivationUrl }) => (
  <BrandedEmailTemplate previewText="Your Subscription Has Been Canceled">
    <h1 style={{ margin: 0, fontSize: 22 }}>Subscription Canceled</h1>
    <p>Your Mantle subscription has been canceled due to failed payment attempts.</p>
    <p>Your account has been downgraded to the free plan with the following limitations:</p>
    <ul>
      <li>1 form</li>
      <li>200 submissions per month</li>
      <li>Basic form analytics</li>
      <li>Form validation</li>
      <li>Standard support</li>
    </ul>
    <p>To reactivate your <b>{currentPlan}</b> plan:</p>
    <a href={reactivationUrl} style={{
      display: 'inline-block',
      padding: '12px 24px',
      backgroundColor: '#000',
      color: '#fff',
      textDecoration: 'none',
      borderRadius: 6,
      margin: '16px 0',
    }}>Reactivate Subscription</a>
    <p>If you need assistance, please contact our support team.</p>
  </BrandedEmailTemplate>
)

export default SubscriptionCanceledEmail 