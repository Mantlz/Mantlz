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
      console.log("🚫 Invalid Form Access Attempt:", {
        formId,
        userId,
        error: "Form not found or user does not own the form"
      });
      return new NextResponse("Form not found or access denied", { status: 403 });
    }

    console.log("✅ Form Access Granted:", {
      formId,
      formName: form.name,
      userId
    });

    console.log("🔒 Rate Limiting Check:", {
      enabled: ratelimitConfig.enabled,
      hasRatelimit: !!ratelimitConfig.ratelimit,
      userId,
      formId
    });

    // 2. Apply rate limiting
    if (ratelimitConfig.enabled && ratelimitConfig.ratelimit) {
      const identifier = `export_${userId}_${formId}`;
      console.log("📝 Rate Limit Identifier:", identifier);

      const { success, limit, reset, remaining } = await ratelimitConfig.ratelimit.limit(identifier);
      
      console.log("⚖️ Rate Limit Result:", {
        success,
        limit,
        remaining,
        resetTime: new Date(reset).toISOString(),
        timeUntilReset: Math.ceil((reset - Date.now()) / 1000) + " seconds"
      });

      if (!success) {
        console.log("⚠️ Rate Limit Exceeded:", {
          userId,
          formId,
          remaining,
          resetTime: new Date(reset).toISOString()
        });

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

    console.log("📤 Processing Export:", {
      formId,
      startDate,
      endDate,
      userId
    });

    // 3. Process export
    const result = await exportFormSubmissions({
      formId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    console.log("✅ Export Completed:", {
      formId,
      filename: result.filename,
      contentType: result.contentType
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
  context: { params: { formId: string } }
) {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      console.log("🚫 Unauthorized Access Attempt");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Get query parameters
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    // 3. Get formId from params
    const formId = context.params.formId;

    return handleExport(formId, userId, startDate, endDate);
  } catch (error) {
    console.error("❌ Export Error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      formId: context.params.formId
    });
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      console.log("🚫 Unauthorized Access Attempt");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Validate request body
    const body = await req.json();
    const { startDate, endDate } = exportRequestSchema.parse(body);

    // 3. Get formId from params
    const formId = params.formId;

    return handleExport(formId, userId, startDate, endDate);
  } catch (error) {
    console.error("❌ Export Error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      formId: params.formId
    });
    return new NextResponse("Internal Error", { status: 500 });
  }
} 