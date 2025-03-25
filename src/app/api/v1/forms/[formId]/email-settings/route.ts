import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { Plan, Form, Prisma } from '@prisma/client';

const emailSettingsSchema = z.object({
  enabled: z.boolean(),
  fromEmail: z.string().email().optional(),
  subject: z.string().optional(),
  template: z.string().optional(),
  replyTo: z.string().email().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const { formId } = params;
    const body = await req.json();
    const settings = emailSettingsSchema.parse(body);

    // Get form with user data
    const form = await db.form.findUnique({
      where: { id: formId },
      include: {
        user: {
          select: {
            plan: true
          }
        }
      }
    }) as (Form & { user: { plan: Plan }; emailSettings: Prisma.JsonValue | null }) | null;

    if (!form) {
      return NextResponse.json(
        { message: 'Form not found' },
        { status: 404 }
      );
    }

    // Only allow STANDARD and PRO users to configure email settings
    if (form.user.plan !== Plan.STANDARD && form.user.plan !== Plan.PRO) {
      return NextResponse.json(
        { message: 'Email settings are only available for STANDARD and PRO users' },
        { status: 403 }
      );
    }

    // Update form email settings
    await db.form.update({
      where: { id: formId },
      data: {
        emailSettings: settings as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ message: 'Email settings updated successfully' });
  } catch (error) {
    console.error('Error updating email settings:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const { formId } = params;

    const form = await db.form.findUnique({
      where: { id: formId },
      include: {
        user: {
          select: {
            plan: true
          }
        }
      }
    }) as (Form & { user: { plan: Plan }; emailSettings: Prisma.JsonValue | null }) | null;

    if (!form) {
      return NextResponse.json(
        { message: 'Form not found' },
        { status: 404 }
      );
    }

    // Only allow STANDARD and PRO users to view email settings
    if (form.user.plan !== Plan.STANDARD && form.user.plan !== Plan.PRO) {
      return NextResponse.json(
        { message: 'Email settings are only available for STANDARD and PRO users' },
        { status: 403 }
      );
    }

    return NextResponse.json({ emailSettings: form.emailSettings });
  } catch (error) {
    console.error('Error fetching email settings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 