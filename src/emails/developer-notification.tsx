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
  submissionId: string;
}

export function DeveloperNotificationEmail({ 
  formName, 
  submissionData,
  formId,
  submissionId,
}: DeveloperNotificationEmailProps) {
  return (
    <BrandedEmailTemplate previewText={`New submission to ${formName}`}>
      <Heading>New Form Submission</Heading>
      
      <Text>
        You have received a new submission to <strong>{formName}</strong>.
      </Text>
      
      <Hr />
      
      <Text>Submission details:</Text>
      
      <Section>
        {Object.entries(submissionData).map(([key, value]) => (
          <div key={key}>
            <Text><strong>{key}</strong>: {String(value)}</Text>
          </div>
        ))}
      </Section>
      
      <Section>
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/forms/${formId}/submissions/${submissionId}`}
        >
          View Submission
        </Button>
      </Section>
    </BrandedEmailTemplate>
  );
}

const styles = {
  // Use your existing styles from FormSubmissionEmail
  // ...
}; 