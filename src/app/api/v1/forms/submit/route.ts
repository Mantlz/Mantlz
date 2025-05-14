import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from "@/lib/db";
import { Resend } from 'resend';
import { FormSubmissionEmail } from '@/emails/form-submission';
import { render } from '@react-email/components';
import { Plan, Prisma } from '@prisma/client';
import { sendDeveloperNotification } from '@/services/notifcation-service';
import { debugService } from '@/services/debug-service';
import { ratelimitConfig } from '@/lib/ratelimiter';
import { enhanceDataWithAnalytics } from '@/lib/analytics-utils';
import { uploadFile } from '@/lib/file-upload';

// Define types for form submission data
interface FormSubmissionData {
  [key: string]: string | number | boolean | File | undefined;
  email?: string;
}

const submitSchema = z.object({
  formId: z.string(),
  //apiKey: z.string(),
  redirectUrl: z.string().optional(),
  data: z.record(z.unknown()).refine((data) => {
    return typeof data.email === 'string' || data.email === undefined;
  }, {
    message: 'Email must be a string or undefined'
  }),
});

type SubmitSchemaType = z.infer<typeof submitSchema>;

export async function POST(req: Request) {
  try {
    // Apply rate limiting
    if (ratelimitConfig.enabled && ratelimitConfig.ratelimit) {
      const ip = req.headers.get('x-forwarded-for') || 'unknown';
      console.log(`Rate limiting check for IP: ${ip}`);
      
      const { success, limit, reset, remaining } = await ratelimitConfig.ratelimit.limit(ip);
      console.log(`Rate limit result:`, { success, limit, reset, remaining });

      if (!success) {
        console.log(`Rate limit exceeded for IP: ${ip}`);
        return NextResponse.json(
          { 
            message: 'Too many requests, please try again later.',
            limit,
            reset,
            remaining
          },
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString()
            }
          }
        );
      }
    } else {
      console.log('Rate limiting is disabled or not configured');
    }

    // Get API key from header or body
    const apiKeyHeader = req.headers.get('X-API-Key');
    const apiKeyBody = req.headers.get('Authorization')?.replace('Bearer ', '');
    const apiKey = apiKeyHeader || apiKeyBody;
    
    if (!apiKey) {
      console.log('API key validation failed');
      return NextResponse.json(
        { message: 'API key is required' },
        { status: 401 }
      );
    }

    // Check content type to determine how to parse the body
    const contentType = req.headers.get('content-type') || '';
    let formId: string;
    let redirectUrl: string | undefined;
    let submissionData: FormSubmissionData = {};

    if (contentType.includes('multipart/form-data')) {
      // Handle form-data
      const formData = await req.formData();
      console.log('Form data received:', {
        keys: Array.from(formData.keys()),
        hasFiles: Array.from(formData.values()).some(v => v instanceof File)
      });
      
      formId = formData.get('formId') as string;
      redirectUrl = formData.get('redirectUrl') as string | undefined;

      // Process form data
      for (const [key, value] of formData.entries()) {
        console.log(`Processing field: ${key}`, value instanceof File ? 'File' : 'Text');
        if (value instanceof File) {
          try {
            console.log(`Uploading file: ${value.name} (${value.size} bytes)`);
            const fileUrl = await uploadFile(value);
            console.log('File uploaded successfully:', fileUrl);
            submissionData[key] = fileUrl;
          } catch (error) {
            console.error('File upload error:', error);
            return NextResponse.json(
              { message: 'Failed to upload file' },
              { status: 500 }
            );
          }
        } else {
          submissionData[key] = value;
        }
      }

      // Validate form data
      const validatedData = submitSchema.parse({
        formId,
        apiKey,
        redirectUrl,
        data: submissionData
      });
      formId = validatedData.formId;
      redirectUrl = validatedData.redirectUrl;
      submissionData = validatedData.data as FormSubmissionData;
    } else {
      // Handle JSON
      const body = await req.json() as SubmitSchemaType;
      const validatedData = submitSchema.parse(body);
      formId = validatedData.formId;
      redirectUrl = validatedData.redirectUrl;
      submissionData = validatedData.data as FormSubmissionData;
    }

    console.log('Form ID:', formId, 'Redirect URL:', redirectUrl);

    if (!formId) {
      console.log('Form ID validation failed');
      return NextResponse.json(
        { message: 'Form ID is required' },
        { status: 400 }
      );
    }

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
      await debugService.log('api_key_invalid', { 
        apiKey,
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
      await debugService.log('form_not_found', { 
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
      await debugService.log('form_unauthorized', { 
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

    // Remove formId and redirectUrl from submission data
    delete submissionData.formId;
    delete submissionData.redirectUrl;

    // Capture user agent and location information
    const analyticsHeaders = {
      userAgent: req.headers.get('user-agent'),
      cfCountry: req.headers.get('cf-ipcountry'),
      acceptLanguage: req.headers.get('accept-language'),
      ip: req.headers.get('x-forwarded-for')
    };
    console.log('Analytics headers:', analyticsHeaders);

    const enhancedData = await enhanceDataWithAnalytics(submissionData, analyticsHeaders);
    console.log('Enhanced data created');
    
    // Create submission
    console.log('Creating submission in database...');
    const submission = await db.submission.create({
      data: {
        formId,
        data: enhancedData as Prisma.InputJsonValue,
        email: typeof submissionData.email === 'string' ? submissionData.email : undefined,
      },
    });
    console.log('Submission created:', submission.id);

    // Log successful submission
    await debugService.logFormSubmission(formId, submission.id, {
      data: submissionData,
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
      typeof submissionData.email === 'string'
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
            submissionData: submissionData,
          })
        );

        await resendClient.emails.send({
          from: fromEmail,
          to: submissionData.email,
          subject,
          replyTo: form.emailSettings.replyTo || 'contact@mantlz.app',
          html: htmlContent,
        });

        // Log successful email
        await debugService.logEmailSent(formId, submission.id, {
          to: submissionData.email,
          subject,
          from: fromEmail,
          userId: apiKeyRecord.userId,
          userPlan: apiKeyRecord.user.plan,
          timestamp: new Date().toISOString(),
          userAgent,
          ip,
        });
      } catch (error) {
        // Log email error
        await debugService.logEmailError(formId, submission.id, error as Error);
        console.error('Failed to send confirmation email:', error);
      }
    }

    // Send notification to developer if PRO plan and notifications enabled
    if (form.user.plan === Plan.PRO) {
      try {
        const notificationResult = await sendDeveloperNotification(formId, submission.id, submissionData);
        await debugService.log('developer_notification_sent', {
          formId,
          submissionId: submission.id,
          result: notificationResult,
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
          userId: apiKeyRecord.userId,
          userPlan: apiKeyRecord.user.plan,
          timestamp: new Date().toISOString(),
          userAgent,
          ip,
        });
        console.error('Failed to send developer notification:', error);
      }
    }

    // Handle redirect URLs based on the user's plan
    if (redirectUrl) {
      console.log('Redirect URL requested:', redirectUrl);
      
      // Only users on STANDARD or PRO plans can use custom redirect URLs
      if (form.user.plan === Plan.STANDARD || form.user.plan === Plan.PRO) {
        console.log('User is on a paid plan, allowing custom redirect to:', redirectUrl);
        
        // Return response with redirect URL
        return NextResponse.json({ 
          success: true,
          message: 'Form submitted successfully',
          submissionId: submission.id,
          redirect: {
            url: redirectUrl,
            allowed: true
          }
        });
      } else {
        console.log('User is on a FREE plan, custom redirects not allowed. Using default Mantlz thank-you page.');
        
        // For free users, ignore the custom redirect and use the default Mantlz thank-you page
        // Use environment variable with fallback
        const defaultRedirectUrl = process.env.MANTLZ_THANK_YOU_URL || 
                                  `${process.env.NEXT_PUBLIC_APP_URL || 'https://mantlz.app'}/thank-you`;
        
        return NextResponse.json({ 
          success: true,
          message: 'Form submitted successfully',
          submissionId: submission.id,
          redirect: {
            url: defaultRedirectUrl,
            allowed: false,
            reason: 'Custom redirects require STANDARD or PRO plan'
          }
        });
      }
    }

    // No custom redirect requested, use the default Mantlz thank-you page
    // Use environment variable with fallback
    const defaultRedirectUrl = process.env.MANTLZ_THANK_YOU_URL || 
                              `${process.env.NEXT_PUBLIC_APP_URL || 'https://mantlz.app'}/thank-you`;
    
    return NextResponse.json({ 
      success: true,
      message: 'Form submitted successfully',
      submissionId: submission.id,
      redirect: {
        url: defaultRedirectUrl,
        allowed: true
      }
    });
  } catch (error) {
    console.error('Form submission error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 