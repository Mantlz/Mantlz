import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { enhanceDataWithAnalytics } from "@/lib/analytics-utils";
import { Resend } from 'resend';
import { FormSubmissionEmail } from '@/emails/form-submission';
import { render } from '@react-email/components';
import { HTTPException } from "hono/http-exception";
import { QuotaService } from "@/services/quota-service";


// Define types based on the Prisma schema
type FormWithUser = {
  id: string;
  name: string;
  userId: string;
  user: {
    id: string;
    plan: string;
    [key: string]: unknown; // Replace any with unknown
  };
  emailSettings?: {
    id: string;
    formId: string;
    enabled: boolean;
    fromEmail: string | null;
    subject: string | null;
    template: string | null;
    replyTo: string | null;
    developerNotificationsEnabled: boolean;
    developerEmail: string | null;
    maxNotificationsPerHour: number;
    notificationConditions: unknown | null;
    lastNotificationSentAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  [key: string]: unknown; // Replace any with unknown
};

// Define a submission type that matches what the Prisma client returns
type SubmissionWithDate = {
  id: string;
  formId: string;
  data: Prisma.JsonValue;
  email: string | null;
  createdAt: Date;
  unsubscribed: boolean;
  [key: string]: unknown; // Replace any with unknown
};

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export class SubmissionService {
  
  // Submit a form
  static async submitForm(formId: string, data: Record<string, unknown>, requestDetails: {
    userAgent?: string;
    cfCountry?: string;
    acceptLanguage?: string;
    ip?: string;
  }) {
    // Find the form
    const form = await db.form.findUnique({
      where: { id: formId },
      include: { 
        user: true,
        emailSettings: true
      }
    });

    if (!form) throw new HTTPException(404, { message: "Form not found" });

    // Check quota before submitting
    await QuotaService.canSubmitForm(form.user.id);
    
    // Process the data to ensure file fields are strings
    const processedData = { ...data };
    for (const [key, value] of Object.entries(data)) {
      if (value instanceof File) {
        console.log('Converting File object to URL for field:', key);
        // If it's a File object, we should have already uploaded it and have a URL
        processedData[key] = value.name; // Store the filename as a fallback
      } else if (typeof value === 'string' && value.startsWith('https://ucarecdn.com/')) {
        console.log('Found file URL for field:', key);
        processedData[key] = value; // Keep the URL as is
      }
    }
    
    // Use our utility function to enhance data with analytics info
    const enhancedData = enhanceDataWithAnalytics(processedData, {
      userAgent: requestDetails.userAgent,
      cfCountry: requestDetails.cfCountry,
      acceptLanguage: requestDetails.acceptLanguage,
      ip: requestDetails.ip
    });

    // Create the submission
    const submission = await db.submission.create({
      data: {
        formId: formId,
        data: enhancedData as unknown as Prisma.InputJsonValue,
        email: processedData.email as string | undefined, 
      },
    });

    // Handle email notifications
    await this.handleEmailNotifications(form, submission as SubmissionWithDate, processedData);
    
    // Update quota after successful submission
    await QuotaService.updateQuota(form.user.id, { incrementSubmissions: true });
    
    return submission;
  }
  
  // Handle email notifications for form submissions
  private static async handleEmailNotifications(
    form: FormWithUser, 
    submission: SubmissionWithDate, 
    processedData: Record<string, unknown>
  ) {
    // Send confirmation email for STANDARD and PRO users
    if (
      (form.user.plan === 'STANDARD' || form.user.plan === 'PRO') && 
      form.emailSettings?.enabled &&
      processedData.email && 
      typeof processedData.email === 'string'
    ) {
      try {
        const htmlContent = await render(
          FormSubmissionEmail({
            formName: form.name,
            submissionData: processedData,
          })
        );

        await resend.emails.send({
          from: form.emailSettings?.fromEmail || 'contact@mantlz.app',
          to: processedData.email,
          subject: form.emailSettings?.subject || `Confirmation: ${form.name} Submission`,
          replyTo: 'contact@mantlz.app',
          html: htmlContent
        });

        // Create notification log for successful email
        await db.notificationLog.create({
          data: {
            type: 'SUBMISSION_CONFIRMATION',
            status: 'SENT',
            submissionId: submission.id,
            formId: form.id,
          },
        });
      } catch (error) {
        // Log error and create notification log for failed email
        console.error('Failed to send confirmation email:', error);
        await db.notificationLog.create({
          data: {
            type: 'SUBMISSION_CONFIRMATION',
            status: 'FAILED',
            error: error instanceof Error ? error.message : 'Unknown error',
            submissionId: submission.id,
            formId: form.id,
          },
        });
      }
    } else {
      // Create a SKIPPED notification log if email was not sent
      await db.notificationLog.create({
        data: {
          type: 'SUBMISSION_CONFIRMATION',
          status: 'SKIPPED',
          error: 'Email not sent - plan or settings not configured',
          submissionId: submission.id,
          formId: form.id,
        },
      });
    }
  }
  
  // Get form submissions
  static async getFormSubmissions(formId: string, userId: string) {
    // Verify form ownership
    const form = await db.form.findUnique({
      where: {
        id: formId,
        userId,
      },
    });
    
    if (!form) {
      throw new HTTPException(404, { message: "Form not found" });
    }
    
    const submissions = await db.submission.findMany({
      where: {
        formId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        createdAt: true,
        data: true,
      },
    });
    
    return submissions;
  }
  
  // Delete a submission
  static async deleteSubmission(submissionId: string, userId: string) {
    // Get the submission to verify ownership
    const submission = await db.submission.findUnique({
      where: { id: submissionId },
      include: {
        form: {
          select: {
            userId: true
          }
        }
      }
    });

    if (!submission) {
      throw new HTTPException(404, { message: 'Submission not found' });
    }

    // Check if the user owns the form associated with this submission
    if (submission.form.userId !== userId) {
      throw new HTTPException(403, { message: 'You do not have permission to delete this submission' });
    }

    // Delete notifications first, then the submission
    await db.notificationLog.deleteMany({
      where: { submissionId }
    });

    await db.submission.delete({
      where: { id: submissionId }
    });

    return { success: true };
  }
} 