import {
  Heading,
  Link,
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
    <BrandedEmailTemplate previewText={previewText}>
      <Heading>⚠️ Monthly Quota Reset Warning</Heading>
      
      <Text>
        Hi {userName},
      </Text>
      
      <Text>
        Your monthly quota will reset in <strong>{daysUntilReset} days</strong>. 
        Here's your current usage summary:
      </Text>

      <Section>
        <Text><strong>Current Usage ({plan} Plan)</strong></Text>
        <Text>
          📊 Submissions: <strong>{currentSubmissions.toLocaleString()} / {maxSubmissions.toLocaleString()}</strong> ({usagePercentage}% used)
        </Text>
        <Text>
          📈 Remaining: <strong>{remainingSubmissions.toLocaleString()} submissions</strong>
        </Text>
      </Section>

      <Section>
        <Text><strong>🚨 Important: Auto-Delete Notice</strong></Text>
        <Text>
          When your quota resets, your submission count will return to 0, but your existing 
          submission data will remain. However, if you have any submissions you want to 
          export or backup, we recommend doing so before the reset.
        </Text>
      </Section>

      <Section>
        <Text><strong>Recommended Actions:</strong></Text>
        <Text>• Export your form submissions if needed</Text>
        <Text>• Review your current month's data</Text>
        <Text>• Consider upgrading if you need more submissions</Text>
      </Section>

      <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>
        View Dashboard
      </Link>

      <Text>
        Questions? Reply to this email or contact our support team.
      </Text>
      
      <Text>
        Best regards,<br />
        The Mantlz Team
      </Text>
    </BrandedEmailTemplate>
  );
}