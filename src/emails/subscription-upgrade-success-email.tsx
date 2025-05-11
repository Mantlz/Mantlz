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
    <Heading style={{ textAlign: 'center', marginBottom: '24px' }}>
      Subscription Upgraded Successfully!
    </Heading>
    
    <Text style={{ textAlign: 'center', marginBottom: '24px' }}>
      Thank you for upgrading your Mantle subscription to the <b>{plan}</b> plan.
    </Text>
    
    <Section style={{ 
      backgroundColor: '#f8fafc', 
      padding: '20px', 
      borderRadius: '8px',
      margin: '20px 0',
      textAlign: 'center' as const
    }}>
      <Text style={{ 
        margin: '0 0 15px 0', 
        fontSize: '18px',
        fontWeight: '500'
      }}>
        Your New Plan Includes:
      </Text>
      
      <ul style={{ 
        margin: 0, 
        padding: 0, 
        listStyle: 'none',
        display: 'inline-block',
        textAlign: 'left' as const
      }}>
        {features.map((feature, index) => (
          <li key={index} style={{ 
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: '#22c55e' }}
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </Section>

    <Text style={{ textAlign: 'center', marginBottom: '16px' }}>
      Next billing date: <b>{nextBillingDate.toLocaleDateString()}</b>
    </Text>
    
    <Text style={{ textAlign: 'center', marginBottom: '24px' }}>
      You can manage your subscription settings at any time from your dashboard.
    </Text>
    
    <Section style={{ textAlign: 'center', margin: '32px 0' }}>
      <Button
        href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
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
        Go to Dashboard
      </Button>
    </Section>

    <Text style={{ textAlign: 'center', marginBottom: '16px' }}>
      If you have any questions, our support team is here to help!
    </Text>
  </BrandedEmailTemplate>
)

export default SubscriptionUpgradeSuccessEmail 