"use client"

import { Filter, Loader2, MessageSquare, Search, X, ArrowUpRight, Calendar, Mail, Lock, Sparkles, CheckIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Form, SearchResult, Submission } from "./types"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchResults } from "./SearchResults"

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
  isProUser?: boolean
  showUpgradeModal?: () => void
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
  onSelectSubmission,
  isProUser = false,
  showUpgradeModal
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
              <Select 
                value={selectedFormId || "all"} 
                onValueChange={(value) => handleFormSelect(value)}
              >
                <SelectTrigger 
                  className="h-8 border border-gray-100 dark:border-gray-700/50 bg-gray-50 dark:bg-zinc-800 text-xs text-gray-700 dark:text-gray-300 rounded-full min-w-[130px] focus:ring-gray-200 dark:focus:ring-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <SelectValue placeholder="Select Form" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 text-xs">
                  <SelectGroup>
                    <div className="relative cursor-pointer">
                      <SelectItem 
                        value="all" 
                        disabled={!isProUser}
                        className={!isProUser ? "opacity-50 pl-8" : "pl-8"}
                      >
                        {isProUser ? "All Forms" : "All Forms"}
                        {!isProUser && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                            PRO
                          </span>
                        )}
                      </SelectItem>
                      {formsData.forms.map((form: Form) => (
                        <SelectItem key={form.id} value={form.id} className="pl-8">
                          {form.name}
                        </SelectItem>
                      ))}
                    </div>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Advanced filters button - Pro only */}
          {isProUser ? (
            <button
              className="ml-2 p-1.5 rounded-full bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
              title="Advanced Filters"
            >
              <Filter className="h-4 w-4" />
            </button>
          ) : (
            <div className="relative ml-2">
              <button
                className="p-1.5 rounded-full bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100/50 dark:border-gray-700/30 text-gray-400/50 dark:text-gray-500/50 cursor-not-allowed opacity-70"
                title="Advanced Filters (PRO)"
                onClick={showUpgradeModal}
              >
                <Filter className="h-4 w-4" />
              </button>
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                PRO
              </span>
            </div>
          )}
          
          <button 
            onClick={onClose}
            className="ml-3 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Pro plan indicator */}
        {!isProUser && selectedFormId === null && (
          <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
              <Lock className="h-3.5 w-3.5" />
              <span>Standard users can only search within a specific form</span>
            </div>
            {showUpgradeModal && (
              <button 
                onClick={showUpgradeModal}
                className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Upgrade to PRO</span>
              </button>
            )}
          </div>
        )}
        
        {/* Search results */}
        <div className="max-h-[65vh] overflow-y-auto">
          <SearchResults 
            isLoading={isLoading}
            debouncedSearch={debouncedSearch}
            data={data}
            onSelectSubmission={onSelectSubmission}
            selectedFormId={selectedFormId}
            isProUser={isProUser}
            showUpgradeModal={showUpgradeModal}
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
                {!isProUser && data.submissions.length >= 10 ? "10+ results" : `${data.submissions.length} results`}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 