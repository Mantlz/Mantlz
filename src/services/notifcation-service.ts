import { db } from "@/lib/db";
import { Resend } from 'resend';
import { render } from '@react-email/components';
import { DeveloperNotificationEmail } from '@/emails/developer-notification';
import { SlackService, FormFieldValue } from './slack-service';
import { DiscordService } from './discord-service';

// Define interfaces for type safety
interface SubmissionData {
  [key: string]: FormFieldValue;
}

interface NotificationCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
  value: string;
}

// Don't initialize Resend yet - we'll do it with the user's key

export async function sendDiscordNotification(
  formId: string,
  submissionId: string,
  submissionData: SubmissionData
) {
  console.log('🔍 Starting Discord notification process:', { formId, submissionId });
  
  // Get form with user and Discord settings
  const form = await db.form.findUnique({
    where: { id: formId },
    include: {
      user: {
        include: {
          discordConfig: true
        }
      }
    }
  });

  if (!form || !form.user.discordConfig?.enabled || !form.user.discordConfig?.webhookUrl) {
    const reason = !form ? 'form-not-found' :
                  !form.user.discordConfig?.enabled ? 'discord-disabled' :
                  'missing-webhook-url';
    console.log('❌ Discord notification skipped:', { reason });
    return { sent: false, reason };
  }

  try {
    const discordService = DiscordService.getInstance();
    await discordService.sendNotification(
      {
        webhookUrl: form.user.discordConfig.webhookUrl,
        channel: form.user.discordConfig.channel || undefined
      },
      {
        formId,
        formName: form.name,
        submissionId,
        submissionData,
        timestamp: new Date()
      }
    );

    console.log('✅ Discord notification sent');
    return { sent: true };
  } catch (error) {
    console.error('❌ Failed to send Discord notification:', error);
    return { sent: false, reason: 'error', error };
  }
}

export async function sendSlackNotification(
  formId: string,
  submissionId: string,
  submissionData: SubmissionData
) {
  console.log('🔍 Starting Slack notification process:', { formId, submissionId });
  
  // Get form with user and Slack settings
  const form = await db.form.findUnique({
    where: { id: formId },
    include: {
      user: {
        include: {
          slackConfig: true
        }
      }
    }
  });

  if (!form || !form.user.slackConfig?.enabled || !form.user.slackConfig?.webhookUrl) {
    const reason = !form ? 'form-not-found' :
                  !form.user.slackConfig?.enabled ? 'slack-disabled' :
                  'missing-webhook-url';
    console.log('❌ Slack notification skipped:', { reason });
    return { sent: false, reason };
  }

  try {
    const slackService = SlackService.getInstance();
    await slackService.sendNotification(
      {
        webhookUrl: form.user.slackConfig.webhookUrl,
        channel: form.user.slackConfig.channel || undefined
      },
      {
        formId,
        formName: form.name,
        submissionId,
        submissionData,
        timestamp: new Date()
      }
    );

    console.log('✅ Slack notification sent');
    return { sent: true };
  } catch (error) {
    console.error('❌ Failed to send Slack notification:', error);
    return { sent: false, reason: 'error', error };
  }
}

export async function sendDeveloperNotification(
  formId: string,
  submissionId: string,
  submissionData: SubmissionData
) {
  console.log('🔍 Starting developer notification process:', { formId, submissionId });
  
  // Get form and email settings with user information
  const form = await db.form.findUnique({
    where: { id: formId },
    include: {
      user: { select: { email: true, plan: true, resendApiKey: true } },
      emailSettings: true,
    }
  });

  console.log('📋 Form and settings:', { 
    formExists: !!form,
    emailSettings: form?.emailSettings,
    developerNotificationsEnabled: form?.emailSettings?.developerNotificationsEnabled,
    userPlan: form?.user?.plan,
    hasResendApiKey: !!form?.user?.resendApiKey
  });

  if (!form || !form.emailSettings?.developerNotificationsEnabled || form.user.plan !== 'PRO') {
    const reason = !form ? 'form-not-found' :
                  !form.emailSettings?.developerNotificationsEnabled ? 'notifications-disabled' :
                  'not-pro-plan';
    console.log('❌ Developer notification skipped:', { reason });
    return { sent: false, reason };
  }

  // Check if user has provided a Resend API key
  if (!form.user.resendApiKey) {
    console.log('❌ Developer notification skipped: missing API key');
    return { sent: false, reason: 'missing-api-key' };
  }
  
  // Initialize Resend with user's API key
  const resend = new Resend(form.user.resendApiKey);

  // Check if we've sent too many notifications recently
  const currentTime = new Date();
  const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);
  
  const recentNotifications = await db.notificationLog.count({
    where: {
      formId: form.id,
      createdAt: { gte: oneHourAgo },
      type: 'DEVELOPER_NOTIFICATION',
    }
  });

  console.log('📊 Rate limit check:', { 
    recentNotifications, 
    maxAllowed: form.emailSettings.maxNotificationsPerHour || 10 
  });

  if (recentNotifications >= (form.emailSettings.maxNotificationsPerHour || 10)) {
    console.log('❌ Developer notification skipped: rate limited');
    // Too many notifications, don't send
    return { sent: false, reason: 'rate-limited' };
  }

  // Check conditions if any are set
  const conditions = (form.emailSettings.notificationConditions as unknown as NotificationCondition[] || []);
  if (conditions.length > 0) {
    console.log('🔍 Checking notification conditions:', conditions);
    
    const shouldSend = conditions.every(condition => {
      const fieldValue = submissionData[condition.field];
      let result = true;
      
      switch (condition.operator) {
        case 'equals': result = fieldValue === condition.value; break;
        case 'contains': result = String(fieldValue).includes(condition.value); break;
        case 'greaterThan': result = Number(fieldValue) > Number(condition.value); break;
        case 'lessThan': result = Number(fieldValue) < Number(condition.value); break;
        default: result = true;
      }
      
      console.log(`  - Condition check: ${condition.field} ${condition.operator} ${condition.value} => ${result}`);
      return result;
    });

    if (!shouldSend) {
      console.log('❌ Developer notification skipped: conditions not met');
      return { sent: false, reason: 'conditions-not-met' };
    }
  }

  // Determine target email address
  const targetEmail = form.emailSettings.developerEmail || form.user.email;
  console.log('📧 Preparing to send notification to:', targetEmail);

  // All checks passed, send notification
  try {
    const htmlContent = await render(
      DeveloperNotificationEmail({
        formName: form.name,
        submissionData,
        formId: form.id,
      })
    );

    const result = await resend.emails.send({
      from: form.emailSettings.fromEmail || `notifications@${process.env.NEXT_PUBLIC_APP_DOMAIN || 'mantlz.com'}`,
      to: targetEmail,
      subject: `New Form Submission: ${form.name}`,
      html: htmlContent,
    });

    console.log('✅ Developer notification sent:', result);

    // Log the notification
    await db.notificationLog.create({
      data: {
        formId: form.id,
        submissionId,
        type: 'DEVELOPER_NOTIFICATION',
      }
    });

    // Update last notification time
    await db.emailSettings.update({
      where: { formId: form.id },
      data: { lastNotificationSentAt: currentTime }
    });

    return { sent: true };
  } catch (error) {
    console.error('❌ Failed to send developer notification:', error);
    return { sent: false, reason: 'error', error };
  }
}