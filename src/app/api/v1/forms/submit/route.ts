import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const submitSchema = z.object({
  type: z.string(),
  formId: z.string(),
  apiKey: z.string(),
  data: z.record(z.any()),
});

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body from the request
    const body = await request.json();
    const { type, formId, apiKey, data } = submitSchema.parse(body);

    // Validate API key
    if (apiKey !== process.env.MANTLZ_KEY) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Process the form submission based on form ID
    console.log(`Form submission of type ${type} received for ${formId}:`, data);

    // Here you would typically:
    // 1. Store the submission in your database
    // 2. Send notifications or emails
    // 3. Trigger any additional workflows

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      formId,
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to process form submission' },
      { status: 500 }
    );
  }
} 