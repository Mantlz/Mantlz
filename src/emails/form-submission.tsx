import React from 'react';
import {
  Heading,
  Text,
  Section,
  Button,
  Hr,
} from '@react-email/components';
import { BrandedEmailTemplate } from './templates/branded-email-template';

interface FormSubmissionEmailProps {
  formName: string;
  submissionData: Record<string, unknown>;
  trackingPixelUrl?: string;
  clickTrackingUrl?: string;
}

export function FormSubmissionEmail({ 
  formName, 
  submissionData,
  trackingPixelUrl,
  clickTrackingUrl,
}: FormSubmissionEmailProps) {
  return (
    <BrandedEmailTemplate 
      previewText={`Your submission to ${formName} has been received`}
      trackingPixelUrl={trackingPixelUrl}
      clickTrackingUrl={clickTrackingUrl}
    >
      <Heading style={{ textAlign: 'center', marginBottom: '24px' }}>
        Form Submission
      </Heading>
      
      <Text style={{ textAlign: 'center', marginBottom: '16px' }}>
        Thank you for submitting <span style={{ fontWeight: '500' }}>{formName}</span>. We&apos;ve received your information.
      </Text>
      
      <Hr style={{ margin: '20px 0' }} />
      
      <Text style={{ 
        textAlign: 'center', 
        marginBottom: '16px',
        fontSize: '16px',
        fontWeight: '500'
      }}>
        Submission details:
      </Text>
      
      <Section style={{ 
        background: '#f8fafc', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0',
        textAlign: 'center' as const
      }}>
        {Object.entries(submissionData).map(([key, value]) => (
          <div key={key} style={{ 
            marginBottom: '12px',
            textAlign: 'center' as const
          }}>
            <Text style={{ 
              fontSize: '14px',
              color: '#666666',
              margin: '0 0 4px 0',
              textTransform: 'capitalize' as const
            }}>
              {key}
            </Text>
            <Text style={{ 
              fontSize: '16px',
              color: '#000000',
              margin: 0
            }}>
              {String(value)}
            </Text>
          </div>
        ))}
      </Section>
      
      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button
          href={clickTrackingUrl ? `${clickTrackingUrl}&url=https://mantlz.app` : "https://mantlz.app"}
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
          Visit Mantlz
        </Button>
      </Section>
    </BrandedEmailTemplate>
  );
} 