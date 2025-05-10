import React from 'react'
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
    <h1 style={{ margin: 0, fontSize: 22 }}>Subscription Upgraded Successfully!</h1>
    <p>Thank you for upgrading your Mantle subscription to the <b>{plan}</b> plan.</p>
    
    <div style={{ 
      backgroundColor: '#f8fafc', 
      padding: '20px', 
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <h2 style={{ margin: '0 0 15px 0', fontSize: 18 }}>Your New Plan Includes:</h2>
      <ul style={{ 
        margin: 0, 
        padding: 0, 
        listStyle: 'none'
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
    </div>

    <p>Next billing date: <b>{nextBillingDate.toLocaleDateString()}</b></p>
    
    <p>You can manage your subscription settings at any time from your dashboard.</p>
    
    <a href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`} style={{
      display: 'inline-block',
      padding: '12px 24px',
      backgroundColor: '#000',
      color: '#fff',
      textDecoration: 'none',
      borderRadius: 6,
      margin: '16px 0',
    }}>Go to Dashboard</a>

    <p>If you have any questions, our support team is here to help!</p>
  </BrandedEmailTemplate>
)

export default SubscriptionUpgradeSuccessEmail 