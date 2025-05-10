import React from 'react'
import {
  Heading,
  Text,
  Section,
  Button,
  Hr,
} from '@react-email/components';
import { BrandedEmailTemplate } from './templates/branded-email-template'

interface PaymentFailureEmailProps {
  attemptNumber: number
  nextAttemptDate: Date
  updatePaymentUrl: string
}

const PaymentFailureEmail: React.FC<PaymentFailureEmailProps> = ({ attemptNumber, nextAttemptDate, updatePaymentUrl }) => (
  <BrandedEmailTemplate previewText={`Payment Failed - Attempt ${attemptNumber} of 3`}>
    <Heading style={{ textAlign: 'center', marginBottom: '24px' }}>
      Payment Failed
    </Heading>
    
    <Text style={{ textAlign: 'center', marginBottom: '16px' }}>
      We were unable to process your payment for your Mantle subscription.
    </Text>
    
    <Section style={{ 
      background: '#f8fafc', 
      padding: '20px', 
      borderRadius: '8px',
      margin: '20px 0',
      textAlign: 'center' as const
    }}>
      <Text style={{ marginBottom: '12px' }}>
        This is attempt {attemptNumber} of 3 before your subscription is downgraded to the free plan.
      </Text>
      
      <Text style={{ margin: 0 }}>
        Next payment attempt: <b>{nextAttemptDate.toLocaleDateString()}</b>
      </Text>
    </Section>
    
    <Text style={{ textAlign: 'center', marginBottom: '16px' }}>
      Please update your payment method to avoid service interruption:
    </Text>
    
    <Section style={{ textAlign: 'center', margin: '32px 0' }}>
      <Button
        href={updatePaymentUrl}
        style={{
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '4px',
          textDecoration: 'none',
          display: 'inline-block',
          fontSize: '16px',
          fontWeight: '500',
        }}
      >
        Update Payment Method
      </Button>
    </Section>
    
    <Text style={{ textAlign: 'center', marginBottom: '16px' }}>
      If you need assistance, please contact our support team.
    </Text>
  </BrandedEmailTemplate>
)

export default PaymentFailureEmail 