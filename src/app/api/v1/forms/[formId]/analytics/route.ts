import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from "@/lib/db";
import { ratelimitConfig } from '@/lib/ratelimiter';
import { extractAnalyticsFromSubmissions } from "@/lib/analytics-utils";

const requestSchema = z.object({
  apiKey: z.string(),
  timeRange: z.enum(['day', 'week', 'month']).default('week'),
});

export async function GET(
  req: NextRequest,
  context: { params: { formId: string } }
) {
  try {
    // Get the formId from the URL parameters
    const { formId } = await Promise.resolve(context.params);

    // Get query parameters
    const { searchParams } = new URL(req.url);
    
    // Accept API key from header (preferred) or query parameter (fallback)
    const apiKeyHeader = req.headers.get('X-API-Key');
    const apiKeyQuery = searchParams.get('apiKey');
    const apiKey = apiKeyHeader || apiKeyQuery;
    
    const timeRange = searchParams.get('timeRange') || 'week';

    // Validate parameters
    const result = requestSchema.safeParse({
      apiKey: apiKey,
      timeRange: timeRange,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors.map(e => e.message).join(', ') },
        { status: 400 }
      );
    }

    const { 
      apiKey: validatedApiKey, 
      timeRange: validatedTimeRange,
    } = result.data;

    // Apply rate limiting
    if (ratelimitConfig.enabled && ratelimitConfig.ratelimit) {
      const identifier = `api_v1_forms_analytics_${validatedApiKey}_${formId}`;
      const { success, limit, reset, remaining } = await ratelimitConfig.ratelimit.limit(identifier);
      
      if (!success) {
        return NextResponse.json(
          { error: "Rate limit exceeded" },
          { 
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            }
          }
        );
      }
      
      // Set rate limit headers for the response
      const headers = new Headers();
      headers.set("X-RateLimit-Limit", limit.toString());
      headers.set("X-RateLimit-Remaining", remaining.toString());
      headers.set("X-RateLimit-Reset", reset.toString());
    }

    // Find API key record and validate
    const apiKeyRecord = await db.apiKey.findUnique({
      where: {
        key: validatedApiKey,
        isActive: true,
      }
    });

    if (!apiKeyRecord) {
      return NextResponse.json(
        { error: "Invalid or inactive API key" },
        { status: 401 }
      );
    }

    // Update last used timestamp
    await db.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() },
    });

    // Get user from API key
    const user = await db.user.findUnique({
      where: {
        id: apiKeyRecord.userId
      },
      select: {
        id: true,
        plan: true
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userId = user.id;
    const userPlan = user.plan;
    
    // Free users cannot access analytics
    if (userPlan === 'FREE') {
      return NextResponse.json(
        { error: "Analytics are only available with the STANDARD or PRO plan" },
        { status: 403 }
      );
    }
    
    // Verify form belongs to this user
    const form = await db.form.findUnique({
      where: {
        id: formId,
        userId,
      },
    });
    
    if (!form) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      );
    }
    
    // Get all submissions for this form
    const submissions = await db.submission.findMany({
      where: { formId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        createdAt: true,
        data: true,
        email: true,
      }
    });
    
    const now = new Date();
    const formCreatedAt = new Date(form.createdAt);
    
    // Calculate total submissions
    const totalSubmissions = submissions.length;
    
    // Calculate daily submission rate
    const daysSinceCreation = Math.max(1, (now.getTime() - formCreatedAt.getTime()) / (1000 * 60 * 60 * 24));
    const dailySubmissionRate = totalSubmissions / daysSinceCreation;
    
    // Calculate last 24 hours submissions
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const last24HoursSubmissions = submissions.filter(sub => 
      new Date(sub.createdAt) >= oneDayAgo
    ).length;
    
    // Generate time series data
    interface TimeSeriesPoint {
      time: string;
      submissions: number;
    }
    
    const timeSeriesData: TimeSeriesPoint[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    if (validatedTimeRange === 'day') {
      // Hourly data for the last 24 hours
      for (let i = 0; i < 24; i++) {
        const hour = new Date(now);
        hour.setHours(now.getHours() - 23 + i);
        hour.setMinutes(0, 0, 0);
        
        const nextHour = new Date(hour);
        nextHour.setHours(hour.getHours() + 1);
        
        const hourSubmissions = submissions.filter(sub => {
          const subDate = new Date(sub.createdAt);
          return subDate >= hour && subDate < nextHour;
        });
        
        timeSeriesData.push({
          time: `${hour.getHours()}:00`,
          submissions: hourSubmissions.length,
        });
      }
    } else if (validatedTimeRange === 'week') {
      // Daily data for the last 7 days
      for (let i = 0; i < 7; i++) {
        const day = new Date(now);
        day.setDate(day.getDate() - 6 + i);
        day.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(day);
        nextDay.setDate(day.getDate() + 1);
        
        const daySubmissions = submissions.filter(sub => {
          const subDate = new Date(sub.createdAt);
          return subDate >= day && subDate < nextDay;
        });
        
        timeSeriesData.push({
          time: dayNames[day.getDay() % 7] || '',
          submissions: daySubmissions.length,
        });
      }
    } else if (validatedTimeRange === 'month') {
      // Daily data for the last 30 days
      for (let i = 0; i < 30; i++) {
        const day = new Date(now);
        day.setDate(day.getDate() - 29 + i);
        day.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(day);
        nextDay.setDate(day.getDate() + 1);
        
        const daySubmissions = submissions.filter(sub => {
          const subDate = new Date(sub.createdAt);
          return subDate >= day && subDate < nextDay;
        });
        
        timeSeriesData.push({
          time: `${day.getMonth() + 1}/${day.getDate()}`,
          submissions: daySubmissions.length,
        });
      }
    }
    
    // Basic analytics for STANDARD plan
    const basicAnalytics = {
      totalSubmissions,
      dailySubmissionRate: Math.round(dailySubmissionRate * 100) / 100,
      last24HoursSubmissions,
      timeSeriesData,
      timeRange: validatedTimeRange,
      plan: userPlan,
    };
    
    // Return only basic analytics for STANDARD users
    if (userPlan === 'STANDARD') {
      return NextResponse.json(basicAnalytics);
    }
    
    // Extract advanced analytics for PRO users
    const { browserStats, locationStats } = extractAnalyticsFromSubmissions(submissions);
    
    // Calculate week-over-week growth for PRO users
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const lastWeekSubmissions = submissions.filter(sub => 
      new Date(sub.createdAt) >= oneWeekAgo
    );
    const previousWeekSubmissions = submissions.filter(sub => 
      new Date(sub.createdAt) >= twoWeeksAgo && new Date(sub.createdAt) < oneWeekAgo
    );
    
    const weekOverWeekGrowth = previousWeekSubmissions.length === 0
      ? lastWeekSubmissions.length > 0 ? 1 : 0
      : (lastWeekSubmissions.length - previousWeekSubmissions.length) / previousWeekSubmissions.length;
    
    // Calculate peak submission hour
    const submissionHours = submissions.map(sub => new Date(sub.createdAt).getHours());
    const hourCounts = submissionHours.reduce((acc, hour) => {
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const peakHour = Object.entries(hourCounts).reduce((max, [hour, count]) => 
      count > (hourCounts[parseInt(max[0])] || 0) ? [hour, count] : max
    , ['0', 0])[0];
    
    // Extended analytics for PRO users
    return NextResponse.json({
      ...basicAnalytics,
      weekOverWeekGrowth: Math.round(weekOverWeekGrowth * 100) / 100,
      peakSubmissionHour: parseInt(peakHour),
      browserStats,
      locationStats,
    });
  } catch (error) {
    console.error('Error in form analytics endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 