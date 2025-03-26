import React from 'react';
import {
  Heading,
  Text,
  Section,
  Button,
  Hr,
} from '@react-email/components';
import { BrandedEmailTemplate } from './templates/branded-email-template';

interface FormSubmissionEmailProps {
  formName: string;
  submissionData: Record<string, any>;
}

export function FormSubmissionEmail({ formName, submissionData }: FormSubmissionEmailProps) {
  return (
    <BrandedEmailTemplate previewText={`Your submission to ${formName} has been received`}>
      <Heading style={styles.heading}>Form Submission</Heading>
      
      <Text style={styles.paragraph}>
        Thank you for submitting <span style={styles.highlight}>{formName}</span>. We've received your information.
      </Text>
      
      <Hr style={styles.divider} />
      
      <Text style={styles.subheading}>Submission details:</Text>
      
      <Section style={styles.detailsSection}>
        {Object.entries(submissionData).map(([key, value]) => (
          <div key={key} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{key}</Text>
            <Text style={styles.detailValue}>{String(value)}</Text>
          </div>
        ))}
      </Section>
      
      <Section style={styles.ctaContainer}>
        <Button
          href="https://mantlz.app"
          style={styles.button}
        >
          Visit Mantlz
        </Button>
      </Section>
    </BrandedEmailTemplate>
  );
}

const styles = {
  heading: {
    fontFamily: '"IBM Plex Mono", monospace',
    fontSize: '21px',
    fontWeight: '600',
    color: '#000000',
    marginTop: '10px',
    marginBottom: '25px',
    textAlign: 'center' as const,
    letterSpacing: '0.5px',
  },
  subheading: {
    fontFamily: '"IBM Plex Mono", monospace',
    fontSize: '14px',
    fontWeight: '500',
    color: '#000000',
    margin: '20px 0 15px',
  },
  paragraph: {
    fontSize: '15px',
    lineHeight: '1.5',
    color: '#333333',
    margin: '0 0 25px',
  },
  highlight: {
    fontFamily: '"IBM Plex Mono", monospace',
    fontWeight: '500',
  },
  divider: {
    borderTop: '1px dashed #e0e0e0',
    margin: '20px 0',
  },
  detailsSection: {
    margin: '15px 0 30px',
  },
  detailRow: {
    marginBottom: '12px',
  },
  detailLabel: {
    fontFamily: '"IBM Plex Mono", monospace',
    fontSize: '13px',
    fontWeight: '500',
    color: '#555555',
    textTransform: 'lowercase' as const,
    margin: '0 0 2px',
  },
  detailValue: {
    fontSize: '14px',
    color: '#333333',
    margin: '0',
    paddingLeft: '10px',
    borderLeft: '2px solid #eaeaea',
  },
  ctaContainer: {
    marginTop: '30px',
    textAlign: 'center' as const,
  },
  button: {
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0',
    fontSize: '13px',
    fontFamily: '"IBM Plex Mono", monospace',
    fontWeight: '500',
    textDecoration: 'none',
    textAlign: 'center' as const,
    padding: '10px 20px',
    letterSpacing: '0.5px',
  },
}; 