import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from "@/lib/db";
import { FormType } from "@prisma/client";
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
  products?: string[];
  displayMode?: string;
  productIds?: string[];
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
    
    // Get the form type enum and create a lowercase string version
    const formTypeEnum = form.formType as FormType;
    const formType = formTypeEnum.toLowerCase();
    
    // Parse the schema to extract fields (restore this logic)
    const fields = [];
    try {
      const schema = JSON.parse(form.schema) as FormSchema;
      for (const [key, value] of Object.entries(schema)) {
        if (typeof value === 'object' && value !== null && 'type' in value) {
          const field = {
            id: key,
            name: key,
            label: value.label || key.charAt(0).toUpperCase() + key.slice(1),
            type: value.type || 'text',
            required: value.required || false,
            placeholder: value.placeholder || '',
            options: value.options || undefined,
          };

          // Add product data for product fields
          if (value.type === 'product' && value.products) {
            Object.assign(field, {
              products: value.products,
              displayMode: value.displayMode || 'grid',
              productIds: value.productIds || []
            });
          }

          fields.push(field);
        } else {
          console.warn(`Skipping unexpected schema item: ${key}`);
        }
      }
    } catch (error) {
      console.error('Error parsing form schema:', error);
    }
    
    // Check if users joined settings exists in form settings
    const settings = form.settings as FormSettings || {};
    const usersJoinedSettings = settings?.usersJoined ? {
      enabled: settings.usersJoined.enabled || false,
      count: await db.submission.count({ where: { formId } })
    } : null;
    
    // Get form type specific configuration
    const formTypeConfig = getFormTypeConfig(formTypeEnum);
    
    return NextResponse.json({
      id: form.id,
      name: form.name,
      title: form.name,
      description: form.description,
      formType,
      formTypeDisplay: formTypeConfig.displayName,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
      submissionCount: form._count.submissions,
      fields,
      emailSettings: {
        enabled: form.emailSettings?.enabled || false,
        developerNotificationsEnabled: form.emailSettings?.developerNotificationsEnabled || false,
      },
      usersJoinedSettings,
      formTypeSpecific: formTypeConfig.specificConfig
    });
  } catch (error) {
    console.error('Error in form details endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get form type specific configuration
function getFormTypeConfig(formType: FormType) {
  const config = {
    displayName: formType.toString(),
    specificConfig: {}
  };
  
  switch (formType) {
    case FormType.SURVEY:
      config.displayName = 'Survey';
      config.specificConfig = {
        surveyVersion: '1.0',
        supportsAnalytics: true
      };
      break;
      
    case FormType.FEEDBACK:
      config.displayName = 'Feedback';
      config.specificConfig = {
        supportsRating: true
      };
      break;
      
    case FormType.ANALYTICS_OPT_IN:
      config.displayName = 'Analytics Opt-In';
      config.specificConfig = {
        cookieConsent: true,
        dataPrivacy: true
      };
      break;
      
    case FormType.ORDER:
      config.displayName = 'Order Form';
      config.specificConfig = {
        supportsPayment: false, // Future feature
        shippingRequired: true
      };
      break;
      
    case FormType.RSVP:
      config.displayName = 'RSVP';
      config.specificConfig = {
        attendanceTracking: true
      };
      break;
      
    case FormType.WAITLIST:
      config.displayName = 'Waitlist';
      break;
      
    case FormType.CONTACT:
      config.displayName = 'Contact';
      break;
      
    case FormType.APPLICATION:
      config.displayName = 'Application';
      break;
      
    case FormType.CUSTOM:
      config.displayName = 'Custom Form';
      break;
  }
  
  return config;
} 