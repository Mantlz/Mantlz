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
      <Heading>{subject}</Heading>
      
      <Text>
        {content}
      </Text>
      
      {ctaText && ctaUrl && (
        <Button href={ctaUrl}>
          {ctaText}
        </Button>
      )}
      
      <Hr />
      
      <Text>
        If you have any questions, feel free to{' '}
        <Link href={clickTrackingUrl ? `${clickTrackingUrl}&url=mailto:contact@mantlz.com` : "mailto:contact@mantlz.com"}>
          contact us
        </Link>
        .
      </Text>
    </BrandedEmailTemplate>
  );
}