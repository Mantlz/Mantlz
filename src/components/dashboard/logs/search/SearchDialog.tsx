"use client"

import { useState } from "react"
import { Filter, Loader2, MessageSquare, Search, X, ArrowUpRight, Calendar, Mail, Lock, Sparkles, CheckIcon, Clock, CalendarRange, ArrowDownUp } from "lucide-react"
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

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
  setAdvancedFilters?: (filters: AdvancedFilters) => void
  advancedFilters?: AdvancedFilters
}

interface AdvancedFilters {
  dateRange?: { from: Date | undefined; to?: Date | undefined }
  showOnlyWithAttachments?: boolean
  sortOrder?: 'newest' | 'oldest'
  timeFrame?: 'all' | '24h' | '7d' | '30d'
  hasEmail?: boolean
  browser?: string
  location?: string
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
  showUpgradeModal,
  advancedFilters,
  setAdvancedFilters
}: SearchDialogProps) {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [tempFilters, setTempFilters] = useState<AdvancedFilters>(advancedFilters || {})

  const handleApplyFilters = () => {
    if (isProUser && setAdvancedFilters) {
      setAdvancedFilters(tempFilters)
      setShowAdvancedSearch(false)
    }
  }

  const handleResetFilters = () => {
    if (isProUser && setAdvancedFilters) {
      const emptyFilters: AdvancedFilters = {}
      setTempFilters(emptyFilters)
      setAdvancedFilters(emptyFilters)
    }
  }

  const renderSearchHint = () => {
    if (!isProUser) return null;

    return (
      <div className="pt-1 text-[10px] text-gray-400 dark:text-gray-500 px-3">
        <span>Pro Search: </span>
        <span className="px-1 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 font-mono mx-1">@id:abc</span>
        <span className="px-1 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 font-mono mx-1">email:test@ex.com</span>
        <span className="px-1 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 font-mono mx-1">date:{'>'} 2023-01-01</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-[90vw] w-[550px] overflow-hidden border border-gray-200 dark:border-gray-800/50">
        <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800/50">
          <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-gray-700/50 rounded-full flex items-center px-3 py-1.5 flex-1">
            <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
            <input 
              placeholder={`${isProUser ? 'Pro search' : 'Search'} ${selectedFormId ? 'this form' : 'all forms'}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-full w-full bg-transparent py-1 text-sm outline-none border-none placeholder:text-gray-400 dark:placeholder:text-gray-500" 
              autoFocus 
            />
          </div>
          
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
          
          {isProUser ? (
            <Popover open={showAdvancedSearch} onOpenChange={setShowAdvancedSearch}>
              <PopoverTrigger asChild>
                <button
                  className="ml-2 p-1.5 rounded-full bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                  title="Advanced Filters"
                >
                  <Filter className={`h-4 w-4 ${Object.keys(advancedFilters || {}).length > 0 ? "text-blue-500" : ""}`} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">Advanced Search</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pro users can filter with these advanced options</p>
                </div>
                
                <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="date-range">
                      <AccordionTrigger className="text-sm py-2">
                        <div className="flex items-center">
                          <CalendarRange className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Date Range</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-1">
                          <DateRangePicker 
                            value={tempFilters.dateRange}
                            onChange={(range) => setTempFilters({...tempFilters, dateRange: range})}
                            className="w-full"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="quick-timeframe">
                      <AccordionTrigger className="text-sm py-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Time Frame</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-1 grid grid-cols-4 gap-2">
                          {['all', '24h', '7d', '30d'].map((period) => (
                            <button
                              key={period}
                              onClick={() => setTempFilters({...tempFilters, timeFrame: period as any})}
                              className={`px-2 py-1 text-xs rounded-md border ${
                                tempFilters.timeFrame === period 
                                  ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' 
                                  : 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {period === 'all' ? 'All Time' : period}
                            </button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="sort-order">
                      <AccordionTrigger className="text-sm py-2">
                        <div className="flex items-center">
                          <ArrowDownUp className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Sort Order</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-1 flex gap-2">
                          <button
                            onClick={() => setTempFilters({...tempFilters, sortOrder: 'newest'})}
                            className={`flex-1 px-3 py-1.5 text-xs rounded-md border ${
                              tempFilters.sortOrder !== 'oldest' 
                                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' 
                                : 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                            }`}
                          >
                            Newest First
                          </button>
                          <button
                            onClick={() => setTempFilters({...tempFilters, sortOrder: 'oldest'})}
                            className={`flex-1 px-3 py-1.5 text-xs rounded-md border ${
                              tempFilters.sortOrder === 'oldest'
                                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' 
                                : 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                            }`}
                          >
                            Oldest First
                          </button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="content-filters">
                      <AccordionTrigger className="text-sm py-2">
                        <div className="flex items-center">
                          <Filter className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Content Filters</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-1 space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="has-email" 
                              checked={tempFilters.hasEmail || false}
                              onCheckedChange={(checked) => setTempFilters({...tempFilters, hasEmail: checked})}
                            />
                            <Label htmlFor="has-email" className="text-xs">Only with email</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="has-attachments" 
                              checked={tempFilters.showOnlyWithAttachments || false}
                              onCheckedChange={(checked) => setTempFilters({...tempFilters, showOnlyWithAttachments: checked})}
                            />
                            <Label htmlFor="has-attachments" className="text-xs">Has attachments</Label>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                
                <Separator />
                
                <div className="p-3 flex justify-between">
                  <Button 
                    variant="ghost" 
                    onClick={handleResetFilters} 
                    className="text-xs h-8"
                  >
                    Reset Filters
                  </Button>
                  <Button 
                    onClick={handleApplyFilters} 
                    className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Apply Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
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
        
        {renderSearchHint()}
        
        {isProUser && advancedFilters && Object.keys(advancedFilters).length > 0 && (
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-800/20 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-blue-700 dark:text-blue-400">Active filters:</span>
            {advancedFilters.dateRange && (
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px]">
                Date Range
              </Badge>
            )}
            {advancedFilters.timeFrame && advancedFilters.timeFrame !== 'all' && (
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px]">
                Last {advancedFilters.timeFrame}
              </Badge>
            )}
            {advancedFilters.sortOrder && (
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px]">
                {advancedFilters.sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
              </Badge>
            )}
            {advancedFilters.hasEmail && (
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px]">
                Has Email
              </Badge>
            )}
            {advancedFilters.showOnlyWithAttachments && (
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px]">
                Has Attachments
              </Badge>
            )}
            <button
              onClick={handleResetFilters}
              className="text-[10px] text-blue-700 dark:text-blue-400 hover:underline ml-auto"
            >
              Reset
            </button>
          </div>
        )}
        
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