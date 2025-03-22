import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateApiKey } from '@/lib/utils';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';

const createApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name } = createApiKeySchema.parse(body);
    
    const apiKey = await db.apiKey.create({
      data: {
        name,
        key: generateApiKey(),
        userId,
      }
    });

    return NextResponse.json(apiKey);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
} 