import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Get the current user's API key from your database
    const apiKey = await db.apiKey.findFirst({
      where: {
        // Add your conditions here
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(apiKey);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch API key' },
      { status: 500 }
    );
  }
} 