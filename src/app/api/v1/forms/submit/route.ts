import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from "@/lib/db";
import { Resend } from 'resend';
import { FormSubmissionEmail } from '@/emails/form-submission';
import { render } from '@react-email/components';
import { Plan, Prisma } from '@prisma/client';
import { sendDeveloperNotification } from '@/services/notifcation-service';

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

    // Validate API key and update last used timestamp
    const apiKeyRecord = await db.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true },
    });

    if (!apiKeyRecord || !apiKeyRecord.isActive) {
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
      return NextResponse.json(
        { message: 'Form not found' },
        { status: 404 }
      );
    }

    // Debug log to check form data
    console.log('Form data:', {
      formId,
      userId: form.userId,
      plan: form.user.plan,
      emailSettings: form.emailSettings,
    });

    // Validate form ownership
    if (form.userId !== apiKeyRecord.userId) {
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
        console.log('Attempting to send confirmation email:', {
          plan: form.user.plan,
          email: data.email,
          formName: form.name,
          emailSettings: form.emailSettings,
        });

        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
          throw new Error('No Resend API key configured');
        }

        const resendClient = new Resend(resendApiKey);
        const fromEmail = form.emailSettings.fromEmail || process.env.RESEND_FROM_EMAIL || 'contact@mantlz.app';
        const subject = form.emailSettings.subject || `Form Submission Confirmation - ${form.name}`;

        // Use our branded template with your logo
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
          // Always set reply-to as contact@mantlz.app unless specifically overridden in settings
          replyTo: form.emailSettings.replyTo || 'contact@mantlz.app',
          html: htmlContent,
        });

        console.log('Confirmation email sent successfully');
      } catch (error) {
        console.error('Failed to send confirmation email:', error);
        // Don't throw the error, just log it
      }
    } else {
      console.log('Email not sent:', {
        plan: form.user.plan,
        hasEmail: !!data.email,
        emailType: typeof data.email,
        emailEnabled: form.emailSettings?.enabled,
      });
    }

    // Send notification to developer if PRO plan and notifications enabled
    if (form.user.plan === Plan.PRO) {
      try {
        console.log('🔔 Attempting to send developer notification', {
          formId,
          submissionId: submission.id,
          hasEmailSettings: !!form.emailSettings,
          notificationsEnabled: form.emailSettings?.developerNotificationsEnabled
        });
        
        const notificationResult = await sendDeveloperNotification(formId, submission.id, data);
        
        console.log('🔔 Developer notification result:', notificationResult);
      } catch (error) {
        console.error('❌ Failed to send developer notification:', error);
        // Non-blocking, continue with response
      }
    }

    return NextResponse.json({ 
      message: 'Form submitted successfully',
      submissionId: submission.id,
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    if (error instanceof z.ZodError) {
      const message = error.errors[0]?.message || 'Invalid form data';
      return NextResponse.json(
        { message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 