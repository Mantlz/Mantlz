import React from 'react'
import {
  Heading,
  Text,
  Section,
  Button,
} from '@react-email/components';
import { BrandedEmailTemplate } from './templates/branded-email-template'

interface SubscriptionCanceledEmailProps {
  currentPlan: string
  reactivationUrl: string
}

const SubscriptionCanceledEmail: React.FC<SubscriptionCanceledEmailProps> = ({ currentPlan, reactivationUrl }) => (
  <BrandedEmailTemplate previewText="Your Subscription Has Been Canceled">
    <Heading>
      Subscription Canceled
    </Heading>
    
    <Text>
      Your Mantlz subscription has been canceled due to failed payment attempts.
    </Text>
    
    <Text>
      Your account has been downgraded to the free plan with the following limitations:
    </Text>
    
    <Section>
      <Text>• 1 form</Text>
      <Text>• 200 submissions per month</Text>
      <Text>• Basic form analytics</Text>
      <Text>• Form validation</Text>
      <Text>• Standard support</Text>
    </Section>
    
    <Text>
      To reactivate your <b>{currentPlan}</b> plan:
    </Text>
    
    <Button href={reactivationUrl}>
      Reactivate Subscription
    </Button>
    
    <Text>
      If you need assistance, please contact our support team.
    </Text>
  </BrandedEmailTemplate>
)

export default SubscriptionCanceledEmail