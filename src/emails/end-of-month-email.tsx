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

interface EndOfMonthEmailProps {
  userName: string;
  userEmail: string;
  currentSubmissions: number;
  maxSubmissions: number;
  plan: string;
  formsCount: number;
  campaignsCount: number;
}

export function EndOfMonthEmail({
  userName,
  userEmail,
  currentSubmissions,
  maxSubmissions,
  plan,
  formsCount,
  campaignsCount
}: EndOfMonthEmailProps) {
  const usagePercentage = Math.round((currentSubmissions / maxSubmissions) * 100);
  const previewText = `Your monthly quota has been reset - Here's your summary!`;

  return (
    <Html>
      <Head />
      <Preview>
        {previewText}
      </Preview>
      <Body style={main}>
        <BrandedEmailTemplate previewText={previewText}>
          <Container style={container}>
            <Heading style={h1}>🔄 Monthly Quota Reset Complete</Heading>
            
            <Text style={text}>
              Hi {userName},
            </Text>
            
            <Text style={text}>
              Your monthly quota has been successfully reset! Here's a summary of your previous month's activity:
            </Text>

            <Section style={summarySection}>
              <Text style={summaryTitle}>Previous Month Summary ({plan} Plan)</Text>
              <Text style={summaryStats}>
                📊 Total Submissions: <strong>{currentSubmissions.toLocaleString()}</strong> ({usagePercentage}% of {maxSubmissions.toLocaleString()})
              </Text>
              <Text style={summaryStats}>
                📝 Active Forms: <strong>{formsCount}</strong>
              </Text>
              <Text style={summaryStats}>
                📧 Campaigns Sent: <strong>{campaignsCount}</strong>
              </Text>
            </Section>

            <Section style={resetSection}>
              <Text style={resetTitle}>✨ Fresh Start</Text>
              <Text style={resetText}>
                Your submission count has been reset to 0, giving you a fresh start for this month. 
                All your forms, campaigns, and settings remain intact and ready to use.
              </Text>
            </Section>

            <Section style={actionSection}>
              <Text style={actionTitle}>Ready to Continue:</Text>
              <Text style={actionItem}>• Your forms are active and ready to collect submissions</Text>
              <Text style={actionItem}>• Create new campaigns to engage your audience</Text>
              <Text style={actionItem}>• Monitor your usage in the dashboard</Text>
            </Section>

            <Section style={linkSection}>
              <Link
                href={`https://${process.env.NEXT_PUBLIC_APP_DOMAIN || 'mantlz.app'}/dashboard`}
                style={button}
              >
                Go to Dashboard
              </Link>
            </Section>

            <Text style={footer}>
              Need help? Reply to this email or visit our support center.
            </Text>

            <Text style={signature}>
              Best regards,<br />
              The Mantlz Team
            </Text>
          </Container>
        </BrandedEmailTemplate>
      </Body>
    </Html>
  );
}

// Styles
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

const summarySection = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  border: '1px solid #e9ecef',
};

const summaryTitle = {
  color: '#495057',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const summaryStats = {
  color: '#495057',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const resetSection = {
  backgroundColor: '#e8f5e8',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  border: '1px solid #c3e6c3',
};

const resetTitle = {
  color: '#2d5a2d',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const resetText = {
  color: '#2d5a2d',
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
  color: '#555',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '4px 0',
};

const linkSection = {
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

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '32px 0 16px 0',
  textAlign: 'center' as const,
};

const signature = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

export default EndOfMonthEmail;