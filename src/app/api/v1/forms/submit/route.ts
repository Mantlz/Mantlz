import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from "@/lib/db";
import { Resend } from 'resend';
import { FormSubmissionEmail } from '@/emails/form-submission';
import { render } from '@react-email/components';
import { Plan, Prisma } from '@prisma/client';
import { sendDeveloperNotification } from '@/services/notifcation-service';
import { debugService } from '@/services/debug-service';

const submitSchema = z.object({
  formId: z.string(),
  apiKey: z.string(),
  data: z.record(z.any()).refine((data) => {
    return typeof data.email === 'string' || data.email === undefined;
  }, {
    message: 'Email must be a string or undefined'
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { formId, apiKey, data } = submitSchema.parse(body);

    // Get request metadata for debugging
    const headers = req.headers;
    const userAgent = headers.get('user-agent') || undefined;
    const ip = (headers.get('x-forwarded-for') || headers.get('x-real-ip')) || undefined;

    // Validate API key and update last used timestamp
    const apiKeyRecord = await db.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true },
    });

    if (!apiKeyRecord || !apiKeyRecord.isActive) {
      await debugService.log('api_key_invalid', { apiKey }, {
        formId,
        userId: apiKeyRecord?.userId || 'unknown',
        userPlan: apiKeyRecord?.user?.plan || 'unknown',
        timestamp: new Date().toISOString(),
        userAgent,
        ip,
      });
      return NextResponse.json(
        { message: 'Invalid or inactive API key' },
        { status: 401 }
      );
    }

    // Update last used timestamp
    await db.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() },
    });

    // Get form with user data and email settings
    const form = await db.form.findUnique({
      where: { id: formId },
      include: {
        user: {
          select: {
            plan: true,
          },
        },
        emailSettings: {
          select: {
            enabled: true,
            fromEmail: true,
            subject: true,
            template: true,
            replyTo: true,
            developerNotificationsEnabled: true,
          },
        },
      },
    });

    if (!form) {
      await debugService.log('form_not_found', { formId }, {
        formId,
        userId: apiKeyRecord.userId,
        userPlan: apiKeyRecord.user.plan,
        timestamp: new Date().toISOString(),
        userAgent,
        ip,
      });
      return NextResponse.json(
        { message: 'Form not found' },
        { status: 404 }
      );
    }

    // Validate form ownership
    if (form.userId !== apiKeyRecord.userId) {
      await debugService.log('form_unauthorized', { formId, userId: apiKeyRecord.userId }, {
        formId,
        userId: apiKeyRecord.userId,
        userPlan: apiKeyRecord.user.plan,
        timestamp: new Date().toISOString(),
        userAgent,
        ip,
      });
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Create submission
    const submission = await db.submission.create({
      data: {
        formId,
        data,
        email: typeof data.email === 'string' ? data.email : undefined,
      },
    });

    // Log successful submission
    await debugService.logFormSubmission(formId, submission.id, data, {
      userId: apiKeyRecord.userId,
      userPlan: apiKeyRecord.user.plan,
      timestamp: new Date().toISOString(),
      userAgent,
      ip,
    });

    // Send confirmation email if:
    // 1. User is STANDARD or PRO
    // 2. Form has email settings enabled
    // 3. Submission includes a valid email
    if (
      (form.user.plan === Plan.STANDARD || form.user.plan === Plan.PRO) && 
      form.emailSettings?.enabled && 
      typeof data.email === 'string'
    ) {
      try {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
          throw new Error('No Resend API key configured');
        }

        const resendClient = new Resend(resendApiKey);
        const fromEmail = form.emailSettings.fromEmail || process.env.RESEND_FROM_EMAIL || 'contact@mantlz.app';
        const subject = form.emailSettings.subject || `Form Submission Confirmation - ${form.name}`;

        const htmlContent = await render(
          FormSubmissionEmail({
            formName: form.name,
            submissionData: data,
          })
        );

        await resendClient.emails.send({
          from: fromEmail,
          to: data.email,
          subject,
          replyTo: form.emailSettings.replyTo || 'contact@mantlz.app',
          html: htmlContent,
        });

        // Log successful email
        await debugService.logEmailSent(formId, submission.id, {
          to: data.email,
          subject,
          from: fromEmail,
        }, {
          userId: apiKeyRecord.userId,
          userPlan: apiKeyRecord.user.plan,
          timestamp: new Date().toISOString(),
          userAgent,
          ip,
        });
      } catch (error) {
        // Log email error
        await debugService.logEmailError(formId, submission.id, error as Error, {
          userId: apiKeyRecord.userId,
          userPlan: apiKeyRecord.user.plan,
          timestamp: new Date().toISOString(),
          userAgent,
          ip,
        });
        console.error('Failed to send confirmation email:', error);
      }
    }

    // Send notification to developer if PRO plan and notifications enabled
    if (form.user.plan === Plan.PRO) {
      try {
        const notificationResult = await sendDeveloperNotification(formId, submission.id, data);
        await debugService.log('developer_notification_sent', {
          formId,
          submissionId: submission.id,
          result: notificationResult,
        }, {
          formId,
          userId: apiKeyRecord.userId,
          userPlan: apiKeyRecord.user.plan,
          timestamp: new Date().toISOString(),
          userAgent,
          ip,
        });
      } catch (error) {
        await debugService.log('developer_notification_error', {
          formId,
          submissionId: submission.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        }, {
          formId,
          userId: apiKeyRecord.userId,
          userPlan: apiKeyRecord.user.plan,
          timestamp: new Date().toISOString(),
          userAgent,
          ip,
        });
        console.error('Failed to send developer notification:', error);
      }
    }

    return NextResponse.json({ 
      message: 'Form submitted successfully',
      submissionId: submission.id,
    });
  } catch (error) {
    // Log any errors that occur during submission
    if (error instanceof z.ZodError) {
      const message = error.errors[0]?.message || 'Invalid form data';
      await debugService.log('validation_error', {
        error: message,
        details: error.errors,
      }, {
        formId: 'unknown',
        userId: 'unknown',
        userPlan: 'unknown',
        timestamp: new Date().toISOString(),
        userAgent: req.headers.get('user-agent') || undefined,
        ip: (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')) || undefined,
      });
      return NextResponse.json(
        { message },
        { status: 400 }
      );
    }

    await debugService.log('submission_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, {
      formId: 'unknown',
      userId: 'unknown',
      userPlan: 'unknown',
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get('user-agent') || undefined,
      ip: (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')) || undefined,
    });

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 