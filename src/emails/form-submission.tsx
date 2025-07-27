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
      <Heading style={{ textAlign: 'center', marginBottom: '24px' }}>
        {heading}
      </Heading>
      
      <Text style={{ textAlign: 'center', marginBottom: '16px' }}>
        {message}
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
        {Object.entries(submissionData)
          // Filter out internal fields that start with underscore
          .filter(([key]) => !key.startsWith('_'))
          .map(([key, value]) => (
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
      
      {/* Form type-specific extra content */}
      {formType === FormType.ORDER && (
        <Section style={{ 
          textAlign: 'center', 
          margin: '20px 0',
          padding: '15px', 
          borderRadius: '8px',
          backgroundColor: '#f0f9ff' 
        }}>
          <Text style={{ 
            fontSize: '15px',
            fontWeight: '500',
            color: '#0369a1'
          }}>
            Thank you for your order! We&apos;re processing it now.
          </Text>
        </Section>
      )}
      
      {formType === FormType.RSVP && (
        <Section style={{ 
          textAlign: 'center', 
          margin: '20px 0',
          padding: '15px', 
          borderRadius: '8px',
          backgroundColor: '#f0f9ff' 
        }}>
          <Text style={{ 
            fontSize: '15px',
            fontWeight: '500',
            color: '#0369a1'
          }}>
            Your RSVP has been confirmed. We look forward to seeing you!
          </Text>
        </Section>
      )}
      
      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button
          href={clickTrackingUrl ? `${clickTrackingUrl}&url=https://mantlz.com` : "https://mantlz.com"}
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