import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resend } from '@/services/email-service';
import { EndOfMonthEmail } from '@/emails/end-of-month-email';
import { getQuotaByPlan } from '@/config/usage';
import { endOfMonth, startOfMonth } from 'date-fns';

// Vercel Cron Job: This function will be called by Vercel's cron job scheduler
// See vercel.json configuration for the schedule
// This runs on the last day of each month to perform quota reset and send notifications

export async function GET(request: NextRequest) {
  try {
    // Verify the cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // If CRON_SECRET is set, verify it
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error("Unauthorized end-of-month reset cron job attempt");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log("Processing end-of-month quota reset...");

    const now = new Date();
    const endOfCurrentMonth = endOfMonth(now);
    
    // Check if today is the last day of the month
    const isLastDayOfMonth = now.getDate() === endOfCurrentMonth.getDate();
    
    if (!isLastDayOfMonth) {
      console.log(`Not the last day of the month. Current date: ${now.toDateString()}`);
      return NextResponse.json({ 
        success: true, 
        message: `Not the last day of the month. No reset performed.`,
        processed: 0 
      });
    }

    console.log("It's the last day of the month. Performing quota reset...");

    // Get all users with their current month's quota
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const users = await db.user.findMany({
      include: {
        quota: {
          where: {
            year: currentYear,
            month: currentMonth
          }
        },
        forms: true,
        campaigns: {
          where: {
            createdAt: {
              gte: startOfMonth(now),
              lte: endOfCurrentMonth
            }
          }
        }
      }
    });

    console.log(`Found ${users.length} users to process`);

    let usersProcessed = 0;
    let emailsSent = 0;
    let emailsFailed = 0;
    let resetsFailed = 0;

    for (const user of users) {
      try {
        const currentQuota = user.quota[0]; // Should only be one for current month
        
        // Skip users with no quota (inactive users)
        if (!currentQuota) {
          console.log(`Skipping user ${user.email} - no current quota`);
          continue;
        }

        const planQuota = getQuotaByPlan(user.plan);
        const formsCount = user.forms.length;
        const campaignsCount = user.campaigns.length;

        // Store current stats before reset for email
        const currentSubmissions = currentQuota.submissionCount;
        const maxSubmissions = planQuota.maxSubmissionsPerMonth;

        try {
          // Perform the quota reset using the existing simulateEndOfMonth function
          // This will delete all user data and create a fresh quota
          await db.$transaction(async (tx) => {
            // Delete all submissions (through forms)
            await tx.submission.deleteMany({
              where: {
                form: {
                  userId: user.id
                }
              }
            });

            // Delete all campaigns
            await tx.campaign.deleteMany({
              where: { userId: user.id }
            });

            // Delete all forms
            await tx.form.deleteMany({
              where: { userId: user.id }
            });

            // Delete campaign recipients (through campaigns)
            await tx.campaignRecipient.deleteMany({
              where: {
                campaign: {
                  userId: user.id
                }
              }
            });

            // Delete email settings (through forms)
            await tx.emailSettings.deleteMany({
              where: {
                form: {
                  userId: user.id
                }
              }
            });

            // Delete notification logs (through forms)
            await tx.notificationLog.deleteMany({
              where: {
                form: {
                  userId: user.id
                }
              }
            });

            // Delete API keys
            await tx.apiKey.deleteMany({
              where: { userId: user.id }
            });

            // Delete test email submissions (through forms)
            await tx.testEmailSubmission.deleteMany({
              where: {
                form: {
                  userId: user.id
                }
              }
            });

            // Delete Stripe orders (through forms)
            await tx.stripeOrder.deleteMany({
              where: {
                form: {
                  userId: user.id
                }
              }
            });

            // Delete all existing quotas
            await tx.quota.deleteMany({
              where: { userId: user.id }
            });

            // Create new quota for next month
            const nextMonth = now.getMonth() + 2; // +2 because getMonth() is 0-indexed and we want next month
            const nextYear = nextMonth > 12 ? now.getFullYear() + 1 : now.getFullYear();
            const adjustedNextMonth = nextMonth > 12 ? 1 : nextMonth;

            await tx.quota.create({
              data: {
                userId: user.id,
                year: adjustedNextMonth === 1 ? nextYear : now.getFullYear(),
                month: adjustedNextMonth,
                submissionCount: 0,
                formCount: 0,
                campaignCount: 0,
                emailsSent: 0,
                emailsOpened: 0,
                emailsClicked: 0
              }
            });
          });

          console.log(`✅ Quota reset completed for user ${user.email}`);
          usersProcessed++;

        } catch (resetError) {
          console.error(`Failed to reset quota for user ${user.email}:`, resetError);
          resetsFailed++;
          continue; // Skip email sending if reset failed
        }

        // Send end-of-month notification email
        try {
          const emailResult = await resend.emails.send({
            from: `notifications@${process.env.NEXT_PUBLIC_APP_DOMAIN || 'mantlz.app'}`,
            to: user.email,
            subject: `🔄 Your monthly quota has been reset - Fresh start!`,
            react: EndOfMonthEmail({
              userName: user.email?.split('@')[0] || user.email,
              userEmail: user.email,
              currentSubmissions,
              maxSubmissions,
              plan: user.plan,
              formsCount,
              campaignsCount
            })
          });

          if (emailResult.error) {
            console.error(`Failed to send end-of-month email to ${user.email}:`, emailResult.error);
            emailsFailed++;
          } else {
            console.log(`✅ End-of-month email sent to ${user.email}`);
            emailsSent++;
          }
        } catch (emailError) {
          console.error(`Error sending email to ${user.email}:`, emailError);
          emailsFailed++;
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`Error processing user ${user.email}:`, error);
        resetsFailed++;
      }
    }

    console.log(`End-of-month processing complete. Users processed: ${usersProcessed}, Emails sent: ${emailsSent}, Email failures: ${emailsFailed}, Reset failures: ${resetsFailed}`);

    return NextResponse.json({ 
      success: true, 
      totalUsers: users.length,
      usersProcessed,
      emailsSent,
      emailsFailed,
      resetsFailed,
      message: `End-of-month reset complete. Processed: ${usersProcessed} users, Sent: ${emailsSent} emails, Failed resets: ${resetsFailed}, Failed emails: ${emailsFailed}`
    });

  } catch (error) {
    console.error("Error in end-of-month reset cron job:", error);
    return NextResponse.json({ 
      error: "Failed to process end-of-month reset",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}