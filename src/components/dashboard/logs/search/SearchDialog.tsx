"use client"

import { Filter, Loader2, MessageSquare, Search, X, ArrowUpRight, Calendar, Mail } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Form, SearchResult, Submission } from "./types"
import { Badge } from "@/components/ui/badge"

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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-[90vw] w-[550px] overflow-hidden border border-gray-200 dark:border-gray-800/50">
        {/* Search header */}
        <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800/50">
          <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-gray-700/50 rounded-full flex items-center px-3 py-1.5 flex-1">
            <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
            <input 
              placeholder={`Search ${selectedFormId ? 'this form' : 'all forms'}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-full w-full bg-transparent py-1 text-sm outline-none border-none placeholder:text-gray-400 dark:placeholder:text-gray-500" 
              autoFocus 
            />
          </div>
          
          {/* Form selector */}
          {formsData?.forms && (
            <div className="relative ml-3">
              <select 
                className="h-8 pr-7 pl-3 text-xs bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700/50 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
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
              <Filter className="absolute right-2.5 top-2.5 h-3 w-3 pointer-events-none text-gray-400 dark:text-gray-500" />
            </div>
          )}
          
          <button 
            onClick={onClose}
            className="ml-3 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Search results */}
        <div className="max-h-[65vh] overflow-y-auto">
          <SearchResults 
            isLoading={isLoading}
            debouncedSearch={debouncedSearch}
            data={data}
            onSelectSubmission={onSelectSubmission}
            selectedFormId={selectedFormId}
          />
        </div>
        
        {/* Search footer */}
        <div className="border-t border-gray-100 dark:border-gray-800/50 px-4 py-2.5 text-xs text-gray-400 dark:text-gray-500">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="mr-1">Press</span>
              <div className="inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium">
                Esc
              </div>
              <span className="ml-1">to close</span>
            </div>
            {data?.submissions && data.submissions.length > 0 && (
              <Badge variant="secondary" className="text-[10px] bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400">
                {data.submissions.length} results
              </Badge>
            )}
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
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400 dark:text-gray-500 mb-3" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Searching submissions...</span>
        </div>
      </div>
    )
  }
  
  if (!debouncedSearch) {
    return (
      <div className="py-12 text-center px-4">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center">
          <Search className="h-6 w-6 text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Search for submissions
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          {selectedFormId
            ? "Enter email, ID, or content to find submissions in this form"
            : "Enter email, ID, or content to find submissions across all your forms"}
        </p>
      </div>
    )
  }
  
  if (!data?.submissions || data.submissions.length === 0) {
    return (
      <div className="py-12 text-center px-4">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center">
          <MessageSquare className="h-6 w-6 text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          No results found
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          We couldn't find any submissions matching "<span className="text-gray-700 dark:text-gray-300">{debouncedSearch}</span>"
        </p>
      </div>
    )
  }
  
  return (
    <div className="py-2 divide-y divide-gray-100 dark:divide-gray-800/50">
      {data.submissions.map((submission) => (
        <SubmissionSearchResult 
          key={submission.id}
          submission={submission}
          onClick={() => onSelectSubmission(submission)}
        />
      ))}
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
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors group"
    >
      <div className="bg-gray-100 dark:bg-zinc-800 rounded-full h-9 w-9 flex items-center justify-center shrink-0">
        <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          {submission.email ? (
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
              {submission.email}
            </span>
          ) : (
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              Submission without email
            </span>
          )}
        </div>
        
        <div className="flex items-center mt-1 gap-3">
          <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
            {submission.id.slice(0, 8)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {submission.formName}
          </span>
          <span className="flex items-center text-xs text-gray-400 dark:text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
      
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-7 w-7 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
          <ArrowUpRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
    </div>
  )
} 