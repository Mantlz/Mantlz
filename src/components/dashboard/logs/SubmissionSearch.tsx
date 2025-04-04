"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, AlertCircle } from "lucide-react"
import { useSubscription } from "@/hooks/useSubscription"
import { useQuery } from "@tanstack/react-query"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { UpgradeModal } from "@/components/modals/UpgradeModal"
import { FileSearch, Sparkles } from "lucide-react"
import { SearchButton } from "./search/SearchButton"
import { SearchDialog } from "./search/SearchDialog"
import { SubmissionDetailsSheet } from "./search/SubmissionDetailsSheet"
import { 
  performSearch, 
  fetchUserForms, 
  mapSubmissionData 
} from "./search/searchUtils"
import { Form, Submission, SearchResult } from "./search/types"

export function SubmissionSearch() {
  // State
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

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
    }
  }, [open, currentFormId])

  // Query to get all forms for the search selector
  const { data: formsData } = useQuery({
    queryKey: ["userForms"],
    queryFn: fetchUserForms,
    enabled: isPremium && open,
    staleTime: 30000,
  })

  // Query for searching submissions
  const { data, isLoading } = useQuery<SearchResult>({
    queryKey: ["searchSubmissions", debouncedSearch, selectedFormId, isProUser],
    queryFn: () => performSearch(debouncedSearch, selectedFormId, formsData),
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
        formsData={formsData}
        selectedFormId={selectedFormId}
        handleFormSelect={handleFormSelect}
        onClose={() => setOpen(false)}
        data={data}
        onSelectSubmission={handleSelect}
        isProUser={isProUser}
        showUpgradeModal={() => setShowUpgradeModal(true)}
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