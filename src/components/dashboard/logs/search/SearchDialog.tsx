"use client"

import { Filter, Loader2, MessageSquare, Search, X, ArrowUpRight, Calendar, Mail } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Form, SearchResult, Submission } from "./types"

interface SearchDialogProps {
  search: string
  setSearch: (value: string) => void
  isLoading: boolean
  debouncedSearch: string
  formsData: any
  selectedFormId: string | null
  handleFormSelect: (formId: string) => void
  onClose: () => void
  data: SearchResult | undefined
  onSelectSubmission: (submission: Submission) => void
}

export function SearchDialog({
  search,
  setSearch,
  isLoading,
  debouncedSearch,
  formsData,
  selectedFormId,
  handleFormSelect,
  onClose,
  data,
  onSelectSubmission
}: SearchDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 bg-white dark:bg-zinc-950 rounded-lg shadow-xl max-w-[90vw] w-[550px] overflow-hidden">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800">
          {/* Search header */}
          <div className="flex items-center border-b px-4 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
            <input 
              placeholder={`Search ${selectedFormId ? 'this form' : 'all forms'}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none" 
              autoFocus 
            />
            
            {/* Form selector */}
            {formsData?.forms && (
              <div className="relative ml-2">
                <select 
                  className="h-7 pr-8 pl-2 text-xs bg-gray-100 dark:bg-gray-800 border-none rounded-md appearance-none cursor-pointer"
                  value={selectedFormId || ""}
                  onChange={(e) => handleFormSelect(e.target.value)}
                >
                  <option value="">All Forms</option>
                  {formsData.forms.map((form: Form) => (
                    <option key={form.id} value={form.id}>
                      {form.name}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-2 top-1.5 h-3.5 w-3.5 pointer-events-none opacity-50" />
              </div>
            )}
            
            <button 
              onClick={onClose}
              className="ml-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          {/* Search results */}
          <div className="max-h-[60vh] overflow-y-auto">
            <SearchResults 
              isLoading={isLoading}
              debouncedSearch={debouncedSearch}
              data={data}
              onSelectSubmission={onSelectSubmission}
              selectedFormId={selectedFormId}
            />
          </div>
          
          {/* Search footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex justify-between items-center">
              <span>Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">Esc</kbd> to close</span>
              {data?.submissions && data.submissions.length > 0 && (
                <span>{data.submissions.length} results</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SearchResultsProps {
  isLoading: boolean
  debouncedSearch: string
  data: SearchResult | undefined
  onSelectSubmission: (submission: Submission) => void
  selectedFormId: string | null
}

function SearchResults({ 
  isLoading, 
  debouncedSearch, 
  data, 
  onSelectSubmission,
  selectedFormId
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-gray-500 dark:text-gray-400" />
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Searching...</span>
      </div>
    )
  }
  
  if (!debouncedSearch) {
    return (
      <div className="py-8 text-center">
        <Search className="h-8 w-8 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Start typing to search submissions
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {selectedFormId
            ? "Search within the selected form"
            : "Search across all your forms or select a specific form"}
        </p>
      </div>
    )
  }
  
  if (!data?.submissions || data.submissions.length === 0) {
    return (
      <div className="py-8 text-center">
        <MessageSquare className="h-8 w-8 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No results found for "{debouncedSearch}"
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {selectedFormId
            ? "Try another search term or choose a different form"
            : "Try another search term or specify a form using the dropdown"}
        </p>
      </div>
    )
  }
  
  return (
    <div className="py-2">
      <div className="px-4 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Results
      </div>
      
      <div className="mt-1">
        {data.submissions.map((submission) => (
          <SubmissionSearchResult 
            key={submission.id}
            submission={submission}
            onClick={() => onSelectSubmission(submission)}
          />
        ))}
      </div>
    </div>
  )
}

interface SubmissionSearchResultProps {
  submission: Submission
  onClick: () => void
}

function SubmissionSearchResult({ submission, onClick }: SubmissionSearchResultProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
    >
      <div className="bg-gray-100 dark:bg-gray-800 rounded-md h-8 w-8 flex items-center justify-center shrink-0">
        <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
            {submission.id.slice(0, 8)}
          </span>
          {submission.email && (
            <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {submission.email}
            </span>
          )}
        </div>
        
        <div className="flex items-center mt-1 text-xs">
          <span className="text-gray-500 dark:text-gray-400 truncate mr-2">
            {submission.formName}
          </span>
          <span className="flex items-center text-gray-400 dark:text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
      
      <div className="shrink-0">
        <ArrowUpRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  )
} 