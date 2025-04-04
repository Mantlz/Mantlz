"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useSubscription } from "@/hooks/useSubscription"
import { client } from "@/lib/client"
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
  searchInSpecificForm,
  searchAcrossAllForms,
  searchMultipleForms,
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
  const { isPremium } = useSubscription()
  const currentFormId = searchParams.get("formId")
  const debouncedSearch = useDebouncedValue(search, 150)

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
    queryKey: ["searchSubmissions", debouncedSearch, selectedFormId],
    queryFn: () => performSearch(debouncedSearch, selectedFormId, formsData),
    enabled: isPremium && open && debouncedSearch.length > 0,
    staleTime: 5000,
    refetchOnMount: true
  })

  // Handle form selection
  function handleFormSelect(formId: string) {
    setSelectedFormId(formId === "" ? null : formId)
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

  // Show premium upgrade modal for non-premium users
  if (!isPremium) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"
          onClick={() => setShowUpgradeModal(true)}
        >
          <Search className="h-3.5 w-3.5 text-gray-500" />
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
      />}

      <SubmissionDetailsSheet 
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        submission={selectedSubmission}
        onNavigate={handleNavigateToSubmission}
      />
    </>
  )
} 