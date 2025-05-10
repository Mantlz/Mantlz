import React from 'react';
import {
  Heading,
  Text,
  Section,
  Button,
  Hr,
  Link,
} from '@react-email/components';
import { BrandedEmailTemplate } from './templates/branded-email-template';

interface CampaignEmailProps {
  subject: string;
  previewText: string;
  content: string;
  ctaText?: string;
  ctaUrl?: string;
  trackingPixelUrl?: string;
  clickTrackingUrl?: string;
}

export function CampaignEmail({
  subject,
  previewText,
  content,
  ctaText,
  ctaUrl,
  trackingPixelUrl,
  clickTrackingUrl,
}: CampaignEmailProps) {
  return (
    <BrandedEmailTemplate
      previewText={previewText}
      trackingPixelUrl={trackingPixelUrl}
      clickTrackingUrl={clickTrackingUrl}
    >
      <Heading style={styles.heading}>{subject}</Heading>
      
      <Text style={styles.content}>
        {content}
      </Text>
      
      {ctaText && ctaUrl && (
        <Section style={styles.ctaSection}>
          <Button
            href={ctaUrl}
            style={styles.button}
          >
            {ctaText}
          </Button>
        </Section>
      )}
      
      <Hr style={styles.divider} />
      
      <Text style={styles.footer}>
        If you have any questions, feel free to{' '}
        <Link 
          href={clickTrackingUrl ? `${clickTrackingUrl}&url=mailto:contact@mantlz.app` : "mailto:contact@mantlz.app"}
          style={styles.link}
        >
          contact us
        </Link>
        .
      </Text>
    </BrandedEmailTemplate>
  );
}

const styles = {
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#000000',
    margin: '0 0 24px',
    textAlign: 'center' as const,
  },
  content: {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#333333',
    margin: '0 0 30px',
    textAlign: 'center' as const,
  },
  ctaSection: {
    textAlign: 'center' as const,
    margin: '32px 0',
  },
  button: {
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '4px',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    fontWeight: '500',
  },
  divider: {
    borderTop: '1px solid #eaeaea',
    margin: '32px 0',
  },
  footer: {
    fontSize: '14px',
    color: '#666666',
    margin: '0',
    textAlign: 'center' as const,
  },
  link: {
    color: '#000000',
    textDecoration: 'none',
    borderBottom: '1px solid #dddddd',
  },
}; 