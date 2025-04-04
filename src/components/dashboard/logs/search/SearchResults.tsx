"use client"

import { Loader2, MessageSquare, Search, Calendar, Mail, Lock, Sparkles, Clock, BarChart, Globe, MapPin } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { SearchResult, Submission } from "./types"
import { Badge } from "@/components/ui/badge"

interface SearchResultsProps {
  isLoading: boolean
  debouncedSearch: string
  data: SearchResult | undefined
  onSelectSubmission: (submission: Submission) => void
  selectedFormId: string | null
  isProUser?: boolean
  showUpgradeModal?: () => void
}

export function SearchResults({ 
  isLoading, 
  debouncedSearch, 
  data, 
  onSelectSubmission,
  selectedFormId,
  isProUser = false,
  showUpgradeModal
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
  
  if (!isProUser && selectedFormId === null) {
    return (
      <div className="py-12 text-center px-4">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center">
          <Lock className="h-6 w-6 text-amber-500" />
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Pro Feature: Search Across All Forms
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-4">
          Standard users can search within a specific form. Please select a form to search or upgrade to PRO to search across all forms.
        </p>
        {showUpgradeModal && (
          <button 
            onClick={showUpgradeModal}
            className="px-3 py-1.5 text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full transition-all duration-200 inline-flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Upgrade to PRO</span>
          </button>
        )}
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
  
  // For Standard users, limit to 10 results
  const limitedResults = isProUser ? data.submissions : data.submissions.slice(0, 10);
  const hasMoreResults = !isProUser && data.submissions.length > 10;
  
  return (
    <>
      {/* Pro-only search analytics */}
      {isProUser && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Search Analytics</span>
            </div>
            <Badge className="text-[10px] bg-blue-100 dark:bg-blue-800/40 text-blue-600 dark:text-blue-400 px-1.5">
              PRO
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="bg-white dark:bg-zinc-800 rounded-md p-2 border border-blue-100 dark:border-blue-800/30">
              <div className="text-[10px] text-blue-600 dark:text-blue-400">Results</div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{data.submissions.length}</div>
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-md p-2 border border-blue-100 dark:border-blue-800/30">
              <div className="text-[10px] text-blue-600 dark:text-blue-400">Forms</div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {selectedFormId ? "1" : new Set(data.submissions.map(s => s.formId)).size}
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-md p-2 border border-blue-100 dark:border-blue-800/30">
              <div className="text-[10px] text-blue-600 dark:text-blue-400">Time Range</div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">All time</div>
            </div>
          </div>
        </div>
      )}

      <div className="py-2 divide-y divide-gray-100 dark:divide-gray-800/50">
        {limitedResults.map((submission) => (
          <SubmissionSearchResult 
            key={submission.id}
            submission={submission}
            onClick={() => onSelectSubmission(submission)}
            isProUser={isProUser}
          />
        ))}
        
        {/* For Standard users, show upgrade prompt if there are more than 10 results */}
        {hasMoreResults && showUpgradeModal && (
          <div className="p-4 text-center bg-gray-50 dark:bg-zinc-800/50">
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
              <span className="font-medium">{data.submissions.length - 10}</span> more results available with PRO
            </p>
            <button 
              onClick={showUpgradeModal}
              className="px-3 py-1.5 text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full transition-all duration-200 inline-flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Upgrade to PRO</span>
            </button>
          </div>
        )}
      </div>
    </>
  )
}

interface SubmissionSearchResultProps {
  submission: Submission
  onClick: () => void
  isProUser?: boolean
}

function SubmissionSearchResult({ submission, onClick, isProUser = false }: SubmissionSearchResultProps) {
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
          
          {/* Form name as badge */}
          <Badge 
            className={`ml-2 text-[10px] ${submission.formName === "Unknown Form" 
              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" 
              : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"} h-4`}
          >
            {submission.formName}
          </Badge>
          
          {/* Pro users see additional badges */}
          {isProUser && submission.status && (
            <Badge className="ml-2 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 h-4">
              {submission.status}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center mt-1 gap-3">
          <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
            {submission.id.slice(0, 8)}
          </span>
          
          {/* Show analytics info for Pro users */}
          {isProUser && submission.analytics && (
            <span className="flex items-center text-xs text-gray-400 dark:text-gray-500">
              {submission.analytics.browser && (
                <span className="inline-flex items-center mr-2">
                  <Globe className="h-3 w-3 mr-1" />
                  {submission.analytics.browser}
                </span>
              )}
              {submission.analytics.location && submission.analytics.location !== "Unknown" && (
                <span className="inline-flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {submission.analytics.location}
                </span>
              )}
            </span>
          )}
          
          <span className="flex items-center text-xs text-gray-400 dark:text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
      
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-7 w-7 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
          {isProUser ? (
            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">View</span>
          ) : (
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-500">View</span>
          )}
        </div>
      </div>
    </div>
  )
} 