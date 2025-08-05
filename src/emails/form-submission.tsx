import React from 'react';
import {
  Heading,
  Text,
  Section,
  Button,
  Hr,
} from '@react-email/components';
import { BrandedEmailTemplate } from './templates/branded-email-template';
import { FormType } from '@prisma/client';

interface FormSubmissionEmailProps {
  formName: string;
  submissionData: Record<string, unknown>;
  formType?: FormType;
  trackingPixelUrl?: string;
  clickTrackingUrl?: string;
}

export function FormSubmissionEmail({ 
  formName, 
  submissionData,
  formType = FormType.CUSTOM,
  trackingPixelUrl,
  clickTrackingUrl,
}: FormSubmissionEmailProps) {
  // Get form type specific heading and message
  const { heading, message } = getFormTypeSpecificContent(formType, formName);

  return (
    <BrandedEmailTemplate 
      previewText={`Your submission to ${formName} has been received`}
      trackingPixelUrl={trackingPixelUrl}
      clickTrackingUrl={clickTrackingUrl}
    >
      <Heading>
        {heading}
      </Heading>
      
      <Text>
        {message}
      </Text>
      
      <Hr />
      
      <Text>
        Submission Details
      </Text>
      
      <Section>
        {Object.entries(submissionData)
          // Filter out internal fields that start with underscore
          .filter(([key]) => !key.startsWith('_'))
          .map(([key, value]) => (
            <div key={key}>
              <Text style={{ textTransform: 'capitalize' as const }}>
                <strong>{key}:</strong> {String(value)}
              </Text>
            </div>
          ))}
      </Section>
      
      {formType === FormType.ORDER && (
        <Text>
          Thank you for your order! We&apos;re processing it now.
        </Text>
      )}
      
      {formType === FormType.RSVP && (
        <Text>
          Your RSVP has been confirmed. We look forward to seeing you!
        </Text>
      )}
      
      <Button href={clickTrackingUrl ? `${clickTrackingUrl}&url=https://mantlz.com` : "https://mantlz.com"}>
        Visit Mantlz
      </Button>
    </BrandedEmailTemplate>
  );
}

// Helper function to get form type specific content
function getFormTypeSpecificContent(formType: FormType, formName: string) {
  switch (formType) {
    case FormType.SURVEY:
      return {
        heading: 'Survey Response Received',
        message: `Thank you for completing the "${formName}" survey. Your feedback is valuable to us.`
      };
      
    case FormType.FEEDBACK:
      return {
        heading: 'Feedback Received',
        message: `Thank you for sharing your feedback with us. We've received your submission for "${formName}".`
      };
      
    case FormType.ORDER:
      return {
        heading: 'Order Confirmation',
        message: `Thank you for your order. We've received your order for "${formName}" and will process it shortly.`
      };
      
    case FormType.RSVP:
      return {
        heading: 'RSVP Confirmation',
        message: `Thank you for your RSVP to "${formName}". We've recorded your response.`
      };
      
    case FormType.WAITLIST:
      return {
        heading: 'Waitlist Confirmation',
        message: `You've been added to the "${formName}" waitlist. We'll notify you when a spot becomes available.`
      };
      
    case FormType.APPLICATION:
      return {
        heading: 'Application Received',
        message: `Your application for "${formName}" has been received. We'll review it and get back to you.`
      };
      
    case FormType.ANALYTICS_OPT_IN:
      return {
        heading: 'Preferences Saved',
        message: `Your privacy preferences for "${formName}" have been saved. Thank you for your cooperation.`
      };
      
    case FormType.CONTACT:
      return {
        heading: 'Contact Form Submission',
        message: `Thank you for contacting us through "${formName}". We'll respond to your inquiry soon.`
      };
      
    default:
      return {
        heading: 'Form Submission',
        message: `Thank you for submitting "${formName}". We've received your information.`
      };
  }
}