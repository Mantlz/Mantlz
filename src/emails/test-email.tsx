import React from 'react';
import {
  Heading,
  Text,
  Section,
} from '@react-email/components';
import { BrandedEmailTemplate } from './templates/branded-email-template';

interface TestEmailProps {
  trackingPixelUrl?: string;
  clickTrackingUrl?: string;
  unsubscribeUrl?: string;
  campaignName?: string;
  subject?: string;
  content?: string;
}

export function TestEmail({
  trackingPixelUrl,
  clickTrackingUrl,
  unsubscribeUrl,
  campaignName,
  subject,
  content
}: TestEmailProps) {
  return (
    <BrandedEmailTemplate
      previewText={`Test Email - ${campaignName || 'Campaign Preview'}`}
      trackingPixelUrl={trackingPixelUrl}
      clickTrackingUrl={clickTrackingUrl}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Heading style={{ textAlign: 'center', marginBottom: '24px' }}>
        Campaign Preview
      </Heading>

      <Section style={{ 
        background: '#f8fafc', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0',
        textAlign: 'center' as const
      }}>
        <Text style={{ 
          fontSize: '14px',
          color: '#666666',
          margin: '0 0 4px 0',
          fontWeight: '500'
        }}>
          Campaign Name:
        </Text>
        <Text style={{ 
          fontSize: '16px',
          color: '#000000',
          margin: '0 0 16px 0'
        }}>
          {campaignName || 'Untitled Campaign'}
        </Text>
        
        <Text style={{ 
          fontSize: '14px',
          color: '#666666',
          margin: '0 0 4px 0',
          fontWeight: '500'
        }}>
          Subject Line:
        </Text>
        <Text style={{ 
          fontSize: '16px',
          color: '#000000',
          margin: '0 0 16px 0'
        }}>
          {subject || 'No subject'}
        </Text>
      </Section>

      <Section style={{ 
        background: '#f8fafc', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0',
        textAlign: 'center' as const
      }}>
        <Text style={{ 
          fontSize: '14px',
          color: '#666666',
          margin: '0 0 12px 0',
          fontWeight: '500'
        }}>
          Email Content:
        </Text>
        <div style={{ 
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          padding: '15px',
          fontSize: '14px',
          color: '#4a5568',
          minHeight: '100px',
          textAlign: 'left' as const
        }} 
        dangerouslySetInnerHTML={{ __html: content || 'No content' }} 
        />
      </Section>

      <Text style={{ 
        fontSize: '12px',
        color: '#666666',
        textAlign: 'center',
        marginTop: '30px',
        fontStyle: 'italic'
      }}>
        This is a test email. You&apos;re receiving this because you&apos;re testing your campaign setup.
        All tracking features are enabled for verification purposes.
      </Text>
    </BrandedEmailTemplate>
  );
} 