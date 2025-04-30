import React from 'react';
import {
  Heading,
  Text,
  Section,
  Button,
  Hr,
} from '@react-email/components';
import { BrandedEmailTemplate } from './templates/branded-email-template';

interface WelcomeEmailProps {
  userName: string;
}

export function WelcomeEmail({ userName }: WelcomeEmailProps) {
  return (
    <BrandedEmailTemplate previewText="Welcome to Mantlz!">
      <Heading>Welcome to Mantlz, {userName}! 🎉</Heading>
      
      <Section>
        <Text>
          We&apos;re thrilled to have you join the Mantlz community. You&apos;re now part of a growing ecosystem of developers building amazing things.
        </Text>
        
        <Text>
          To help you get started, we&apos;ve prepared comprehensive documentation that covers everything from basic setup to advanced features.
        </Text>
        
        <Button
          href="https://doc.mantlz.app"
          style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '4px',
            textDecoration: 'none',
            display: 'inline-block',
            margin: '20px 0',
          }}
        >
          View Documentation
        </Button>
        
        <Text>
          If you have any questions or need assistance, don&apos;t hesitate to reach out to our support team.
        </Text>
      </Section>
      
      <Hr style={{ margin: '20px 0' }} />
      
      <Text style={{ fontSize: '12px', color: '#666666' }}>
        This email was sent to you as part of your Mantlz account. If you did not sign up for Mantlz, please ignore this email.
      </Text>
    </BrandedEmailTemplate>
  );
} 