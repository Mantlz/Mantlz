"use client"

import { client } from "@/lib/client"
import { FormsResponse, SubmissionResponse, Submission } from "./types"

/**
 * Fetches user forms
 */
export async function fetchUserForms(): Promise<FormsResponse> {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const response = await client.forms.getUserForms.$get({
      limit: 50,
    })

    const responseData = await response.json()

    return {
      forms: responseData.forms.map((form: any) => ({
        id: form.id,
        name: form.name,
        description: form.description,
        submissionCount: form.submissionCount,
        createdAt: new Date(form.createdAt),
        updatedAt: new Date(form.updatedAt),
      })),
      nextCursor: responseData.nextCursor,
    }
  } catch (error) {
    console.error("Error fetching forms:", error)
    throw error
  }
}

/**
 * Fetches submissions for a specific form
 */
export async function fetchSubmissions(
  formId: string | null, 
  page: number, 
  startDate?: string, 
  endDate?: string
): Promise<SubmissionResponse> {
  if (!formId) {
    return {
      submissions: [],
      pagination: {
        total: 0,
        pages: 1,
        currentPage: 1
      },
    };
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  const response = await client.forms.getSubmissionLogs.$get({
    formId,
    page,
    limit: 5,
    startDate,
    endDate,
  });

  const responseData = await response.json();
  return responseData as unknown as SubmissionResponse;
}

/**
 * Enhances submission data with analytics
 */
export function enhanceSubmissions(submissions: Submission[]): Submission[] {
  return submissions.map(submission => {
    const data = submission.data as any;
    const meta = data?._meta || {};
    return {
      ...submission,
      analytics: {
        browser: meta.browser || 'Unknown',
        location: meta.country || 'Unknown',
      }
    };
  });
}

// Add a utility function for safely working with searchParams
export function safeSearchParamsToString(searchParams: any): string {
  try {
    if (typeof searchParams?.toString === 'function') {
      return searchParams.toString();
    }
  } catch (e) {
    console.error('Error converting searchParams to string:', e);
  }
  return '';
} 