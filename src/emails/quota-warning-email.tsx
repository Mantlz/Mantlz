import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { BrandedEmailTemplate } from './templates/branded-email-template';

interface QuotaWarningEmailProps {
  userName: string;
  userEmail: string;
  currentSubmissions: number;
  maxSubmissions: number;
  plan: string;
  daysUntilReset: number;
}

export function QuotaWarningEmail({
  userName,
  userEmail,
  currentSubmissions,
  maxSubmissions,
  plan,
  daysUntilReset
}: QuotaWarningEmailProps) {
  const usagePercentage = Math.round((currentSubmissions / maxSubmissions) * 100);
  const remainingSubmissions = maxSubmissions - currentSubmissions;
  const previewText = `Your monthly quota resets in ${daysUntilReset} days - Export your data now!`;

  return (
    <Html>
      <Head />
      <Preview>
        {previewText}
      </Preview>
      <Body style={main}>
        <BrandedEmailTemplate previewText={previewText}>
          <Container style={container}>
            <Heading style={h1}>⚠️ Monthly Quota Reset Warning</Heading>
            
            <Text style={text}>
              Hi {userName},
            </Text>
            
            <Text style={text}>
              Your monthly quota will reset in <strong>{daysUntilReset} days</strong>. 
              Here's your current usage summary:
            </Text>

            <Section style={usageSection}>
              <Text style={usageTitle}>Current Usage ({plan} Plan)</Text>
              <Text style={usageStats}>
                📊 Submissions: <strong>{currentSubmissions.toLocaleString()} / {maxSubmissions.toLocaleString()}</strong> ({usagePercentage}% used)
              </Text>
              <Text style={usageStats}>
                📈 Remaining: <strong>{remainingSubmissions.toLocaleString()} submissions</strong>
              </Text>
            </Section>

            <Section style={warningSection}>
              <Text style={warningTitle}>🚨 Important: Auto-Delete Notice</Text>
              <Text style={warningText}>
                When your quota resets, your submission count will return to 0, but your existing 
                submission data will remain. However, if you have any submissions you want to 
                export or backup, we recommend doing so before the reset.
              </Text>
            </Section>

            <Section style={actionSection}>
              <Text style={actionTitle}>Recommended Actions:</Text>
              <Text style={actionItem}>• Export your form submissions if needed</Text>
              <Text style={actionItem}>• Review your current month's data</Text>
              <Text style={actionItem}>• Consider upgrading if you need more submissions</Text>
            </Section>

            <Section style={buttonSection}>
              <Link
                style={button}
                href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
              >
                View Dashboard
              </Link>
            </Section>

            <Text style={footerText}>
              Questions? Reply to this email or contact our support team.
            </Text>
            
            <Text style={footerText}>
              Best regards,<br />
              The Mantlz Team
            </Text>
          </Container>
        </BrandedEmailTemplate>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const usageSection = {
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const usageTitle = {
  color: '#495057',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const usageStats = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const warningSection = {
  backgroundColor: '#fff3cd',
  border: '1px solid #ffeaa7',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const warningTitle = {
  color: '#856404',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const warningText = {
  color: '#856404',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
};

const actionSection = {
  margin: '24px 0',
};

const actionTitle = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const actionItem = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '4px 0',
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#007cba',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const footerText = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '16px 0',
};