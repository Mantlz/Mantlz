import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { StripeService } from "@/services/stripe-service";
import { db } from "@/lib/db";
import { Plan } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    console.log('Stripe connect API route called');
    
    // Get user from auth
    const { userId } = await auth();
    console.log('Auth userId:', userId);
    
    if (!userId) {
      console.log('No userId found in auth');
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Check if user is on PRO plan
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, plan: true }
    });
    console.log('Found user:', user);
    
    if (!user) {
      console.log('User not found in database');
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    if (user.plan !== Plan.PRO) {
      console.log('User is not on PRO plan');
      return NextResponse.json(
        { error: "Stripe connection is only available for PRO users" },
        { status: 403 }
      );
    }

    // Get redirect URL from query params
    const url = new URL(req.url);
    const redirectUrl = url.searchParams.get("redirectUrl");
    console.log('Redirect URL from params:', redirectUrl);
    
    // Generate OAuth link
    console.log('Generating OAuth link for user:', user.id);
    const result = await StripeService.generateConnectOAuthLink(
      user.id,
      redirectUrl || undefined
    );
    console.log('Generated OAuth link:', result.link);
    
    // Redirect to Stripe OAuth page
    return NextResponse.redirect(result.link);
  } catch (error: any) {
    console.error("Error in Stripe connect API route:", error);
    
    return NextResponse.json(
      { error: error.message || "Failed to generate Stripe connect link" },
      { status: 500 }
    );
  }
} 