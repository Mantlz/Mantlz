import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { exportFormSubmissions } from "@/services/export-service";
import { z } from "zod";
import { ratelimitConfig } from "@/lib/ratelimiter";
import { db } from "@/lib/db";

const exportRequestSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Helper function to handle export logic
async function handleExport(formId: string, userId: string, startDate?: string, endDate?: string) {
  try {
    // 1. Verify form ownership
    const form = await db.form.findFirst({
      where: {
        id: formId,
        userId,
      },
      select: {
        id: true,
        name: true,
        userId: true
      }
    });

    if (!form) {
      
      return new NextResponse("Form not found or access denied", { status: 403 });
    }

   

   
    // 2. Apply rate limiting
    if (ratelimitConfig.enabled && ratelimitConfig.ratelimit) {
      const identifier = `export_${userId}_${formId}`;


      const { success, limit, reset, remaining } = await ratelimitConfig.ratelimit.limit(identifier);
      
     

      if (!success) {
       

        return new NextResponse(
          `Rate limit exceeded. Please try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds.`,
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            }
          }
        );
      }
    }

    // 3. Process export
    const result = await exportFormSubmissions({
      formId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

   

    return new NextResponse(result.data, {
      headers: {
        "Content-Type": result.contentType,
        "Content-Disposition": `attachment; filename="${result.filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
    });
  } catch (error) {
    console.error("❌ Export Processing Error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      formId,
      userId
    });
    throw error;
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      ("🚫 Unauthorized Access Attempt");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Get query parameters
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    // 3. Get formId from params
    const { formId } = await params;

    return handleExport(formId, userId, startDate, endDate);
  } catch (error) {
    console.error("❌ Export Error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      formId: (await params).formId
    });
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      ("🚫 Unauthorized Access Attempt");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Validate request body
    const body = await req.json();
    const { startDate, endDate } = exportRequestSchema.parse(body);

    // 3. Get formId from params
    const { formId } = await params;

    return handleExport(formId, userId, startDate, endDate);
  } catch (error) {
    console.error("❌ Export Error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      formId: (await params).formId
    });
    return new NextResponse("Internal Error", { status: 500 });
  }
} 