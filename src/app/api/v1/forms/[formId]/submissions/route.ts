import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from "@/lib/db";
import { ratelimitConfig } from '@/lib/ratelimiter';

// Simplified schema - only apiKey is required, all others optional with defaults
const requestSchema = z.object({
  apiKey: z.string(),
  limit: z.coerce.number().min(1).max(100).default(50),
  cursor: z.string().optional().default(''),
});

export async function GET(
  req: NextRequest,
  context: { params: { formId: string } }
) {
  try {
    // Get the formId from the URL parameters
    const { formId } = await Promise.resolve(context.params);

    // Get query parameters with defaults
    const { searchParams } = new URL(req.url);
    
    // Accept API key from header (preferred) or query parameter (fallback)
    const apiKeyHeader = req.headers.get('X-API-Key');
    const apiKeyQuery = searchParams.get('apiKey');
    const apiKey = apiKeyHeader || apiKeyQuery;
    
    const limitParam = searchParams.get('limit') || '50';
    const cursor = searchParams.get('cursor') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Only validate apiKey, limit, and cursor
    const result = requestSchema.safeParse({
      apiKey: apiKey,
      limit: limitParam,
      cursor: cursor,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors.map(e => e.message).join(', ') },
        { status: 400 }
      );
    }

    const { 
      apiKey: validatedApiKey, 
      limit, 
      cursor: validatedCursor,
    } = result.data;

    // Apply rate limiting
    if (ratelimitConfig.enabled && ratelimitConfig.ratelimit) {
      const identifier = `api_v1_forms_submissions_${validatedApiKey}_${formId}`;
      const { success, limit: rateLimit, reset, remaining } = await ratelimitConfig.ratelimit.limit(identifier);
      
      if (!success) {
        return NextResponse.json(
          { error: "Rate limit exceeded" },
          { 
            status: 429,
            headers: {
              "X-RateLimit-Limit": rateLimit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            }
          }
        );
      }
      
      // Set rate limit headers for the response
      const headers = new Headers();
      headers.set("X-RateLimit-Limit", rateLimit.toString());
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

    // Build the where clause for submissions
    const where: any = { formId };

    // Add date range filtering only for STANDARD and PRO users
    if ((startDate || endDate) && (userPlan === 'STANDARD' || userPlan === 'PRO')) {
      where.createdAt = {};
      
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      
      if (endDate) {
        // Add one day to endDate to include the full day
        const endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        where.createdAt.lt = endDateObj;
      }
    } else if ((startDate || endDate) && userPlan === 'FREE') {
      return NextResponse.json(
        { error: "Date filtering is only available with the STANDARD or PRO plan" },
        { status: 403 }
      );
    }
    
    // Get submissions with pagination
    const take = limit + 1;
    
    const submissions = await db.submission.findMany({
      where,
      take,
      cursor: validatedCursor ? { id: validatedCursor } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        data: true,
        email: true,
      },
    });
    
    // Check if we have more results
    const hasMore = submissions.length > take;
    const data = hasMore ? submissions.slice(0, limit) : submissions;
    
    // Process submissions based on user plan
    const processedSubmissions = data.map(submission => {
      const submissionData = submission.data as any;
      
      if (submissionData && submissionData._meta) {
        const { _meta, ...restData } = submissionData;
        
        // For FREE plan, completely remove all _meta data
        if (userPlan === 'FREE') {
          return {
            ...submission,
            data: restData, // No _meta at all for FREE plan
          };
        }
        
        // For STANDARD and PRO plans, provide sanitized metadata
        const sanitizedMeta = {
          // Keep only country and browser info, which are less identifiable
          browser: _meta.browser || 'Unknown',
          country: _meta.country || 'Unknown',
          // Include timestamp as it's useful for analytics but not personally identifiable
          timestamp: _meta.timestamp,
        };
        
        return {
          ...submission,
          data: {
            ...restData,
            _meta: sanitizedMeta
          },
        };
      }
      
      return submission;
    });
    
    return NextResponse.json({
      submissions: processedSubmissions,
      nextCursor: hasMore && data.length > 0 ? data[data.length - 1]?.id : undefined,
      plan: userPlan,
    });
  } catch (error) {
    console.error('Error in form submissions endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 