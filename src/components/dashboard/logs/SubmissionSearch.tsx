"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { useSubscription } from "@/hooks/useSubscription"
import { useQuery } from "@tanstack/react-query"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { UpgradeModal } from "@/components/modals/UpgradeModal"
import { FileSearch } from "lucide-react"
import { SearchButton } from "./search/SearchButton"
import { SearchDialog } from "./search/SearchDialog"
import { SubmissionDetailsSheet } from "./search/SubmissionDetailsSheet"
import { 
  performSearch, 
  fetchUserForms, 
} from "./search/searchUtils"
import { Submission, SearchResult, Form } from "./search/types"

// Define the advanced filters type
interface AdvancedFilters {
  dateRange?: { 
    from: Date | undefined;
    to?: Date | undefined;
  }
  showOnlyWithAttachments?: boolean
  sortOrder?: 'newest' | 'oldest'
  timeFrame?: 'all' | '24h' | '7d' | '30d'
  hasEmail?: boolean
  browser?: string
  location?: string
}

export function SubmissionSearch() {
  // State
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({})

  // Hooks
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isPremium, subscription } = useSubscription()
  const currentFormId = searchParams.get("formId")
  const debouncedSearch = useDebouncedValue(search, 150)
  
  // Get the plan from the subscription or default to FREE
  const userPlan = subscription?.plan || 'FREE'
  const isProUser = userPlan === 'PRO'

  // Initialize selected form from URL params when opened
  useEffect(() => {
    if (open && currentFormId) {
      setSelectedFormId(currentFormId)
    }
  }, [open, currentFormId])

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with Cmd+K / Ctrl+K
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (isPremium) {
          setOpen((open) => !open)
        } else {
          setShowUpgradeModal(true)
        }
      }
      
      // Close search with Escape
      if (open && e.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isPremium, open])

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearch("")
      setSelectedFormId(currentFormId)
      setSelectedSubmission(null)
      if (!isProUser) {
        setAdvancedFilters({})
      }
    }
  }, [open, currentFormId, isProUser])

  // Query to get all forms for the search selector
  const { data: formsData } = useQuery<{ forms: Form[] }>({
    queryKey: ["userForms"],
    queryFn: fetchUserForms,
    enabled: isPremium && open,
    staleTime: 30000,
  })

  // Query for searching submissions
  const { data, isLoading } = useQuery<SearchResult>({
    queryKey: ["searchSubmissions", debouncedSearch, selectedFormId, isProUser, advancedFilters],
    queryFn: () => performSearch(debouncedSearch, selectedFormId, formsData, advancedFilters),
    enabled: isPremium && open && debouncedSearch.length > 0 && (isProUser || selectedFormId !== null),
    staleTime: 5000,
    refetchOnMount: true
  })

  // Handle form selection
  function handleFormSelect(formId: string) {
    // Standard users cannot search across all forms
    if (!isProUser && formId === "all") {
      setShowUpgradeModal(true)
      return
    }
    
    setSelectedFormId(formId === "all" ? null : formId)
    setSearch("") // Reset search when form changes
  }

  // Handle submission selection
  function handleSelect(submission: Submission) {
    setSelectedSubmission(submission)
    setIsSheetOpen(true)
  }

  // Handle advanced filters updates
  function handleSetAdvancedFilters(filters: AdvancedFilters) {
    if (isProUser) {
      console.log("Setting advanced filters:", filters)
      setAdvancedFilters(filters)
      
      // Re-run the search with the new filters if there's an active search
      if (debouncedSearch.trim().length > 0) {
        handleSearch(debouncedSearch, selectedFormId)
      }
    }
  }

  // Handle navigation to submission page
  function handleNavigateToSubmission() {
    if (!selectedSubmission) return
    
    setOpen(false)
    setIsSheetOpen(false)
    
    // Navigate to the form logs page with the ID selected
    if (selectedSubmission.formId) {
      router.push(`/dashboard/logs?formId=${selectedSubmission.formId}&submissionId=${selectedSubmission.id}`)
    } else {
      // If no form ID is available, just focus on the submission ID
      router.push(`/dashboard/logs?submissionId=${selectedSubmission.id}`)
    }
  }

  // Function to handle search
  const handleSearch = async (searchTerm: string, localFormId: string | null = selectedFormId) => {
    // Ensure searchTerm is a string
    const sanitizedTerm = typeof searchTerm === 'string' ? searchTerm : '';
    
    // Clear previous results if empty search
    if (!sanitizedTerm.trim()) {
      return;
    }

    await performSearch(
      sanitizedTerm, 
      localFormId,
      formsData,
      advancedFilters
    );
  };

  // Show premium upgrade option for non-premium users
  if (!isPremium) {
    return (
      <>
        <SearchButton onClick={() => setShowUpgradeModal(true)} />

        <UpgradeModal 
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          featureName="Global Submission Search"
          featureIcon={<FileSearch className="h-5 w-5 m-2 text-slate-700 dark:text-slate-300" />}
          description="Quickly search across all your submissions with our powerful search capability. Find any submission by email, ID, or content in seconds."
        />
      </>
    )
  }

  return (
    <>
      <SearchButton onClick={() => setOpen(true)} />
      
      {open && <SearchDialog 
        search={search}
        setSearch={setSearch}
        isLoading={isLoading}
        debouncedSearch={debouncedSearch}
        formsData={formsData || { forms: [] }}
        selectedFormId={selectedFormId}
        handleFormSelect={handleFormSelect}
        onClose={() => setOpen(false)}
        data={data}
        onSelectSubmission={handleSelect}
        isProUser={isProUser}
        showUpgradeModal={() => setShowUpgradeModal(true)}
        advancedFilters={advancedFilters}
        setAdvancedFilters={handleSetAdvancedFilters}
      />}

      <SubmissionDetailsSheet 
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        submission={selectedSubmission}
        onNavigate={handleNavigateToSubmission}
      />
      
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Advanced Search"
        featureIcon={<Search className="h-5 w-5 m-2 text-slate-700 dark:text-slate-300" />}
        description="Pro plan users can search across all forms simultaneously, access advanced filters, and get unlimited search results."
      />
    </>
  )
} 