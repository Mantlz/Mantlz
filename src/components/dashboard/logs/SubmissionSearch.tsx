"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileSearch, Filter, Search } from "lucide-react"
import { useSubscription } from "@/hooks/useSubscription"
import { client } from "@/lib/client"
import { useQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { UpgradeModal } from "@/components/modals/UpgradeModal"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"

interface Submission {
  id: string
  createdAt: Date
  email: string | null
  formId: string
  formName: string
}

interface Form {
  id: string
  name: string
  submissionCount: number
}

interface SearchResult {
  submissions: Submission[]
  forms?: Form[]
}

export function SubmissionSearch() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isPremium } = useSubscription()
  const currentFormId = searchParams.get("formId")
  
  // Reduce debounce time for more responsive search
  const debouncedSearch = useDebouncedValue(search, 150)

  // Initialize selected form from URL params when opened
  useEffect(() => {
    if (open && currentFormId) {
      setSelectedFormId(currentFormId)
    }
  }, [open, currentFormId])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (isPremium) {
          setOpen((open) => !open)
        } else {
          setShowUpgradeModal(true)
        }
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [isPremium])

  // Query to get all forms for the search selector
  const { data: formsData } = useQuery({
    queryKey: ["userForms"],
    queryFn: async () => {
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
    },
    enabled: isPremium && open,
    staleTime: 30000,
  })

  const performSearch = useCallback(async (searchTerm: string, formId: string | null) => {
    if (!searchTerm || searchTerm.trim() === "") {
      return { submissions: [] }
    }

    console.log(`Searching for "${searchTerm}" in formId: ${formId || 'all forms'}`);

    try {
      // If we have a specific form selected
      if (formId) {
        try {
          // Direct API call to avoid JSON encoding issues
          const apiPath = `/api/forms/getSubmissionLogs`;
          const searchParams = new URLSearchParams();
          searchParams.append('formId', formId);
          searchParams.append('search', searchTerm);
          searchParams.append('page', '1');
          searchParams.append('limit', '10');
          
          console.log(`Making API call to: ${apiPath}?${searchParams.toString()}`);
          
          const response = await fetch(`${apiPath}?${searchParams.toString()}`);
          if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
          }
          
          // Get the response data
          const responseData = await response.json() as any;
          console.log("Search response data:", responseData);
          
          // Check for superjson format with meta data
          if (responseData.json && responseData.meta) {
            console.log("Detected superjson format");
            const data = responseData.json;
            
            if (data.submissions && Array.isArray(data.submissions)) {
              console.log(`Found ${data.submissions.length} submissions in superjson format`);
              
              const mappedSubmissions = data.submissions.map((sub: any) => {
                return {
                  id: sub.id,
                  createdAt: new Date(sub.createdAt),
                  email: sub.email || (sub.data && sub.data.email) || null,
                  formId: formId || sub.form?.id || sub.formId || "",
                  formName: sub.form?.name || "Unknown Form"
                };
              });
              
              console.log("Mapped submissions:", mappedSubmissions);
              return { submissions: mappedSubmissions };
            }
          }
          
          // Regular JSON format
          if (responseData.submissions && Array.isArray(responseData.submissions)) {
            console.log(`Found ${responseData.submissions.length} submissions in regular format`);
            
            const mappedSubmissions = responseData.submissions.map((sub: any) => {
              return {
                id: sub.id,
                createdAt: new Date(sub.createdAt),
                email: sub.email || (sub.data && sub.data.email) || null,
                formId: formId || sub.form?.id || sub.formId || "",
                formName: sub.form?.name || "Unknown Form"
              };
            });
            
            console.log("Mapped submissions:", mappedSubmissions);
            return { submissions: mappedSubmissions };
          }
          
          console.log("No submissions found in response");
          return { submissions: [] };
        } catch (error) {
          console.error("Form-specific search failed:", error)
          return { submissions: [] }
        }
      } 
      // Otherwise try the global search if available
      else {
        try {
          // Try the searchSubmissions endpoint first
          const response = await client.forms.searchSubmissions.$get({
            query: searchTerm
          })
          
          const data = await response.json()
          
          // Ensure dates are properly parsed and fields are extracted correctly
          if (data.submissions) {
            const mappedSubmissions = data.submissions.map((sub: any) => {
              // Extract data consistently
              return {
                id: sub.id,
                createdAt: new Date(sub.createdAt),
                email: sub.email || sub.data?.email || null,
                formId: sub.form?.id || sub.formId || "",
                formName: sub.form?.name || "Unknown Form"
              };
            });
            
            data.submissions = mappedSubmissions;
          }
          
          return data
        } catch (error) {
          console.error("Global search failed:", error)
          
          // If no global search, let's fetch and search each form individually
          if (formsData?.forms?.length) {
            const allResults: Submission[] = []
            
            // For simplicity, just search the first 3 forms
            const formsToSearch = formsData.forms.slice(0, 3)
            
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
                  allResults.push(...data.submissions.map((sub: any) => ({
                    id: sub.id,
                    createdAt: new Date(sub.createdAt),
                    email: sub.email || (sub.data?.email) || null, // Check in data object
                    formId: sub.form?.id || form.id, // Use form ID from response or current form
                    formName: form.name || "Unknown Form"
                  })))
                }
              } catch (formError) {
                console.error(`Search for form ${form.id} failed:`, formError)
              }
            }
            
            return { submissions: allResults }
          }
          
          return { submissions: [] }
        }
      }
    } catch (error) {
      console.error("All search attempts failed:", error)
      return { submissions: [] }
    }
  }, [formsData])

  const { data, isLoading } = useQuery<SearchResult>({
    queryKey: ["searchSubmissions", debouncedSearch, selectedFormId],
    queryFn: () => performSearch(debouncedSearch, selectedFormId),
    enabled: isPremium && open,
    staleTime: 5000,
    refetchOnMount: true
  })

  // Add debug logging for when data changes
  useEffect(() => {
    if (data) {
      console.log("Search query results:", {
        hasData: !!data,
        submissionsCount: data.submissions?.length || 0,
        submissions: data.submissions
      });
    }
  }, [data]);

  // Reset search and selected form when dialog closes
  useEffect(() => {
    if (!open) {
      setSearch("")
      setSelectedFormId(currentFormId)
    }
  }, [open, currentFormId])

  // Add escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (open && e.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open])

  const handleSelect = (id: string, formId: string) => {
    setOpen(false)
    // Navigate to the form logs page with the ID selected
    if (formId) {
      router.push(`/dashboard/logs?formId=${formId}&submissionId=${id}`)
    } else {
      // If no form ID is available, just focus on the submission ID
      router.push(`/dashboard/logs?submissionId=${id}`)
    }
  }

  const handleFormSelect = (formId: string) => {
    setSelectedFormId(formId === "" ? null : formId)
    setSearch("") // Reset search when form changes
    console.log("Form selection changed to:", formId === "" ? "All Forms" : formId);
  }

  if (!isPremium) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"
          onClick={() => setShowUpgradeModal(true)}
        >
          {/* <Search className="h-3.5 w-3.5 text-gray-500" /> */}
          <span className="hidden sm:inline-flex">Quick Search</span>
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-gray-600 dark:text-gray-400 ml-2">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <UpgradeModal 
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          featureName="Quick Submission Search"
          featureIcon={<FileSearch className="h-5 w-5 m-2 text-gray-700 dark:text-gray-300" />}
          description="Quickly search for submissions across all your forms using the command palette (⌘K). Find submissions by ID, email, or any form data in seconds."
        />
      </>
    )
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-2 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"
        onClick={() => setOpen(true)}
      >
        <Search className="h-3.5 w-3.5 text-gray-500" />
        <span className="hidden sm:inline-flex">Quick Search</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-gray-600 dark:text-gray-400 ml-2">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setOpen(false)}
          />
          <div className="relative z-50 bg-white dark:bg-zinc-950 rounded-lg shadow-lg max-w-[90vw] w-[500px]">
            <div className="rounded-lg border border-gray-200 dark:border-gray-800">
              {/* Search input */}
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input 
                  placeholder={`Search ${selectedFormId ? 'this form' : 'all forms'}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none" 
                  autoFocus 
                />
                {formsData?.forms && (
                  <div className="relative ml-2">
                    <select 
                      className="h-7 pr-8 pl-2 text-xs bg-gray-100 dark:bg-gray-800 border-none rounded-md appearance-none cursor-pointer"
                      value={selectedFormId || ""}
                      onChange={(e) => handleFormSelect(e.target.value)}
                    >
                      <option value="">All Forms</option>
                      {formsData.forms.map(form => (
                        <option key={form.id} value={form.id}>
                          {form.name}
                        </option>
                      ))}
                    </select>
                    <Filter className="absolute right-2 top-1.5 h-3.5 w-3.5 pointer-events-none opacity-50" />
                  </div>
                )}
              </div>
              
              {/* List of search results */}
              <div className="max-h-[300px] overflow-y-auto p-2">
                {isLoading && (
                  <div className="flex items-center justify-center py-6">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                    <span className="ml-2">Searching...</span>
                  </div>
                )}
                
                {!isLoading && debouncedSearch && data?.submissions && data.submissions.length > 0 && (
                  <div className="px-2 py-1 text-xs text-blue-500">
                    Debug: Found {data.submissions.length} results
                  </div>
                )}
                
                {!isLoading && debouncedSearch.length > 0 && (!data?.submissions || data.submissions.length === 0) && (
                  <div className="py-6 text-center">
                    <p>No results found for "{debouncedSearch}"</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFormId
                        ? "Try another search term or choose a different form"
                        : "Try another search term or specify a form using the dropdown"}
                    </p>
                  </div>
                )}
                
                {!isLoading && debouncedSearch.length === 0 && (
                  <div className="py-6 text-center">
                    <p>Start typing to search submissions</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFormId
                        ? "Search within the selected form"
                        : "Search across all your forms or select a specific form"}
                    </p>
                  </div>
                )}
                
                {!isLoading && data?.submissions && data.submissions.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 font-semibold pt-1 pb-2 px-2">
                      Results ({data.submissions.length})
                    </div>
                    
                    {data.submissions.map((submission, index) => {
                      console.log(`Rendering submission ${index}:`, submission);
                      return (
                        <div
                          key={submission.id}
                          onClick={() => handleSelect(submission.id, submission.formId)}
                          className="flex justify-between items-start gap-2 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
                        >
                          <div className="flex flex-col flex-grow min-w-0">
                            <div className="flex items-center space-x-2 min-w-0">
                              <span className="font-mono text-sm shrink-0">{submission.id.slice(0, 6)}</span>
                              {submission.email && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {submission.email}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              Form: {submission.formName || "Unknown Form"}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                            {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 