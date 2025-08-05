import {
  Heading,
  Link,
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
    <BrandedEmailTemplate previewText={previewText}>
      <Heading>🔄 Monthly Quota Reset Complete</Heading>
      
      <Text>
        Hi {userName},
      </Text>
      
      <Text>
        Your monthly quota has been successfully reset! Here's a summary of your previous month's activity:
      </Text>

      <Section>
        <Text><strong>Previous Month Summary ({plan} Plan)</strong></Text>
        <Text>
          📊 Total Submissions: <strong>{currentSubmissions.toLocaleString()}</strong> ({usagePercentage}% of {maxSubmissions.toLocaleString()})
        </Text>
        <Text>
          📝 Active Forms: <strong>{formsCount}</strong>
        </Text>
        <Text>
          📧 Campaigns Sent: <strong>{campaignsCount}</strong>
        </Text>
      </Section>

      <Section>
        <Text><strong>✨ Fresh Start</strong></Text>
        <Text>
          Your submission count has been reset to 0, giving you a fresh start for this month. 
          All your forms, campaigns, and settings remain intact and ready to use.
        </Text>
      </Section>

      <Section>
        <Text><strong>Ready to Continue:</strong></Text>
        <Text>• Your forms are active and ready to collect submissions</Text>
        <Text>• Create new campaigns to engage your audience</Text>
        <Text>• Monitor your usage in the dashboard</Text>
      </Section>

      <Link href={`https://${process.env.NEXT_PUBLIC_APP_DOMAIN || 'mantlz.com'}/dashboard`}>
        Go to Dashboard
      </Link>

      <Text>
        Need help? Reply to this email or visit our support center.
      </Text>

      <Text>
        Best regards,<br />
        The Mantlz Team
      </Text>
    </BrandedEmailTemplate>
  );
}

// Styles