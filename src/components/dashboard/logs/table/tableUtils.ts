"use client"

import { client } from "@/lib/client"
import { FormsResponse, SubmissionResponse, Submission } from "./types"

/**
 * Fetches user forms
 */
export async function fetchUserForms(page: number = 1, itemsPerPage: number = 8): Promise<FormsResponse> {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const response = await client.forms.getUserForms.$get({
      limit: 50, // Still fetch all forms to support client-side pagination
    })

    const responseData = await response.json()
    const forms = responseData.forms.map((form: any) => ({
      id: form.id,
      name: form.name,
      description: form.description,
      submissionCount: form.submissionCount,
      createdAt: new Date(form.createdAt),
      updatedAt: new Date(form.updatedAt),
    }));

    return {
      forms,
      nextCursor: responseData.nextCursor,
      pagination: {
        total: forms.length,
        totalPages: Math.ceil(forms.length / itemsPerPage),
        currentPage: page
      }
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
  page: number = 1, 
  startDate?: string, 
  endDate?: string,
  itemsPerPage: number = 8
): Promise<SubmissionResponse> {
  if (!formId) {
    return {
      submissions: [],
      pagination: {
        total: 0,
        pages: 1,
        currentPage: 1,
        totalPages: 1
      },
      formId: null
    };
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const response = await client.forms.getSubmissionLogs.$get({
      formId,
      page,
      limit: itemsPerPage, // Use itemsPerPage parameter
      startDate,
      endDate,
    });

    // Cast to any first to avoid TypeScript errors during transformation
    const responseData = await response.json() as any;
    
    // Ensure we have a consistent pagination structure
    let pagination = responseData.pagination || {};
    
    // Convert pages to totalPages if needed
    if (pagination.pages && !pagination.totalPages) {
      pagination.totalPages = pagination.pages;
    } else if (!pagination.totalPages) {
      // Fallback calculation if totalPages is missing
      pagination.totalPages = Math.ceil((pagination.total || 0) / itemsPerPage) || 1;
    }
    
    // Make sure the response has the format we expect
    const result: SubmissionResponse = {
      submissions: (responseData.submissions || []) as Submission[],
      pagination: {
        total: pagination.total || 0,
        pages: pagination.pages || 1,
        currentPage: pagination.currentPage || page,
        totalPages: pagination.totalPages || 1
      },
      formId
    };
    
    return result;
  } catch (error) {
    console.error("Error fetching submissions:", error)
    throw error
  }
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