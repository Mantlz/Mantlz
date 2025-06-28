import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resend } from '@/services/email-service';
import { QuotaWarningEmail } from '@/emails/quota-warning-email';
import { getQuotaByPlan } from '@/config/usage';
import { addDays, startOfMonth } from 'date-fns';


// Vercel Cron Job: This function will be called by Vercel's cron job scheduler
// See vercel.json configuration for the schedule
// This runs on the 29th of each month to send quota warning emails 2 days before reset

export async function GET(request: NextRequest) {
  try {
    // Verify the cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // If CRON_SECRET is set, verify it
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error("Unauthorized quota warning cron job attempt");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log("Processing quota warning emails...");

    const now = new Date();
    
    // Check if today is the 29th of the month
    const is29thOfMonth = now.getDate() === 29;
    
    if (!is29thOfMonth) {
      console.log(`Not the 29th of the month. Current date: ${now.toDateString()}`);
      return NextResponse.json({ 
        success: true, 
        message: `Not the 29th of the month. No warnings sent.`,
        processed: 0 
      });
    }

    console.log("It's the 29th of the month. Sending quota warning emails (2 days before reset)...");

    // Since this runs on the 29th and quotas reset on the 1st, it's always 2 days until reset
    const daysUntilReset = 2;

    // Get all users with their current month's quota
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const users = await db.user.findMany({
      where: {
        // Only send to users who have submissions this month
        quota: {
          some: {
            year: currentYear,
            month: currentMonth,
            submissionCount: {
              gt: 0
            }
          }
        }
      },
      include: {
        quota: {
          where: {
            year: currentYear,
            month: currentMonth
          }
        }
      }
    });

    console.log(`Found ${users.length} users with submissions this month`);

    let emailsSent = 0;
    let emailsFailed = 0;

    for (const user of users) {
      try {
        const currentQuota = user.quota[0]; // Should only be one for current month
        if (!currentQuota) continue;

        const planQuota = getQuotaByPlan(user.plan);
        const usagePercentage = (currentQuota.submissionCount / planQuota.maxSubmissionsPerMonth) * 100;

        // Only send warning if user has used more than 10% of their quota
        // This avoids spamming users who barely use the service
        if (usagePercentage < 10) {
          console.log(`Skipping user ${user.email} - low usage (${usagePercentage.toFixed(1)}%)`);
          continue;
        }

        // Send the warning email
        const emailResult = await resend.emails.send({
          from: `notifications@${process.env.NEXT_PUBLIC_APP_DOMAIN || 'mantlz.app'}`,
          to: user.email,
          subject: `⚠️ Your monthly quota resets in ${daysUntilReset} days - Export your data now!`,
          react: QuotaWarningEmail({
            userName: user.email?.split('@')[0] || user.email, // Use email prefix as name fallback, fallback to full email if split fails
            userEmail: user.email,
            currentSubmissions: currentQuota.submissionCount,
            maxSubmissions: planQuota.maxSubmissionsPerMonth,
            plan: user.plan,
            daysUntilReset
          })
        });

        if (emailResult.error) {
          console.error(`Failed to send quota warning to ${user.email}:`, emailResult.error);
          emailsFailed++;
        } else {
          console.log(`✅ Quota warning sent to ${user.email}`);
          emailsSent++;
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error processing user ${user.email}:`, error);
        emailsFailed++;
      }
    }

    console.log(`Quota warning processing complete. Sent: ${emailsSent}, Failed: ${emailsFailed}`);

    return NextResponse.json({ 
      success: true, 
      processed: users.length,
      emailsSent,
      emailsFailed,
      daysUntilReset,
      message: `Quota warning emails processed. Sent: ${emailsSent}, Failed: ${emailsFailed}`
    });

  } catch (error) {
    console.error("Error in quota warning cron job:", error);
    return NextResponse.json({ 
      error: "Failed to process quota warnings",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}