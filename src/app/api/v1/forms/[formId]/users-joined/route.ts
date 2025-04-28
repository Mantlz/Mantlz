import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateApiKey } from '@/lib/auth-utils';
import { addCorsHeadersToResponse } from '@/utils/cors';

interface FormSettings {
  usersJoined?: {
    enabled: boolean;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    // Validate API key
    const apiKey = request.headers.get('X-API-Key');
    if (!apiKey) {
      const response = NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
      return addCorsHeadersToResponse(response, request);
    }

    // Validate the API key
    const validApiKey = await validateApiKey(apiKey);
    if (!validApiKey) {
      const response = NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
      return addCorsHeadersToResponse(response, request);
    }

    // Get the formId from params
    const { formId } = await params;
    
    // Find the form by ID
    const form = await db.form.findUnique({
      where: { id: formId },
      select: {
        id: true,
        formType: true,
        settings: true,
        _count: {
          select: {
            submissions: true
          }
        }
      },
    });

    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // Get users joined settings
    const usersJoined = (form.settings as FormSettings)?.usersJoined || { enabled: false };
    const submissionCount = form._count.submissions;
    
    // Only return the count if the feature is enabled
    const response = NextResponse.json({
      formId: form.id,
      count: usersJoined.enabled ? submissionCount : 0
    });
    return addCorsHeadersToResponse(response, request);
  } catch (error) {
    console.error('Error in users-joined endpoint:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return addCorsHeadersToResponse(response, request);
  }
} 