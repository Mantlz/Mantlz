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
  submissionData: Record<string, any>;
  formId: string;
  _submissionId: string;
}

export function DeveloperNotificationEmail({ 
  formName, 
  submissionData,
  formId,
  _submissionId,
}: DeveloperNotificationEmailProps) {
  const submissionTime = new Date().toLocaleString();
  // Get a preview of important fields without showing all details
  const hasEmail = 'email' in submissionData;
  const totalFields = Object.keys(submissionData).length;
  
  return (
    <BrandedEmailTemplate previewText={`🎯 New submission waiting for your review on ${formName}`}>
      <Heading>New Submission Alert!</Heading>
      
      <Text style={{ fontSize: '16px', color: '#666666' }}>
        Your form <strong>{formName}</strong> just received a new submission at {submissionTime}.
      </Text>
      
      <Hr style={{ margin: '20px 0' }} />
      
      <Section style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px' }}>
        <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
          Quick Overview:
        </Text>
        
        <Text style={{ color: '#666666' }}>
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
        background: '#4f46e5',
        padding: '24px',
        borderRadius: '8px'
      }}>
        <Text style={{ color: 'white', marginBottom: '15px' }}>
          View the complete submission details in your secure dashboard
        </Text>
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/form/${formId}`}
          style={{
            background: 'white',
            color: '#4f46e5',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Review Submission Now →
        </Button>
      </Section>
      
      <Text style={{ 
        fontSize: '14px', 
        color: '#6b7280', 
        marginTop: '20px',
        textAlign: 'center',
        fontStyle: 'italic' 
      }}>
        Quick access: Simply click the button above to review all submission details
      </Text>
    </BrandedEmailTemplate>
  );
}

