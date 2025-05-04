import React from 'react';
import { BrandedEmailTemplate } from './templates/branded-email-template';

interface TestEmailProps {
  trackingPixelUrl?: string;
  clickTrackingUrl?: string;
}

export function TestEmail({ trackingPixelUrl, clickTrackingUrl }: TestEmailProps) {
  return (
    <BrandedEmailTemplate
      previewText="Test Email from Mantlz"
      trackingPixelUrl={trackingPixelUrl}
      clickTrackingUrl={clickTrackingUrl}
    >
      <div style={styles.content}>
        <h1 style={styles.heading}>Test Email</h1>
        <p style={styles.paragraph}>
          This is a test email from your campaign. If you're seeing this, your email configuration is working correctly!
        </p>
        <div style={styles.testInfo}>
          <p style={styles.infoText}>✓ Email delivery system: Working</p>
          <p style={styles.infoText}>✓ Email template: Rendering properly</p>
          <p style={styles.infoText}>✓ Tracking pixels: Configured</p>
        </div>
      </div>
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
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#333333',
    marginBottom: '30px',
  },
  testInfo: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px',
  },
  infoText: {
    fontSize: '14px',
    color: '#2d3748',
    margin: '8px 0',
  },
}; 