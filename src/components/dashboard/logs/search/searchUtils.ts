"use client"

import { client } from "@/lib/client"
import { Form, SearchResult, Submission, NotificationLog } from "./types"

/**
 * Fetches user forms
 */
export async function fetchUserForms() {
  try {
    const response = await client.forms.getUserForms.$get({
      limit: 50
    })
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching forms:", error)
    return { forms: [] }
  }
}

// Define interfaces for advanced filters
interface AdvancedFilters {
  dateRange?: { from: Date | undefined; to?: Date | undefined };
  showOnlyWithAttachments?: boolean;
  sortOrder?: 'newest' | 'oldest';
  timeFrame?: 'all' | '24h' | '7d' | '30d';
  hasEmail?: boolean;
  browser?: string;
  location?: string;
}

// Define form data interface
interface FormsData {
  forms: Form[];
}

/**
 * Main search function that directs search to specific, all, or multiple forms
 */
export async function performSearch(
  searchTerm: string, 
  formId: string | null,
  formsData?: FormsData,
  advancedFilters?: AdvancedFilters
): Promise<SearchResult> {
  if (!searchTerm || searchTerm.trim() === "") {
    return { submissions: [] }
  }

  // Log what's happening to debug
  console.log("Performing search with:", { 
    searchTerm, 
    formId, 
    hasAdvancedFilters: !!advancedFilters,
    filters: advancedFilters
  })

  try {
    if (formId) {
      return await searchInSpecificForm(searchTerm, formId, advancedFilters)
    } else {
      return await searchAcrossAllForms(searchTerm, formsData, advancedFilters)
    }
  } catch (error) {
    console.error("All search attempts failed:", error)
    return { submissions: [] }
  }
}

/**
 * Search submissions within a specific form
 */
