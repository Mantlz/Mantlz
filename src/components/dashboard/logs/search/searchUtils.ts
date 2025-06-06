"use client"

import { client } from "@/lib/client"
import { 
  Form, 
  SearchResult, 
  Submission, 
  NotificationLog, 
  AdvancedFilters, 
  FormsData, 
  ApiParams 
} from "./types"

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
 * Helper function to build API parameters with advanced filters
 */
function buildApiParams(
  searchTerm: string,
  formId?: string,
  advancedFilters?: AdvancedFilters
): ApiParams {
  const params: ApiParams = {
    search: searchTerm,
    page: 1,
    limit: formId ? 10 : 10
  }

  if (formId) {
    params.formId = formId
  }

  if (advancedFilters) {
    // Date range filters
    if (advancedFilters.dateRange?.from) {
      params.startDate = advancedFilters.dateRange.from.toISOString()
    }
    if (advancedFilters.dateRange?.to) {
      params.endDate = advancedFilters.dateRange.to.toISOString()
    }
    
    // Time frame filter
    if (advancedFilters.timeFrame && advancedFilters.timeFrame !== 'all' && !params.startDate) {
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
      
      params.startDate = startDate.toISOString()
    }
    
    // Other filters
    if (advancedFilters.hasEmail === true) {
      params.hasEmail = 'true'
    }
    if (advancedFilters.browser) {
      params.browser = advancedFilters.browser
    }
    if (advancedFilters.location) {
      params.location = advancedFilters.location
    }
    if (advancedFilters.sortOrder) {
      params.sortOrder = advancedFilters.sortOrder
    }
  }

  // Parse advanced search operators
  if (searchTerm.includes(':')) {
    const parsedQuery = parseAdvancedSearchQuery(searchTerm)
    Object.assign(params, parsedQuery)
  }

  return params
}

/**
 * Helper function to create submission object from API response
 */
function createSubmissionFromResponse(
  subObject: Record<string, unknown>, 
  formId?: string, 
  formName?: string
): Submission {
  const formObj = subObject.form as Record<string, unknown> | undefined
  const dataObj = subObject.data as Record<string, unknown> | undefined
  
  // Extract form information with proper priority
  const extractedFormId = formId || (formObj?.id as string) || (subObject.formId as string) || ""
  const extractedFormName = (formObj?.name as string) || (subObject.formName as string) || formName || "Unknown Form"
  
  // Extract email with fallbacks
  const email = subObject.email as string || (dataObj?.email as string) || null
  
  
  // Transform notification logs
  const notificationLogs = ((subObject.notificationLogs as Array<Record<string, unknown>>) || []).map((log): NotificationLog => ({
    id: log.id as string,
    type: log.type as 'SUBMISSION_CONFIRMATION' | 'DEVELOPER_NOTIFICATION' | 'DIGEST',
    status: log.status as 'SENT' | 'FAILED' | 'SKIPPED' | 'PENDING',
    error: log.error as string | null,
    createdAt: log.createdAt as string
  }))
  
  // Try multiple possible paths for analytics data
  const metaData = (subObject._meta || subObject.meta || subObject.analytics) as Record<string, unknown> | undefined
  
  return {
    id: subObject.id as string,
    createdAt: new Date(subObject.createdAt as string),
    email,
    formId: extractedFormId,
    formName: extractedFormName,
    formDescription: (formObj?.description as string) || undefined,
    data: dataObj,
    notificationLogs,
    status: subObject.status as string || undefined,
    analytics: {
      browser: metaData?.browser as string || (subObject.browser as string) || undefined,
      location: metaData?.country as string || metaData?.location as string || (subObject.country as string) || (subObject.location as string) || undefined
    }
  }
}

/**
 * Apply client-side filters to submissions
 */
function applyClientSideFilters(submissions: Submission[], advancedFilters?: AdvancedFilters): Submission[] {
  if (!advancedFilters) return submissions
  
  let filtered = [...submissions]
  
  // Filter by attachment presence
  if (advancedFilters.showOnlyWithAttachments) {
    filtered = filtered.filter((sub) => {
      const attachments = (sub.data as Record<string, unknown>).attachments
      return attachments && Array.isArray(attachments) && attachments.length > 0
    })
  }
  
  // Apply client-side sorting if needed
  if (advancedFilters.sortOrder) {
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return advancedFilters.sortOrder === 'newest' 
        ? dateB - dateA
        : dateA - dateB
    })
  }
  
  return filtered
}

/**
 * Search within a specific form
 */
