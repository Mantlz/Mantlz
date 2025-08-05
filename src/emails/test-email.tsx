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
      <Heading>
        Campaign Preview
      </Heading>

      <Section>
        <Text>
          <strong>Campaign Name:</strong> {campaignName || 'Untitled Campaign'}
        </Text>
        
        <Text>
          <strong>Subject Line:</strong> {subject || 'No subject'}
        </Text>
      </Section>

      <Section>
        <Text>
          <strong>Email Content:</strong>
        </Text>
        <div dangerouslySetInnerHTML={{ __html: content || 'No content' }} />
      </Section>

      <Text>
        This is a test email. You're receiving this because you're testing your campaign setup.
        All tracking features are enabled for verification purposes.
      </Text>
    </BrandedEmailTemplate>
  );
}