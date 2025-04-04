"use client"

import { client } from "@/lib/client"
import { Form, SearchResult, Submission } from "./types"

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
  formsData?: any
): Promise<SearchResult> {
  if (!searchTerm || searchTerm.trim() === "") {
    return { submissions: [] }
  }

  try {
    if (formId) {
      return await searchInSpecificForm(searchTerm, formId)
    } else {
      return await searchAcrossAllForms(searchTerm, formsData)
    }
  } catch (error) {
    console.error("All search attempts failed:", error)
    return { submissions: [] }
  }
}

/**
 * Search submissions within a specific form
 */
export async function searchInSpecificForm(searchTerm: string, formId: string): Promise<SearchResult> {
  try {
    const apiPath = `/api/forms/getSubmissionLogs`
    const searchParams = new URLSearchParams()
    searchParams.append('formId', formId)
    searchParams.append('search', searchTerm)
    searchParams.append('page', '1')
    searchParams.append('limit', '10')
    
    const response = await fetch(`${apiPath}?${searchParams.toString()}`)
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`)
    }
    
    // Get the response as text first
    const responseText = await response.text()
    console.log("Raw API response:", responseText)
    
    // Try to parse the response as JSON
    try {
      const responseData = JSON.parse(responseText) as any
      
      // Handle superjson format
      if (responseData.json && responseData.meta) {
        const data = responseData.json
        
        if (data.submissions && Array.isArray(data.submissions)) {
          const mappedSubmissions = data.submissions.map(mapSubmissionData(formId))
          console.log(`Found ${mappedSubmissions.length} submissions in superjson format`)
          return { submissions: mappedSubmissions }
        }
      }
      
      // Handle regular JSON format
      if (responseData.submissions && Array.isArray(responseData.submissions)) {
        const mappedSubmissions = responseData.submissions.map(mapSubmissionData(formId))
        console.log(`Found ${mappedSubmissions.length} submissions in regular format`)
        return { submissions: mappedSubmissions }
      }

      // If we have a pagination object, data might be in a different format
      if (responseData.pagination && responseData.data && Array.isArray(responseData.data)) {
        const mappedSubmissions = responseData.data.map(mapSubmissionData(formId))
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
export async function searchAcrossAllForms(searchTerm: string, formsData?: any): Promise<SearchResult> {
  try {
    const response = await client.forms.searchSubmissions.$get({
      query: searchTerm
    })
    
    const data = await response.json()
    
    if (data.submissions) {
      const mappedSubmissions = data.submissions.map(mapSubmissionData())
      data.submissions = mappedSubmissions
    }
    
    return data
  } catch (error) {
    console.error("Global search failed:", error)
    
    // Fall back to searching multiple forms
    if (formsData?.forms?.length) {
      return await searchMultipleForms(searchTerm, formsData.forms.slice(0, 3))
    }
    
    return { submissions: [] }
  }
}

/**
 * Search multiple forms when global search fails
 */
export async function searchMultipleForms(searchTerm: string, formsToSearch: Form[]): Promise<SearchResult> {
  const allResults: Submission[] = []
  
  for (const form of formsToSearch) {
    try {
      const response = await client.forms.getSubmissionLogs.$get({
        formId: form.id,
        search: searchTerm,
        page: 1,
        limit: 5
      })
      
      const data = await response.json()
      
      if (data.submissions?.length) {
        allResults.push(...data.submissions.map(mapSubmissionData(form.id, form.name)))
      }
    } catch (formError) {
      console.error(`Search for form ${form.id} failed:`, formError)
    }
  }
  
  return { submissions: allResults }
}

/**
 * Helper to map submission data from API response to Submission interface
 */
export function mapSubmissionData(formId?: string, formName?: string) {
  return (sub: any) => ({
    id: sub.id,
    createdAt: new Date(sub.createdAt),
    email: sub.email || (sub.data && typeof sub.data === 'object' ? sub.data.email : null),
    formId: formId || sub.form?.id || sub.formId || "",
    formName: formName || sub.form?.name || "Unknown Form",
    data: sub.data,
    notificationLogs: sub.notificationLogs || []
  })
} 