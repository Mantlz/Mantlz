import React from 'react'
import { BrandedEmailTemplate } from './templates/branded-email-template'

interface PaymentFailureEmailProps {
  attemptNumber: number
  nextAttemptDate: Date
  updatePaymentUrl: string
}

const PaymentFailureEmail: React.FC<PaymentFailureEmailProps> = ({ attemptNumber, nextAttemptDate, updatePaymentUrl }) => (
  <BrandedEmailTemplate previewText={`Payment Failed - Attempt ${attemptNumber} of 3`}>
    <h1 style={{ margin: 0, fontSize: 22 }}>Payment Failed</h1>
    <p>We were unable to process your payment for your Mantle subscription.</p>
    <p>This is attempt {attemptNumber} of 3 before your subscription is downgraded to the free plan.</p>
    <p>Next payment attempt: <b>{nextAttemptDate.toLocaleDateString()}</b></p>
    <p>Please update your payment method to avoid service interruption:</p>
    <a href={updatePaymentUrl} style={{
      display: 'inline-block',
      padding: '12px 24px',
      backgroundColor: '#000',
      color: '#fff',
      textDecoration: 'none',
      borderRadius: 6,
      margin: '16px 0',
    }}>Update Payment Method</a>
    <p>If you need assistance, please contact our support team.</p>
  </BrandedEmailTemplate>
)

export default PaymentFailureEmail 