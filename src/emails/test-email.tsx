import React from 'react';
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
        <div style={styles.previewSection}>
          <h2 style={styles.subheading}>Campaign Preview</h2>
          <div style={styles.previewDetails}>
            <p style={styles.label}>Campaign Name:</p>
            <p style={styles.value}>{campaignName || 'Untitled Campaign'}</p>
            
            <p style={styles.label}>Subject Line:</p>
            <p style={styles.value}>{subject || 'No subject'}</p>
          </div>

          <div style={styles.contentPreview}>
            <p style={styles.label}>Email Content:</p>
            <div style={styles.contentBox} dangerouslySetInnerHTML={{ __html: content || 'No content' }} />
          </div>
        </div>

        <p style={styles.disclaimer}>
          This is a test email. You&apos;re receiving this because you&apos;re testing your campaign setup.
          All tracking features are enabled for verification purposes.
        </p>

    </BrandedEmailTemplate>
  );
}

const styles = {
  content: {
    padding: '20px 0',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: '20px',
    textAlign: 'center' as const,
  },
  subheading: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '15px',
  },
  testInfo: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  infoText: {
    fontSize: '14px',
    color: '#2d3748',
    margin: '8px 0',
  },
  previewSection: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '30px',
  },
  previewDetails: {
    marginBottom: '20px',
  },
  label: {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '4px',
    fontWeight: 'bold' as const,
  },
  value: {
    fontSize: '16px',
    color: '#2d3748',
    marginBottom: '15px',
  },
  contentPreview: {
    marginTop: '20px',
  },
  contentBox: {
    backgroundColor: '#f7fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '15px',
    fontSize: '14px',
    color: '#4a5568',
    minHeight: '100px',
  },
  disclaimer: {
    fontSize: '12px',
    color: '#718096',
    textAlign: 'center' as const,
    marginTop: '30px',
    fontStyle: 'italic' as const,
  },
}; 