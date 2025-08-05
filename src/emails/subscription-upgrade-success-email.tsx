import React from 'react'
import {
  Heading,
  Text,
  Section,
  Button,

} from '@react-email/components';
import { BrandedEmailTemplate } from './templates/branded-email-template'

interface SubscriptionUpgradeSuccessEmailProps {
  plan: string
  nextBillingDate: Date
  features: string[]
}

const SubscriptionUpgradeSuccessEmail: React.FC<SubscriptionUpgradeSuccessEmailProps> = ({ 
  plan, 
  nextBillingDate,
  features 
}) => (
  <BrandedEmailTemplate previewText="Subscription Successfully Upgraded">
    <Heading>
      Subscription Upgraded Successfully!
    </Heading>
    
    <Text>
      Thank you for upgrading your Mantle subscription to the <b>{plan}</b> plan.
    </Text>
    
    <Section>
      <Text>
        <strong>Your New Plan Includes:</strong>
      </Text>
      
      {features.map((feature, index) => (
        <Text key={index}>
          ✓ {feature}
        </Text>
      ))}
    </Section>

    <Text>
      Next billing date: <b>{nextBillingDate.toLocaleDateString()}</b>
    </Text>
    
    <Text>
      You can manage your subscription settings at any time from your dashboard.
    </Text>
    
    <Button href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>
      Go to Dashboard
    </Button>

    <Text>
      If you have any questions, our support team is here to help!
    </Text>
  </BrandedEmailTemplate>
)

export default SubscriptionUpgradeSuccessEmail