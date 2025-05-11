import { NextResponse } from 'next/server';
import { EmailTrackingService } from '@/services/email-tracking-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sentEmailId = searchParams.get('sentEmailId');
  const url = searchParams.get('url');

  if (!sentEmailId || !url) {
    return new NextResponse('Missing required parameters', { status: 400 });
  }

  try {
    // Record the click using the service
    await EmailTrackingService.trackEmailClick({ sentEmailId });

    // Redirect to the original URL
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Error recording email click:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 