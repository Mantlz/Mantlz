import React from 'react'
import {
  Heading,
  Text,
  Section,

} from '@react-email/components';
import { BrandedEmailTemplate } from './templates/branded-email-template'

interface SubscriptionRecoveredEmailProps {
  plan: string
  nextBillingDate: Date
}

const SubscriptionRecoveredEmail: React.FC<SubscriptionRecoveredEmailProps> = ({ plan, nextBillingDate }) => (
  <BrandedEmailTemplate previewText="Subscription Reactivated">
    <Heading>
      Subscription Reactivated
    </Heading>
    
    <Text>
      Your Mantle subscription has been successfully reactivated!
    </Text>
    
    <Section>
      <Text>
        Your <b>{plan}</b> plan is now active with all features restored.
      </Text>
      
      <Text>
        Next billing date: <b>{nextBillingDate.toLocaleDateString()}</b>
      </Text>
    </Section>
    
    <Text>
      Thank you for your continued support!
    </Text>
  </BrandedEmailTemplate>
)

export default SubscriptionRecoveredEmail