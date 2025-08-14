import React from 'react'
import {
  Heading,
  Text,
  Section,
  Button,

} from '@react-email/components';
import { BrandedEmailTemplate } from './templates/branded-email-template'

interface PaymentFailureEmailProps {
  attemptNumber: number
  nextAttemptDate: Date
  updatePaymentUrl: string
}

const PaymentFailureEmail: React.FC<PaymentFailureEmailProps> = ({ attemptNumber, nextAttemptDate, updatePaymentUrl }) => (
  <BrandedEmailTemplate previewText={`Payment Failed - Attempt ${attemptNumber} of 3`}>
    <Heading>
      Payment Failed
    </Heading>
    
    <Text>
      We were unable to process your payment for your Mantlz subscription.
    </Text>
    
    <Section>
      <Text>
        This is attempt {attemptNumber} of 3 before your subscription is downgraded to the free plan.
      </Text>
      
      <Text>
        Next payment attempt: <b>{nextAttemptDate.toLocaleDateString()}</b>
      </Text>
    </Section>
    
    <Text>
      Please update your payment method to avoid service interruption:
    </Text>
    
    <Button href={updatePaymentUrl}>
      Update Payment Method
    </Button>
    
    <Text>
      If you need assistance, please contact our support team.
    </Text>
  </BrandedEmailTemplate>
)

export default PaymentFailureEmail