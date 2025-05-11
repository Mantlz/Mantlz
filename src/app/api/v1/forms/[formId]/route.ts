import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from "@/lib/db";
import { ratelimitConfig } from '@/lib/ratelimiter';

const requestSchema = z.object({
  apiKey: z.string(),
});

// Define types for form schema and fields
interface FormFieldSchema {
  type: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

interface FormSchema {
  [key: string]: FormFieldSchema;
}

interface FormSettings {
  usersJoined?: {
    enabled: boolean;
  };
}

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

    // Validate parameters
    const result = requestSchema.safeParse({
      apiKey: apiKey,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors.map(e => e.message).join(', ') },
        { status: 400 }
      );
    }

    const { apiKey: validatedApiKey } = result.data;

    // Apply rate limiting
    if (ratelimitConfig.enabled && ratelimitConfig.ratelimit) {
      const identifier = `api_v1_forms_get_${validatedApiKey}_${formId}`;
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
    
    // Verify form belongs to this user
    const form = await db.form.findUnique({
      where: {
        id: formId,
        userId,
      },
      include: {
        _count: {
          select: {
            submissions: true,
          },
        },
        emailSettings: true,
      },
    });
    
    if (!form) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      );
    }
    
    // Use the formType directly from the database
    const formType = form.formType.toLowerCase();
    
    // Parse the schema to extract fields (restore this logic)
    const fields = [];
    try {
      const schema = JSON.parse(form.schema) as FormSchema;
      for (const [key, value] of Object.entries(schema)) {
        // Ensure value is an object and has expected properties before pushing
        if (typeof value === 'object' && value !== null && 'type' in value) {
          fields.push({
            id: key,
            name: key,
            label: value.label || key.charAt(0).toUpperCase() + key.slice(1),
            type: value.type || 'text',
            required: value.required || false,
            placeholder: value.placeholder || '',
            options: value.options || undefined,
          });
        } else {
          // Handle cases where the schema item isn't structured as expected
          console.warn(`Skipping unexpected schema item: ${key}`);
        }
      }
    } catch (error) {
      console.error('Error parsing form schema:', error);
       // Handle the error, e.g., return empty fields or an error state
    }
    
    // Check if users joined settings exists in form settings
    const settings = form.settings as FormSettings || {};
    const usersJoinedSettings = settings?.usersJoined ? {
      enabled: settings.usersJoined.enabled || false,
      count: await db.submission.count({ where: { formId } })
    } : null;
    
    return NextResponse.json({
      id: form.id,
      name: form.name,
      title: form.name,
      description: form.description,
      formType,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
      submissionCount: form._count.submissions,
      fields,
      emailSettings: {
        enabled: form.emailSettings?.enabled || false,
        developerNotificationsEnabled: form.emailSettings?.developerNotificationsEnabled || false,
      },
      usersJoinedSettings,
    });
  } catch (error) {
    console.error('Error in form details endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 