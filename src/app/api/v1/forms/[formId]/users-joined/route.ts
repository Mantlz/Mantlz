import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateApiKey } from '@/lib/auth-utils';

interface FormSettings {
  usersJoined?: {
    enabled: boolean;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    // Validate API key
    const apiKey = request.headers.get('X-API-Key');
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    // Validate the API key
    const validApiKey = await validateApiKey(apiKey);
    if (!validApiKey) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Get the formId from params and ensure it's properly awaited
    const { formId } = await Promise.resolve(params);
    
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
    return NextResponse.json({
      formId: form.id,
      count: usersJoined.enabled ? submissionCount : 0
    });
  } catch (error) {
    console.error('Error fetching users joined count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users joined count' },
      { status: 500 }
    );
  }
} 