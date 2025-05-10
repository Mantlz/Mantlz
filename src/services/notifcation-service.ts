import { db } from "@/lib/db";
import { Resend } from 'resend';
import { render } from '@react-email/components';
import { DeveloperNotificationEmail } from '@/emails/developer-notification';

// Define interfaces for type safety
interface SubmissionData {
  [key: string]: unknown;
}

interface NotificationCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
  value: string;
}

// Don't initialize Resend yet - we'll do it with the user's key

export async function sendDeveloperNotification(
  formId: string,
  submissionId: string,
  submissionData: SubmissionData
) {

  
  // Get form and email settings with user information
  const form = await db.form.findUnique({
    where: { id: formId },
    include: {
      user: { select: { email: true, plan: true, resendApiKey: true } },
      emailSettings: true,
    }
  });


  if (!form || !form.emailSettings?.developerNotificationsEnabled || form.user.plan !== 'PRO') {
    const reason = !form ? 'form-not-found' :
                  !form.emailSettings?.developerNotificationsEnabled ? 'notifications-disabled' :
                  'not-pro-plan';
    return { sent: false, reason };
  }

  // Check if user has provided a Resend API key
  if (!form.user.resendApiKey) {
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

 

  if (recentNotifications >= (form.emailSettings.maxNotificationsPerHour || 10)) {
    // Too many notifications, don't send
    return { sent: false, reason: 'rate-limited' };
  }

  // Check conditions if any are set
  const conditions = (form.emailSettings.notificationConditions as unknown as NotificationCondition[] || []);
  if (conditions.length > 0) {
    
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
      
      return result;
    });

    if (!shouldSend) {
      return { sent: false, reason: 'conditions-not-met' };
    }
  }

  // Determine target email address
  const targetEmail = form.emailSettings.developerEmail || form.user.email;

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
      from: form.emailSettings.fromEmail || `notifications@${process.env.NEXT_PUBLIC_APP_DOMAIN || 'mantlz.app'}`,
      to: targetEmail,
      subject: `New Form Submission: ${form.name}`,
      html: htmlContent,
    });

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