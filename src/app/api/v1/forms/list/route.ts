import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from "@/lib/db";
import { ratelimitConfig } from '@/lib/ratelimiter';

const requestSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
  cursor: z.string().optional().default(''),
  apiKey: z.string(),
});

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    
    // Accept API key from header (preferred) or query parameter (fallback)
    const apiKeyHeader = req.headers.get('X-API-Key');
    const apiKeyQuery = searchParams.get('apiKey');
    const apiKey = apiKeyHeader || apiKeyQuery;
    
    const limitParam = searchParams.get('limit') || '50'; // Default to 50 if not provided
    const cursor = searchParams.get('cursor') || ''; // Default to empty string if not provided

    // Validate parameters
    const result = requestSchema.safeParse({
      limit: limitParam,
      cursor: cursor,
      apiKey: apiKey,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors.map(e => e.message).join(', ') },
        { status: 400 }
      );
    }

    const { limit, apiKey: validatedApiKey, cursor: validatedCursor } = result.data;

    // Apply rate limiting
    if (ratelimitConfig.enabled && ratelimitConfig.ratelimit) {
      const identifier = `api_v1_forms_list_${validatedApiKey}`;
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
    //const userPlan = user.plan;

    // Get forms with pagination
    const take = limit + 1;
    
    const forms = await db.form.findMany({
      where: { userId },
      take,
      cursor: validatedCursor ? { id: validatedCursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { submissions: true }
        }
      }
    });
    
    // Check if we have more results
    const hasMore = forms.length > limit;
    const data = hasMore ? forms.slice(0, limit) : forms;
    
    return NextResponse.json({
      forms: data.map(form => ({
        id: form.id,
        name: form.name,
        description: form.description,
        submissionCount: form._count.submissions,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
      })),
      nextCursor: hasMore && data.length > 0 ? data[data.length - 1]?.id : undefined,
    });
  } catch (error) {
    console.error('Error in forms list endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 