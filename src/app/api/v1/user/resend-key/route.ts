import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateResendKeySchema = z.object({
  resendApiKey: z.string().min(1, 'Resend API key is required'),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { resendApiKey } = updateResendKeySchema.parse(body);

    // Get user's current plan
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Only allow STANDARD and PRO users to set their own Resend API key
    if (user.plan !== 'STANDARD' && user.plan !== 'PRO') {
      return NextResponse.json(
        { message: 'This feature is only available for STANDARD and PRO users' },
        { status: 403 }
      );
    }

    // Update user's Resend API key
    await db.user.update({
      where: { id: session.user.id },
      data: { resendApiKey },
    });

    return NextResponse.json({ message: 'Resend API key updated successfully' });
  } catch (error) {
    console.error('Error updating Resend API key:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { resendApiKey: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ resendApiKey: user.resendApiKey });
  } catch (error) {
    console.error('Error fetching Resend API key:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 