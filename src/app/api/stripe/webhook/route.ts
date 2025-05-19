import { StripeService } from '@/services/stripe-service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') || '';
    
    // Process the webhook event
    const result = await StripeService.handleWebhook(body, signature);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error handling Stripe webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 400 }
    );
  }
}

// Disable body parsing for this endpoint - we need the raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
}; 