export async function searchInSpecificForm(
  searchTerm: string, 
  formId: string,
  advancedFilters?: AdvancedFilters
): Promise<SearchResult> {
  try {
    // Log to debug specific form search
    console.log("Searching in specific form with filters:", { formId, advancedFilters })
    
    const apiPath = `/api/forms/getSubmissionLogs`
    const searchParams = new URLSearchParams()
    searchParams.append('formId', formId)
    searchParams.append('search', searchTerm)
    searchParams.append('page', '1')
    searchParams.append('limit', '10')
    
    // Add advanced filters if available
    if (advancedFilters) {
      // Add date range
      if (advancedFilters.dateRange?.from) {
        searchParams.append('startDate', advancedFilters.dateRange.from.toISOString())
      }
      if (advancedFilters.dateRange?.to) {
        searchParams.append('endDate', advancedFilters.dateRange.to.toISOString())
      }
      
      // Add time frame as an alternative date filter
      if (advancedFilters.timeFrame && advancedFilters.timeFrame !== 'all') {
        const now = new Date()
        const startDate = new Date()
        
        switch(advancedFilters.timeFrame) {
          case '24h':
            startDate.setHours(now.getHours() - 24)
            break
          case '7d':
            startDate.setDate(now.getDate() - 7)
            break
          case '30d':
            startDate.setDate(now.getDate() - 30)
            break
        }
        
        if (!advancedFilters.dateRange?.from) {
          searchParams.append('startDate', startDate.toISOString())
        }
      }
      
      // Add other filters as query parameters
      if (advancedFilters.hasEmail === true) {
        searchParams.append('hasEmail', 'true')
      }
      
      if (advancedFilters.browser) {
        searchParams.append('browser', advancedFilters.browser)
      }
      
      if (advancedFilters.location) {
        searchParams.append('location', advancedFilters.location)
      }
      
      // Sort order
      if (advancedFilters.sortOrder) {
        searchParams.append('sortOrder', advancedFilters.sortOrder)
      }
    }
    
    const response = await fetch(`${apiPath}?${searchParams.toString()}`)
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`)
    }
    
    // Get the response as text first
    const responseText = await response.text()
    console.log("Raw API response:", responseText)
    
    // Try to parse the response as JSON
    try {
      const responseData = JSON.parse(responseText) as Record<string, unknown>
      
      // Handle superjson format
      if (responseData.json && responseData.meta) {
        const data = responseData.json as { submissions?: unknown[] }
        
        if (data.submissions && Array.isArray(data.submissions)) {
          const mappedSubmissions = data.submissions.map((submission) => 
            mapSubmissionData(formId)(submission)
          )
          console.log(`Found ${mappedSubmissions.length} submissions in superjson format`)
          return { submissions: mappedSubmissions }
        }
      }
      
      // Handle regular JSON format
      if (responseData.submissions && Array.isArray(responseData.submissions)) {
        const mappedSubmissions = (responseData.submissions as unknown[]).map((submission) => 
          mapSubmissionData(formId)(submission)
        )
        console.log(`Found ${mappedSubmissions.length} submissions in regular format`)
        return { submissions: mappedSubmissions }
      }

      // If we have a pagination object, data might be in a different format
      if (responseData.pagination && responseData.data && Array.isArray(responseData.data)) {
        const mappedSubmissions = (responseData.data as unknown[]).map((submission) => 
          mapSubmissionData(formId)(submission)
        )
        console.log(`Found ${mappedSubmissions.length} submissions in pagination format`)
        return { submissions: mappedSubmissions }
      }
      
      console.log("No submissions found in response", responseData)
      return { submissions: [] }
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", parseError)
      return { submissions: [] }
    }
  } catch (error) {
    console.error("Form-specific search failed:", error)
    return { submissions: [] }
  }
}

/**
 * Search submissions across all forms
 */
export async function searchAcrossAllForms(
  searchTerm: string, 
  formsData?: FormsData,
  advancedFilters?: AdvancedFilters
): Promise<SearchResult> {
  try {
    // Log to debug advanced filters application
    console.log("Searching across all forms with filters:", advancedFilters)
    
    // Ensure query parameter is always set
    const params: {
      query: string,
      [key: string]: unknown
    } = { 
      query: searchTerm 
    };
    
    // Add advanced filters if they exist
    if (advancedFilters) {
      if (advancedFilters.dateRange?.from) {
        params.startDate = advancedFilters.dateRange.from.toISOString();
      }
      if (advancedFilters.dateRange?.to) {
        params.endDate = advancedFilters.dateRange.to.toISOString();
      }
      
      // Handle time frame filter
      if (advancedFilters.timeFrame && advancedFilters.timeFrame !== 'all') {
        const now = new Date();
        const startDate = new Date();
        
        switch(advancedFilters.timeFrame) {
          case '24h':
            startDate.setHours(now.getHours() - 24);
            break;
          case '7d':
            startDate.setDate(now.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(now.getDate() - 30);
            break;
        }
        
        if (!params.startDate) {
          params.startDate = startDate.toISOString();
        }
      }
      
      // Add other filters
      if (advancedFilters.hasEmail === true) {
        params.hasEmail = 'true';
      }
      
      if (advancedFilters.browser) {
        params.browser = advancedFilters.browser;
      }
      
      if (advancedFilters.location) {
        params.location = advancedFilters.location;
      }
      
      // Sort order
      if (advancedFilters.sortOrder) {
        params.sortOrder = advancedFilters.sortOrder;
      }
    }
    
    // Advanced search operator parsing
    if (searchTerm.includes(':')) {
      // Parse advanced search operators
      const parsedQuery = parseAdvancedSearchQuery(searchTerm);
      Object.assign(params, parsedQuery);
    }
    
    // Make the API request with proper type casting
    const response = await client.forms.searchSubmissions.$get(params);
    const rawData = await response.json() as Record<string, unknown>;
    
    const submissions: Submission[] = [];
    
    if (rawData && 
        typeof rawData === 'object' && 
        'submissions' in rawData && 
        Array.isArray(rawData.submissions)) {
      // Transform the raw submissions to match our expected Submission type
      (rawData.submissions as unknown[]).forEach((sub: unknown) => {
        try {
          // Transform notification logs to match the expected type
          const subObject = sub as Record<string, unknown>;
          const notificationLogs = ((subObject.notificationLogs as Array<Record<string, unknown>>) || []).map((log): NotificationLog => ({
            id: log.id as string,
            type: log.type as 'SUBMISSION_CONFIRMATION' | 'DEVELOPER_NOTIFICATION' | 'DIGEST',
            status: log.status as 'SENT' | 'FAILED' | 'SKIPPED' | 'PENDING',
            error: log.error as string | null,
            createdAt: log.createdAt as string
          }));
          
          const submissionData: Submission = {
            id: subObject.id as string,
            createdAt: new Date(subObject.createdAt as string),
            email: subObject.email as string || ((subObject.data && typeof subObject.data === 'object') ? 
              (subObject.data as Record<string, unknown>).email as string : null),
            formId: subObject.formId as string || "",
            formName: subObject.formName as string || "Unknown Form",
            formDescription: subObject.formDescription as string || "",
            data: subObject.data as Record<string, unknown> || {}, // Ensure data is always present, even if empty
            notificationLogs: notificationLogs,
            analytics: subObject.analytics as Record<string, unknown> || {
              browser: subObject.data && typeof subObject.data === 'object' && 
                (subObject.data as Record<string, unknown>)._meta ? 
                ((subObject.data as Record<string, unknown>)._meta as Record<string, unknown>).browser as string || "Unknown" : "Unknown",
              location: subObject.data && typeof subObject.data === 'object' && 
                (subObject.data as Record<string, unknown>)._meta ? 
                ((subObject.data as Record<string, unknown>)._meta as Record<string, unknown>).country as string || "Unknown" : "Unknown"
            },
            status: subObject.status as string || undefined
          };
          
          submissions.push(submissionData);
        } catch (subError) {
          console.error("Error mapping submission:", subError);
        }
      });
      
      // Apply client-side filtering for advanced filters if needed
      let filteredSubmissions = [...submissions];
      
      if (advancedFilters) {
        // Filter by attachment presence
        if (advancedFilters.showOnlyWithAttachments) {
          filteredSubmissions = filteredSubmissions.filter((sub) => 
            sub.data && 
            (sub.data as Record<string, unknown>).attachments && 
            Array.isArray((sub.data as Record<string, unknown>).attachments) && 
            ((sub.data as Record<string, unknown>).attachments as unknown[]).length > 0
          );
        }
        
        // Apply client-side sorting if it wasn't handled by the server
        if (advancedFilters.sortOrder && !params.sortOrder) {
          filteredSubmissions.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return advancedFilters.sortOrder === 'newest' 
              ? dateB - dateA  // Newest first
              : dateA - dateB;  // Oldest first
          });
        }
      }
      
      // Create search result with properly typed submissions
      const searchResult: SearchResult = {
        submissions: filteredSubmissions
      };
      
      // Add forms if available, without causing type errors
      addFormsToSearchResult(searchResult, rawData);
      
      return searchResult;
    }
    
    return { submissions: [] };
  } catch (error) {
    console.error("Global search failed:", error)
    
    // Fall back to searching multiple forms
    if (formsData?.forms?.length) {
      return await searchMultipleForms(searchTerm, formsData.forms.slice(0, 3), advancedFilters)
    }
    
    return { submissions: [] }
  }
}

/**
 * Parse advanced search query with operators like email:, id:, date:>
 */
function parseAdvancedSearchQuery(query: string): Record<string, string> {
  const result: Record<string, string> = {}
  const parts = query.split(' ')
  
  parts.forEach(part => {
    if (part.includes(':')) {
      const [operator, ...valueParts] = part.split(':')
      const value = valueParts.join(':') // Handle values that may contain colons
      
      if (!operator || value === undefined) return
      
      // Handle special operators
      if (operator === 'email') {
        result.emailQuery = value
      } else if (operator === '@id' || operator === 'id') {
        result.idQuery = value
      } else if (operator === 'date') {
        // Handle date comparisons like date:>2023-01-01
        if (value.startsWith('>')) {
          result.dateAfter = value.substring(1)
        } else if (value.startsWith('<')) {
          result.dateBefore = value.substring(1)
        } else {
          result.dateEquals = value
        }
      } else if (operator === 'form') {
        result.formName = value
      } else {
        // Generic field search
        result[`field_${operator}`] = value
      }
    } else if (part.trim()) {
      // If no operator, treat as general search term
      result.generalQuery = (result.generalQuery || '') + ' ' + part
    }
  })
  
  return result
}

/**
 * Search multiple forms when global search fails
 */
export async function searchMultipleForms(
  searchTerm: string, 
  formsToSearch: Form[],
  advancedFilters?: AdvancedFilters
): Promise<SearchResult> {
  const allResults: Submission[] = []
  
  for (const form of formsToSearch) {
    try {
      // Build query parameters with required fields
      const params: {
        formId: string,
        search: string,
        page: number,
        limit: number,
        [key: string]: unknown
      } = {
        formId: form.id,
        search: searchTerm,
        page: 1,
        limit: 5
      }
      
      // Add advanced filters if they exist
      if (advancedFilters) {
        if (advancedFilters.dateRange?.from) {
          params.startDate = advancedFilters.dateRange.from.toISOString()
        }
        if (advancedFilters.dateRange?.to) {
          params.endDate = advancedFilters.dateRange.to.toISOString()
        }
        
        // Add other filters
        if (advancedFilters.hasEmail === true) {
          params.hasEmail = 'true'
        }
        
        if (advancedFilters.sortOrder) {
          params.sortOrder = advancedFilters.sortOrder
        }
      }
      
      const response = await client.forms.getSubmissionLogs.$get(params)
      
      const data = await response.json() as Record<string, unknown>
      
      if (data && 
          typeof data === 'object' && 
          'submissions' in data && 
          Array.isArray(data.submissions) && 
          data.submissions.length > 0) {
        // Map the submissions data to match the required types
        const mappedSubmissions = (data.submissions as unknown[]).map((submission: unknown) => {
          return mapSubmissionData(form.id, form.name)(submission);
        });
        
        allResults.push(...mappedSubmissions);
      }
    } catch (formError) {
      console.error(`Search for form ${form.id} failed:`, formError)
    }
  }
  
  // Apply client-side filtering for advanced filters if needed
  let filteredResults = allResults
  
  if (advancedFilters) {
    // Filter by attachment presence
    if (advancedFilters.showOnlyWithAttachments) {
      filteredResults = filteredResults.filter(sub => 
        sub.data && 
        (sub.data as Record<string, unknown>).attachments && 
        Array.isArray((sub.data as Record<string, unknown>).attachments) && 
        ((sub.data as Record<string, unknown>).attachments as unknown[]).length > 0
      )
    }
    
    // Apply client-side sorting if the server didn't handle it
    if (advancedFilters.sortOrder) {
      filteredResults.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return advancedFilters.sortOrder === 'newest' 
          ? dateB - dateA  // Newest first
          : dateA - dateB  // Oldest first
      })
    }
  }
  
  return { submissions: filteredResults }
}

/**
 * Helper to map submission data from API response to Submission interface
 */
export function mapSubmissionData(formId?: string, formName?: string) {
  return (sub: unknown): Submission => {
    const subObj = sub as Record<string, unknown>;
    
    // First extract the form information with fallbacks
    const formObj = subObj.form as Record<string, unknown> | undefined;
    const mappedFormId = formId || (formObj?.id as string) || (subObj.formId as string) || "";
    const mappedFormName = formName || (formObj?.name as string) || (subObj.formName as string) || "Unknown Form";
    
    // Extract email with fallbacks
    const dataObj = subObj.data as Record<string, unknown> | undefined;
    const email = subObj.email as string || (dataObj && typeof dataObj === 'object' ? dataObj.email as string : null);
    
    // Transform notification logs to match the expected type
    const notificationLogs = ((subObj.notificationLogs as Array<Record<string, unknown>>) || []).map((log): NotificationLog => ({
      id: log.id as string,
      type: log.type as 'SUBMISSION_CONFIRMATION' | 'DEVELOPER_NOTIFICATION' | 'DIGEST',
      status: log.status as 'SENT' | 'FAILED' | 'SKIPPED' | 'PENDING',
      error: log.error as string | null,
      createdAt: log.createdAt as string
    }));
    
    // Create the complete submission object with all available data
    return {
      id: subObj.id as string,
      createdAt: new Date(subObj.createdAt as string),
      email: email,
      formId: mappedFormId,
      formName: mappedFormName,
      formDescription: (subObj.formDescription as string) || (formObj?.description as string) || "",
      data: dataObj || {}, // Ensure data is always present, even if empty
      notificationLogs: notificationLogs,
      analytics: (subObj.analytics as Record<string, unknown>) || {
        browser: dataObj?._meta ? 
          ((dataObj._meta as Record<string, unknown>).browser as string) || "Unknown" : "Unknown",
        location: dataObj?._meta ? 
          ((dataObj._meta as Record<string, unknown>).country as string) || "Unknown" : "Unknown"
      },
      status: subObj.status as string || undefined
    };
  };
}

// Helper function to add forms to the search result
function addFormsToSearchResult(result: SearchResult, rawData: Record<string, unknown>) {
  if (rawData.forms && Array.isArray(rawData.forms)) {
    result.forms = (rawData.forms as Array<Record<string, unknown>>).map((form) => ({
      id: form.id as string || '',
      name: form.name as string || 'Unknown Form',
      submissionCount: form.submissionCount as number || 0
    }));
  }
} 