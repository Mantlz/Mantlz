import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from "@/lib/db";
import { ratelimitConfig } from '@/lib/ratelimiter';
import { NotificationType, NotificationStatus, Prisma } from '@prisma/client';

// Simplified schema - only apiKey is required
const requestSchema = z.object({
  apiKey: z.string(),
  limit: z.coerce.number().min(1).max(100).default(50),
  cursor: z.string().optional().default(''),
  // Remove type and status from validation entirely
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    // Get the formId from the URL parameters
    const { formId } = await params;

    // Get query parameters
    const { searchParams } = new URL(req.url);
    
    // Accept API key from header (preferred) or query parameter (fallback)
    const apiKeyHeader = req.headers.get('X-API-Key');
    const apiKeyQuery = searchParams.get('apiKey');
    const apiKey = apiKeyHeader || apiKeyQuery;
    
    const limitParam = searchParams.get('limit') || '50';
    const cursor = searchParams.get('cursor') || '';
    const type = searchParams.get('type') as NotificationType | null;
    const status = searchParams.get('status') as NotificationStatus | null;

    // Validate only the required parameters
    const result = requestSchema.safeParse({
      apiKey: apiKey,
      limit: limitParam,
      cursor: cursor,
      // Don't validate type and status
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
      const identifier = `api_v1_forms_logs_${validatedApiKey}_${formId}`;
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
    
    // Only PRO users can access logs
    if (userPlan !== 'PRO') {
      return NextResponse.json(
        { error: "Notification logs are only available with the PRO plan" },
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

    // Build the where clause for notification logs
    const where: Prisma.NotificationLogWhereInput = { 
      formId,
    };

    // Only add type and status filters if they are valid values
    if (type && 
        ['SUBMISSION_CONFIRMATION', 'DEVELOPER_NOTIFICATION'].includes(type)) {
      where.type = type;
    }
    
    if (status && 
        ['SENT', 'FAILED', 'SKIPPED'].includes(status)) {
      where.status = status;
    }
    
    // Get logs with pagination
    const take = limit + 1;
    
    const logs = await db.notificationLog.findMany({
      where,
      take,
      cursor: validatedCursor ? { id: validatedCursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        submission: {
          select: {
            id: true,
            email: true,
            createdAt: true,
          }
        }
      }
    });
    
    // Check if we have more results
    const hasMore = logs.length > take;
    const data = hasMore ? logs.slice(0, limit) : logs;
    
    return NextResponse.json({
      logs: data.map(log => ({
        id: log.id,
        type: log.type,
        status: log.status,
        error: log.error,
        createdAt: log.createdAt,
        submissionId: log.submissionId,
        submission: log.submission ? {
          id: log.submission.id,
          email: log.submission.email,
          createdAt: log.submission.createdAt,
        } : null,
      })),
      nextCursor: hasMore && data.length > 0 ? data[data.length - 1]?.id : undefined,
    });
  } catch (error) {
    console.error('Error in form notification logs endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 