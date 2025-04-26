import React from 'react';
import {
  Heading,
  Text,
  Section,
  Button,
  Hr,
} from '@react-email/components';
import { BrandedEmailTemplate } from './templates/branded-email-template';

interface CampaignEmailProps {
  subject: string;
  content: string;
  formName: string;
  submissionData: Record<string, unknown>;
  campaignId: string;
  unsubscribeUrl?: string;
}

export function CampaignEmail({ 
  subject,
  content,
  formName,
  submissionData,
  campaignId,
  unsubscribeUrl 
}: CampaignEmailProps) {
  // Replace personalization tokens in content
  // Format: {{fieldName}}
  const personalizedContent = content.replace(
    /\{\{([^}]+)\}\}/g,
    (match, field) => {
      const value = submissionData[field.trim()];
      return value !== undefined ? String(value) : match;
    }
  );

  return (
    <BrandedEmailTemplate previewText={subject}>
      <div dangerouslySetInnerHTML={{ __html: personalizedContent }} />
      
      <Hr style={styles.divider} />
      
      <Section style={styles.footer}>
        <Text style={styles.footerText}>
          You received this email because you signed up for {formName}.
        </Text>
        {unsubscribeUrl && (
          <Text style={styles.footerText}>
            <a href={unsubscribeUrl} style={styles.unsubscribeLink}>Unsubscribe</a>
          </Text>
        )}
      </Section>
    </BrandedEmailTemplate>
  );
}

const styles = {
  divider: {
    borderTop: '1px dashed #e0e0e0',
    margin: '30px 0 20px',
  },
  footer: {
    textAlign: 'center' as const,
  },
  footerText: {
    fontSize: '12px',
    color: '#8898aa',
    margin: '5px 0',
  },
  unsubscribeLink: {
    color: '#8898aa',
    textDecoration: 'underline',
  },
}; 