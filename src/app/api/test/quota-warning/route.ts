import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resend } from '@/services/email-service';

import { QuotaWarningEmail } from '@/emails/quota-warning-email';
import { getQuotaByPlan } from '@/config/usage';

// Test endpoint to manually trigger quota warning emails
// This is useful for testing the email template and functionality
// Usage: GET /api/test/quota-warning?email=test@example.com

export async function GET(request: NextRequest) {
  try {
    // Only allow in development or with proper authentication
    if (process.env.NODE_ENV === 'production') {
      const authHeader = request.headers.get('authorization');
      const testSecret = process.env.TEST_SECRET;
      
      if (!testSecret || authHeader !== `Bearer ${testSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const { searchParams } = new URL(request.url);
    const customEmail = searchParams.get('email');
    
    // Use Resend's testing email address to avoid validation errors
    // In development, Resend requires using their testing domains
    const testEmail = customEmail || 'delivered@resend.dev';
    
    console.log(`Sending test quota warning email to: ${testEmail}`);

    // Send test email with sample data
    const emailResult = await resend.emails.send({
      from: `notifications@${process.env.NEXT_PUBLIC_APP_DOMAIN || 'mantlz.app'}`,
      to: testEmail,
      subject: `⚠️ [TEST] Your monthly quota resets in 3 days - Export your data now!`,
      react: QuotaWarningEmail({
        userName: (customEmail ? customEmail.split('@')[0] : 'testuser') as string,
        userEmail: customEmail || 'delivered@resend.dev',
        currentSubmissions: 1750,
        maxSubmissions: 5000,
        plan: 'STANDARD',
        daysUntilReset: 3
      })
    });

    if (emailResult.error) {
      console.error('Failed to send test quota warning:', emailResult.error);
      return NextResponse.json({ 
        error: 'Failed to send email',
        details: emailResult.error 
      }, { status: 500 });
    }

    console.log('✅ Test quota warning email sent successfully');

    return NextResponse.json({ 
      success: true,
      message: `Test quota warning email sent to ${testEmail}`,
      emailId: emailResult.data?.id,
      sampleData: {
        userName: testEmail.split('@')[0],
        currentSubmissions: 1750,
        maxSubmissions: 5000,
        plan: 'STANDARD',
        daysUntilReset: 3,
        usagePercentage: '35%'
      }
    });

  } catch (error) {
    console.error('Error in test quota warning endpoint:', error);
    return NextResponse.json({ 
      error: 'Failed to send test quota warning',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}