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
    <Heading style={{ textAlign: 'center', marginBottom: '24px' }}>
      Subscription Canceled
    </Heading>
    
    <Text style={{ textAlign: 'center', marginBottom: '16px' }}>
      Your Mantle subscription has been canceled due to failed payment attempts.
    </Text>
    
    <Text style={{ textAlign: 'center', marginBottom: '16px' }}>
      Your account has been downgraded to the free plan with the following limitations:
    </Text>
    
    <Section style={{ 
      backgroundColor: '#f8fafc', 
      padding: '20px', 
      borderRadius: '8px',
      margin: '20px 0',
      textAlign: 'center' as const
    }}>
      <ul style={{ 
        listStyle: 'none', 
        padding: 0, 
        margin: 0,
        display: 'inline-block',
        textAlign: 'left' as const
      }}>
        <li style={{ marginBottom: '8px' }}>1 form</li>
        <li style={{ marginBottom: '8px' }}>200 submissions per month</li>
        <li style={{ marginBottom: '8px' }}>Basic form analytics</li>
        <li style={{ marginBottom: '8px' }}>Form validation</li>
        <li style={{ marginBottom: '8px' }}>Standard support</li>
      </ul>
    </Section>
    
    <Text style={{ textAlign: 'center', marginBottom: '16px' }}>
      To reactivate your <b>{currentPlan}</b> plan:
    </Text>
    
    <Section style={{ textAlign: 'center', margin: '32px 0' }}>
      <Button
        href={reactivationUrl}
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
        Reactivate Subscription
      </Button>
    </Section>
    
    <Text style={{ textAlign: 'center', marginBottom: '16px' }}>
      If you need assistance, please contact our support team.
    </Text>
  </BrandedEmailTemplate>
)

export default SubscriptionCanceledEmail 