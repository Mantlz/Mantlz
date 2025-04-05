"use client"

import { Loader2, MessageSquare, Search, Calendar, Mail, Lock, Sparkles, Clock, BarChart, Globe, MapPin, Inbox, ArrowUpRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { SearchResult, Submission } from "./types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
      <div className="flex flex-col items-center justify-center py-12 text-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400 mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Searching...</p>
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
      <div className="flex flex-col items-center justify-center py-16 text-center p-4">
        <Search className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Search for submissions</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
          Search by email address or submission ID
          {isProUser && " - Pro users can also search content and use advanced filters"}
        </p>
      </div>
    )
  }
  
  if (!data || data.submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center p-4">
        <Inbox className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No results found</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
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
        <div 
          key={submission.id} 
          className="p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer flex items-center"
          onClick={() => onSelectSubmission(submission)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mr-2">
                  {submission.email || 'Anonymous Submission'}
                </h4>
                {submission.email && (
                  <Badge variant="outline" className="rounded-full text-[9px] px-2 py-0 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    <Mail className="h-2.5 w-2.5 mr-1" />
                    Email
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="truncate">Form: <span className="font-medium text-gray-700 dark:text-gray-300">{submission.formName}</span></span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <time className="text-[10px] whitespace-nowrap">
                {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
              </time>
            </div>
          </div>
          
          <ArrowUpRight className="h-4 w-4 text-gray-400 dark:text-gray-500 self-center ml-2 flex-shrink-0" />
        </div>
      ))}
      
      {hasMoreResults && showUpgradeModal && (
        <div className="p-4 bg-gradient-to-b from-amber-50/50 to-amber-50 dark:from-amber-900/10 dark:to-amber-900/20 flex flex-col items-center">
          <div className="text-center mb-3">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white mb-2 rounded-full px-3 py-1">
              <Sparkles className="h-3 w-3 mr-1" />
              PRO Feature
            </Badge>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Upgrade to see all {data.submissions.length} results
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Standard users are limited to 10 results per search
            </p>
          </div>
          <Button
            onClick={showUpgradeModal}
            size="sm"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-none rounded-full px-4"
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