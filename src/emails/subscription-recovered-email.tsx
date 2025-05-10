import React from 'react'
import {
  Heading,
  Text,
  Section,
  Hr,
} from '@react-email/components';
import { BrandedEmailTemplate } from './templates/branded-email-template'

interface SubscriptionRecoveredEmailProps {
  plan: string
  nextBillingDate: Date
}

const SubscriptionRecoveredEmail: React.FC<SubscriptionRecoveredEmailProps> = ({ plan, nextBillingDate }) => (
  <BrandedEmailTemplate previewText="Subscription Reactivated">
    <Heading style={{ textAlign: 'center', marginBottom: '24px' }}>
      Subscription Reactivated
    </Heading>
    
    <Text style={{ textAlign: 'center', marginBottom: '16px' }}>
      Your Mantle subscription has been successfully reactivated!
    </Text>
    
    <Section style={{ 
      backgroundColor: '#f8fafc', 
      padding: '20px', 
      borderRadius: '8px',
      margin: '20px 0',
      textAlign: 'center' as const
    }}>
      <Text style={{ marginBottom: '12px' }}>
        Your <b>{plan}</b> plan is now active with all features restored.
      </Text>
      
      <Text style={{ margin: 0 }}>
        Next billing date: <b>{nextBillingDate.toLocaleDateString()}</b>
      </Text>
    </Section>
    
    <Text style={{ textAlign: 'center', marginBottom: '16px' }}>
      Thank you for your continued support!
    </Text>
  </BrandedEmailTemplate>
)

export default SubscriptionRecoveredEmail 