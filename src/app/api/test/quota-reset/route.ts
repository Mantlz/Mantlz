import { NextRequest, NextResponse } from 'next/server';
import { QuotaService } from '@/services/quota-service';
import { db } from '@/lib/db';

// Test endpoint to simulate quota reset functionality
// This helps verify that the quota reset logic works correctly
// Usage: GET /api/test/quota-reset?userId=cmcgiknwk0000o7elckuq3t15

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
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'Missing userId parameter',
        usage: 'GET /api/test/quota-reset?userId=cmcgiknwk0000o7elckuq3t15'
      }, { status: 400 });
    }

    console.log(`Testing quota reset for user: ${userId}`);

    // Get current quota before reset
    const currentQuota = await QuotaService.getCurrentQuota(userId);
    console.log('Current quota before reset:', currentQuota);

    // Simulate end of month reset
    const resetResult = await QuotaService.simulateEndOfMonth(userId);
    console.log('Reset simulation result:', resetResult);

    // Get quota history to show the progression
    const quotaHistory = await QuotaService.getQuotaHistory(userId);
    console.log('Quota history:', quotaHistory);

    return NextResponse.json({
      message: 'Quota reset simulation completed successfully',
      beforeReset: resetResult.currentQuota,
      afterReset: resetResult.nextMonthQuota,
      resetMessage: resetResult.message,
      quotaHistory: quotaHistory
    });

  } catch (error) {
    console.error('Error in quota reset test:', error);
    return NextResponse.json({ 
      error: 'Failed to simulate quota reset',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

interface CreateTestDataRequest {
  userId: string;
  submissionCount?: number;
  formCount?: number;
  campaignCount?: number;
}

// POST endpoint to create test data for quota reset testing
export async function POST(request: NextRequest) {
  try {
    // Only allow in development or with proper authentication
    if (process.env.NODE_ENV === 'production') {
      const authHeader = request.headers.get('authorization');
      const testSecret = process.env.TEST_SECRET;
      
      if (!testSecret || authHeader !== `Bearer ${testSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const { userId, submissionCount = 150, formCount = 5, campaignCount = 2 }: CreateTestDataRequest = await request.json();
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'Missing userId in request body'
      }, { status: 400 });
    }

    console.log(`Creating test quota data for user: ${userId}`);

    // Update current quota with test data
    await QuotaService.updateQuota(userId, {
      incrementSubmissions: true // This will get current quota and increment
    });

    // Manually update with specific test values
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const updatedQuota = await db.quota.updateMany({
      where: {
        userId,
        year: currentYear,
        month: currentMonth
      },
      data: {
        submissionCount,
        formCount,
        campaignCount,
        emailsSent: 50,
        emailsOpened: 25,
        emailsClicked: 10
      }
    });

    const currentQuota = await QuotaService.getCurrentQuota(userId);

    return NextResponse.json({
      message: 'Test quota data created successfully',
      quota: currentQuota,
      note: 'You can now test the reset functionality with GET /api/test/quota-reset'
    });

  } catch (error) {
    console.error('Error creating test quota data:', error);
    return NextResponse.json({ 
      error: 'Failed to create test quota data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}