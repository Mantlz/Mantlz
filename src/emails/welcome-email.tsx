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
      <Heading>
        Welcome to Mantlz, {userName}! 🎉
      </Heading>
      
      <Text>
        We're thrilled to have you join the Mantlz community. You're now part of a growing ecosystem of developers building amazing things.
      </Text>
      
      <Text>
        To help you get started, we've prepared comprehensive documentation that covers everything from basic setup to advanced features.
      </Text>
      
      <Button href="https://doc.mantlz.com">
        View Documentation
      </Button>
      
      <Text>
        If you have any questions or need assistance, don't hesitate to reach out to our support team.
      </Text>
      
      <Hr />
      
      <Text>
        This email was sent to you as part of your Mantlz account. If you did not sign up for Mantlz, please ignore this email.
      </Text>
    </BrandedEmailTemplate>
  );
}