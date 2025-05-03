import { NextRequest, NextResponse } from 'next/server';
import { EmailTrackingService } from '@/services/email-tracking-service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sentEmailId = searchParams.get('sentEmailId');

  if (!sentEmailId) {
    return new NextResponse('Missing sentEmailId', { status: 400 });
  }

  try {
    // Record the open using the service
    await EmailTrackingService.trackEmailOpen({ sentEmailId });

    // Return a 1x1 transparent pixel
    const pixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64'
    );

    return new NextResponse(pixel, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error recording email open:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 