export async function searchInSpecificForm(
  searchTerm: string, 
  formId: string,
  advancedFilters?: AdvancedFilters
): Promise<SearchResult> {
  try {
    const params = buildApiParams(searchTerm, formId, advancedFilters)
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    
    const response = await fetch(`/api/forms/getSubmissionLogs?${searchParams.toString()}`)
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`)
    }
    
    const responseText = await response.text()
    const responseData = JSON.parse(responseText) as Record<string, unknown>
    
    // Handle different response formats
    let submissions: unknown[] = []
    
    if (responseData.json && responseData.meta) {
      // Superjson format
      const data = responseData.json as { submissions?: unknown[] }
      submissions = data.submissions || []
    } else if (responseData.submissions && Array.isArray(responseData.submissions)) {
      // Regular JSON format
      submissions = responseData.submissions
    } else if (responseData.pagination && responseData.data && Array.isArray(responseData.data)) {
      // Pagination format
      submissions = responseData.data
    }

    const mappedSubmissions = submissions.map((submission) => 
      createSubmissionFromResponse(submission as Record<string, unknown>, formId)
    )
    
    return { submissions: mappedSubmissions }
  } catch (error) {
    console.error("Form-specific search failed:", error)
    return { submissions: [] }
  }
}

/**
 * Search across all forms (global search)
 */
export async function searchAcrossAllForms(
  searchTerm: string, 
  formsData?: FormsData,
  advancedFilters?: AdvancedFilters
): Promise<SearchResult> {
  try {
    const params = buildApiParams(searchTerm, undefined, advancedFilters)
    
    const response = await client.forms.getSubmissionLogs.$get(params)
    const rawData = await response.json() as Record<string, unknown>
    
    if (!rawData || !rawData.submissions || !Array.isArray(rawData.submissions)) {
      return { submissions: [] }
    }
    
    const submissions = (rawData.submissions as unknown[]).map((sub: unknown) => {
      return createSubmissionFromResponse(sub as Record<string, unknown>)
    })
    
    const filteredSubmissions = applyClientSideFilters(submissions, advancedFilters)
    
    const searchResult: SearchResult = {
      submissions: filteredSubmissions
    }
    
    // Add forms if available
    if (rawData.forms && Array.isArray(rawData.forms)) {
      searchResult.forms = (rawData.forms as Array<Record<string, unknown>>).map((form) => ({
        id: form.id as string || '',
        name: form.name as string || 'Unknown Form',
        submissionCount: form.submissionCount as number || 0
      }))
    }
    
    return searchResult
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
 * Parse advanced search query operators
 */
function parseAdvancedSearchQuery(query: string): Record<string, string> {
  const result: Record<string, string> = {}
  const parts = query.split(' ')
  
  parts.forEach(part => {
    if (part.includes(':')) {
      const [operator, ...valueParts] = part.split(':')
      const value = valueParts.join(':')
      
      if (!operator || value === undefined) return
      
      switch (operator) {
        case 'email':
          result.emailQuery = value
          break
        case '@id':
        case 'id':
          result.idQuery = value
          break
        case 'date':
          if (value.startsWith('>')) {
            result.dateAfter = value.substring(1)
          } else if (value.startsWith('<')) {
            result.dateBefore = value.substring(1)
          } else {
            result.dateEquals = value
          }
          break
        case 'form':
          result.formName = value
          break
        default:
          result[`field_${operator}`] = value
      }
    } else if (part.trim()) {
      result.generalQuery = (result.generalQuery || '') + ' ' + part
    }
  })
  
  return result
}

/**
 * Search across multiple specific forms (fallback method)
 */
export async function searchMultipleForms(
  searchTerm: string, 
  formsToSearch: Form[],
  advancedFilters?: AdvancedFilters
): Promise<SearchResult> {
  const allResults: Submission[] = []
  
  for (const form of formsToSearch) {
    try {
      const params = buildApiParams(searchTerm, form.id, advancedFilters)
      params.limit = 5 // Limit per form for multiple form search
      
      const response = await client.forms.getSubmissionLogs.$get(params)
      const data = await response.json() as Record<string, unknown>
      
      if (data?.submissions && Array.isArray(data.submissions) && data.submissions.length > 0) {
        const mappedSubmissions = (data.submissions as unknown[]).map((submission: unknown) => {
          return createSubmissionFromResponse(submission as Record<string, unknown>, form.id, form.name)
        })
        
        allResults.push(...mappedSubmissions)
      }
    } catch (formError) {
      console.error(`Search for form ${form.id} failed:`, formError)
    }
  }
  
  const filteredResults = applyClientSideFilters(allResults, advancedFilters)
  
  return { submissions: filteredResults }
}