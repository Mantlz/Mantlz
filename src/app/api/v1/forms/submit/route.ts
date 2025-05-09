import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from "@/lib/db";
import { Resend } from 'resend';
import { FormSubmissionEmail } from '@/emails/form-submission';
import { render } from '@react-email/components';
import { Plan, Prisma } from '@prisma/client';
import { sendDeveloperNotification } from '@/services/notifcation-service';
import { ratelimitConfig } from '@/lib/ratelimiter';
import { enhanceDataWithAnalytics } from '@/lib/analytics-utils';

const submitSchema = z.object({
  formId: z.string(),
  apiKey: z.string(),
  //recaptchaToken: z.string(),
  redirectUrl: z.string().optional(),
  data: z.record(z.unknown()).refine((data) => {
    return typeof data.email === 'string' || data.email === undefined;
  }, {
    message: 'Email must be a string or undefined'
  }),
});

type SubmitSchemaType = z.infer<typeof submitSchema>;

// interface RecaptchaResponse {
//   success: boolean;
//   score: number;
//   challenge_ts?: string;
//   hostname?: string;
//   'error-codes'?: string[];
// }

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

    const body = await req.json() as { apiKey?: string; [key: string]: unknown };
    
    // Accept API key from body or header
    const apiKeyHeader = req.headers.get('X-API-Key');
    const apiKeyBody = body.apiKey;
    const apiKey = apiKeyHeader || apiKeyBody;
    
    // Replace body.apiKey with our apiKey variable in the parse call
    body.apiKey = apiKey;
    
    const { formId, redirectUrl, data } = submitSchema.parse(body) as SubmitSchemaType;

    // Verify reCAPTCHA token
    // const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    // });

    // const recaptchaResult = await recaptchaResponse.json() as RecaptchaResponse;

    // if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
    //   return NextResponse.json(
    //     { message: 'Spam protection verification failed' },
    //     { status: 400 }
    //   );
    // }

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
    try {
      // Capture user agent and location information
      const headers = {
        userAgent: req.headers.get('user-agent'),
        cfCountry: req.headers.get('cf-ipcountry'),
        acceptLanguage: req.headers.get('accept-language'),
        ip: req.headers.get('x-forwarded-for')
      };

      console.log('Request headers for analytics:', headers);
      
      const enhancedData = await enhanceDataWithAnalytics(data, headers);
      
      console.log('Enhanced analytics data:', { 
        browser: enhancedData._meta.browser, 
        country: enhancedData._meta.country,
        rawHeaders: headers,
        ip: headers.ip
      });
      
      const submission = await db.submission.create({
        data: {
          formId,
          data: enhancedData as Prisma.InputJsonValue,
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

          // Create notification log for successful email
          await db.notificationLog.create({
            data: {
              type: 'SUBMISSION_CONFIRMATION',
              status: 'SENT',
              submissionId: submission.id,
              formId: form.id,
            },
          });

          console.log('Confirmation email sent successfully');
        } catch (error) {
          console.error('Failed to send confirmation email:', error);
          // Create notification log for failed email
          await db.notificationLog.create({
            data: {
              type: 'SUBMISSION_CONFIRMATION',
              status: 'FAILED',
              error: error instanceof Error ? error.message : 'Unknown error',
              submissionId: submission.id,
              formId: form.id,
            },
          });
          // Don't throw the error, just log it
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
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return NextResponse.json(
          { message: 'A submission with this email already exists for this form.' },
          { status: 409 }
        );
      }
      throw error; // Re-throw if it's not a known Prisma error
    }
  } catch (error) {
    console.error('Error processing form submission:', error);

    if (error instanceof z.ZodError) {
      const message = error.errors.map(e => e.message).join(', ') || 'Invalid form data';
      return NextResponse.json(
        { message },
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { message: 'A submission with this email already exists for this form.' },
          { status: 409 }
        );
      }
      // Handle other Prisma errors if needed
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 