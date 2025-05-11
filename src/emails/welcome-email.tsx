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
      <Heading style={{ textAlign: 'center', marginBottom: '24px' }}>
        Welcome to Mantlz, {userName}! 🎉
      </Heading>
      
      <Section>
        <Text style={{ textAlign: 'center', marginBottom: '16px' }}>
          We&apos;re thrilled to have you join the Mantlz community. You&apos;re now part of a growing ecosystem of developers building amazing things.
        </Text>
        
        <Text style={{ textAlign: 'center', marginBottom: '24px' }}>
          To help you get started, we&apos;ve prepared comprehensive documentation that covers everything from basic setup to advanced features.
        </Text>
        
        <Section style={{ textAlign: 'center', margin: '32px 0' }}>
          <Button
            href="https://doc.mantlz.app"
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
            View Documentation
          </Button>
        </Section>
        
        <Text style={{ textAlign: 'center', marginBottom: '16px' }}>
          If you have any questions or need assistance, don&apos;t hesitate to reach out to our support team.
        </Text>
      </Section>
      
      <Hr style={{ margin: '32px 0' }} />
      
      <Text style={{ 
        fontSize: '12px', 
        color: '#666666',
        textAlign: 'center',
        margin: '0 auto',
        maxWidth: '400px'
      }}>
        This email was sent to you as part of your Mantlz account. If you did not sign up for Mantlz, please ignore this email.
      </Text>
    </BrandedEmailTemplate>
  );
} 