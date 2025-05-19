import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { StripeService } from "@/services/stripe-service";
import { db } from "@/lib/db";
import { Plan } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    // Get user from auth
    const { userId } = await auth();
    
    if (!userId) {
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
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    if (user.plan !== Plan.PRO) {
      return NextResponse.json(
        { error: "Stripe connection is only available for PRO users" },
        { status: 403 }
      );
    }

    // Get redirect URL from query params
    const url = new URL(req.url);
    const redirectUrl = url.searchParams.get("redirectUrl");
    
    // Generate OAuth link
    const result = await StripeService.generateConnectOAuthLink(
      user.id,
      redirectUrl || undefined
    );
    
    // Redirect to Stripe OAuth page
    return NextResponse.redirect(result.link);
  } catch (error: any) {
    console.error("Error generating Stripe connect link:", error);
    
    return NextResponse.json(
      { error: error.message || "Failed to generate Stripe connect link" },
      { status: 500 }
    );
  }
} 