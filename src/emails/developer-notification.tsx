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
      <Heading>
        New Submission Alert!
      </Heading>
      
      <Text>
        Your form <strong>{formName}</strong> just received a new submission at {submissionTime}.
      </Text>
      
      <Hr />
      
      <Section>
        <Text>
          <strong>Quick Overview:</strong>
        </Text>
        
        <Text>
          • Contains {totalFields} field{totalFields !== 1 ? 's' : ''} of information
          {hasEmail && ' (including email contact)'}
          <br />
          • Submitted just moments ago
          <br />
          • Waiting for your review in the dashboard
        </Text>
      </Section>
      
      <Text>
        View the complete submission details in your secure dashboard
      </Text>
      
      <Button href={clickTrackingUrl ? `${clickTrackingUrl}&url=${process.env.NEXT_PUBLIC_APP_URL}/dashboard/form/${formId}` : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/form/${formId}`}>
        Review Submission Now →
      </Button>
      
      <Text>
        Quick access: Simply click the button above to review all submission details
      </Text>
    </BrandedEmailTemplate>
  );
}

