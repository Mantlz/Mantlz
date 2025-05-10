import React from 'react';
import {
  Heading,
  Text,
  Section,
  Button,
  Hr,
} from '@react-email/components';
import { BrandedEmailTemplate } from './templates/branded-email-template';

interface DeveloperNotificationEmailProps {
  formName: string;
  submissionData: Record<string, unknown>;
  formId: string;
  trackingPixelUrl?: string;
  clickTrackingUrl?: string;
}

export function DeveloperNotificationEmail({ 
  formName, 
  submissionData,
  formId,
  trackingPixelUrl,
  clickTrackingUrl,
}: DeveloperNotificationEmailProps) {
  const submissionTime = new Date().toLocaleString();
  // Get a preview of important fields without showing all details
  const hasEmail = 'email' in submissionData;
  const totalFields = Object.keys(submissionData).length;
  
  return (
    <BrandedEmailTemplate 
      previewText={`🎯 New submission waiting for your review on ${formName}`}
      trackingPixelUrl={trackingPixelUrl}
      clickTrackingUrl={clickTrackingUrl}
    >
      <Heading style={{ textAlign: 'center', marginBottom: '24px' }}>
        New Submission Alert!
      </Heading>
      
      <Text style={{ textAlign: 'center', marginBottom: '16px' }}>
        Your form <strong>{formName}</strong> just received a new submission at {submissionTime}.
      </Text>
      
      <Hr style={{ margin: '20px 0' }} />
      
      <Section style={{ 
        background: '#f8fafc', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0',
        textAlign: 'center' as const
      }}>
        <Text style={{ 
          fontSize: '16px', 
          fontWeight: '500',
          marginBottom: '12px'
        }}>
          Quick Overview:
        </Text>
        
        <Text style={{ 
          color: '#666666',
          textAlign: 'center' as const
        }}>
          • Contains {totalFields} field{totalFields !== 1 ? 's' : ''} of information
          {hasEmail && ' (including email contact)'}
          <br />
          • Submitted just moments ago
          <br />
          • Waiting for your review in the dashboard
        </Text>
      </Section>
      
      <Section style={{ 
        marginTop: '20px', 
        textAlign: 'center',
        background: '#f8fafc',
        padding: '24px',
        borderRadius: '8px'
      }}>
        <Text style={{ 
          color: '#000000', 
          marginBottom: '15px',
          textAlign: 'center' as const
        }}>
          View the complete submission details in your secure dashboard
        </Text>
        <Button
          href={clickTrackingUrl ? `${clickTrackingUrl}&url=${process.env.NEXT_PUBLIC_APP_URL}/dashboard/form/${formId}` : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/form/${formId}`}
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
          Review Submission Now →
        </Button>
      </Section>
      
      <Text style={{ 
        fontSize: '14px', 
        color: '#666666', 
        marginTop: '20px',
        textAlign: 'center',
        fontStyle: 'italic' 
      }}>
        Quick access: Simply click the button above to review all submission details
      </Text>
    </BrandedEmailTemplate>
  );
}

