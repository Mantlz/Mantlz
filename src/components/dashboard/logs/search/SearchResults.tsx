"use client"

import { Loader2, Search, Calendar, Mail, Lock, Sparkles, Globe, MapPin, FileSearch, Maximize2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { SearchResult, Submission } from "./types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getUserEmailStatus } from '@/lib/submissionUtils'

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
      <div className="p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-zinc-600 animate-spin" />
        </div>
        <p className="text-sm text-gray-600 dark:text-zinc-300">Loading results...</p>
      </div>
    )
  }
  
  if (!isProUser && selectedFormId === null) {
    return (
      <div className="py-12 text-center px-4">
        <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
          <Lock className="h-6 w-6 text-amber-500" />
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Pro Feature: Search Across All Forms
        </p>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-xs mx-auto mb-4">
          Standard users can search within a specific form. Please select a form to search or upgrade to PRO to search across all forms.
        </p>
      </div>
    )
  }
  
  if (!debouncedSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center p-4">
        <Search className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Search for submissions</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-md">
          Search by email address or submission ID
          {isProUser && " - Pro users can also search content and use advanced filters"}
        </p>
      </div>
    )
  }
  
  if (!data || data.submissions.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center">
          <FileSearch className="h-6 w-6 text-gray-400 dark:text-zinc-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Results Found</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-md">
          Try adjusting your search terms or filters
        </p>
      </div>
    )
  }
  
  // Limit results for standard users to 10
  const results = isProUser ? data.submissions : data.submissions.slice(0, 10);
  const hasMoreResults = !isProUser && data.submissions.length > 10;
  
  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
      {results.map((submission) => (
        <SubmissionSearchResult
          key={submission.id}
          submission={submission}
          onClick={() => onSelectSubmission(submission)}
          isProUser={isProUser}
          onViewClick={(e) => {
            e.stopPropagation()
            onSelectSubmission(submission)
          }}
        />
      ))}
      
      {hasMoreResults && showUpgradeModal && (
        <div className="p-4 bg-gradient-to-b from-amber-50/50 to-amber-50 dark:from-amber-900/10 dark:to-amber-900/20 flex flex-col items-center">
          <div className="text-center mb-3">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white mb-2 rounded-lg px-3 py-1">
              <Sparkles className="h-3 w-3 mr-1" />
              PRO Feature
            </Badge>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Upgrade to see all {data.submissions.length} results
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
              Standard users are limited to 10 results per search
            </p>
          </div>
          <Button
            onClick={showUpgradeModal}
            size="sm"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-none rounded-lg px-4"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Upgrade to PRO
          </Button>
        </div>
      )}
    </div>
  )
}

interface SubmissionSearchResultProps {
  submission: Submission
  onClick: () => void
  isProUser?: boolean
  onViewClick: (e: React.MouseEvent) => void
}

function SubmissionSearchResult({ 
  submission, 
  onClick, 
  isProUser = false,
  onViewClick 
}: SubmissionSearchResultProps) {
  const userEmailStatus = getUserEmailStatus(submission.notificationLogs);

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors group border-b border-zinc-200 dark:border-zinc-800 last:border-b-0"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mr-2">
              {submission.email || 'Anonymous Submission'}
            </h4>
            {submission.email && (
              <Badge 
                variant="secondary" 
                className={cn(
                  "ml-2 rounded-lg text-[9px] px-1.5 py-0 h-4 font-medium leading-none", 
                  userEmailStatus.color
                )}
              >
                <Mail className="h-2.5 w-2.5 mr-1" />
                {userEmailStatus.text}
              </Badge>
            )}
            {isProUser && submission.status && (
              <Badge className="ml-2 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 h-4">
                {submission.status}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="text-xs text-zinc-600 dark:text-zinc-300 flex items-center gap-2 flex-wrap">
          <span className="truncate">Form: <span className="font-medium text-gray-700 dark:text-gray-300">{submission.formName}</span></span>
          <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">•</span>
          {isProUser && submission.analytics && (
            <>
              <span className="flex items-center text-xs text-gray-400 dark:text-zinc-600">
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
              <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">•</span>
            </>
          )}
          <span className="flex items-center text-xs text-gray-400 dark:text-zinc-600">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 ml-auto shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 text-zinc-600 hover:text-gray-700 cursor-pointer dark:text-zinc-300 dark:hover:text-gray-300 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
          onClick={onViewClick}
          aria-label="View submission details"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
