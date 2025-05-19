import { StripeService } from '@/services/stripe-service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles Stripe OAuth callback after a user connects their Stripe account
 * 
 * Query parameters:
 * - code: OAuth authorization code from Stripe
 * - state: Encrypted state containing user ID for verification
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    // Validate required parameters
    if (!code || !state) {
      console.error('Missing required OAuth parameters:', { code: !!code, state: !!state });
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/forms/settings?error=invalid_request`
      );
    }
    
    // Process the OAuth callback
    await StripeService.handleOAuthCallback(code, state);
    
    // Redirect to success page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/forms/settings?tab=stripe&success=true`
    );
  } catch (error: Error | unknown) {
    console.error('Error in Stripe OAuth callback:', error);
    
    // Redirect with error parameter
    const errorMessage = encodeURIComponent(error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/forms/settings?tab=stripe&error=${errorMessage}`
    );
  }
} 