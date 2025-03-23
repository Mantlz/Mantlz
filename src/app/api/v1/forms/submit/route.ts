import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from "@/lib/db";

const submitSchema = z.object({
  type: z.string(),
  formId: z.string(),
  apiKey: z.string(),
  data: z.record(z.any()),
});

// Function to validate API key against database
async function isValidApiKey(apiKey: string): Promise<boolean> {
  // Ensure the environment variable exists as a fallback
  if (!process.env.MANTLZ_KEY) {
    console.error('MANTLZ_KEY environment variable is not set');
    return false;
  }
  
  try {
    // Check if the API key exists in the database and is active
    const apiKeyRecord = await db.apiKey.findFirst({
      where: {
        key: apiKey,
        isActive: true
      }
    });
    
    if (!apiKeyRecord) {
      console.warn('API key not found in database or inactive');
      return false;
    }
    
    // Update last used timestamp
    await db.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() }
    });
    
    console.log(`Valid API key used: ${apiKeyRecord.id}`);
    return true;
  } catch (error) {
    console.error('Error validating API key:', error);
    
    // Fallback to environment variable if database check fails
    const isValid = apiKey === process.env.MANTLZ_KEY;
    console.log(`Fallback validation ${isValid ? 'succeeded' : 'failed'}`);
    return isValid;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body from the request
    const body = await request.json();
    const { type, formId, apiKey, data } = submitSchema.parse(body);

    // Validate API key with database check
    if (!(await isValidApiKey(apiKey))) {
      console.warn('Invalid API key attempt:', apiKey.substring(0, 4) + '***');
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Process the form submission based on form ID
    console.log(`Form submission of type ${type} received for ${formId}:`, data);

    // Store the submission in the database
    const email = data.email || null; // Extract email from form data
    const submission = await db.submission.create({
      data: {
        formId,
        data,
        email, // Add the extracted email
      }
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      submissionId: submission.id,
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