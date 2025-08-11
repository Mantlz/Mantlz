"use client"

import { useState, useEffect } from "react"
import { Filter, Search, X, Lock, Clock, CalendarRange, ArrowDownUp } from "lucide-react"
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
import { Input } from "@/components/ui/input"


interface SearchDialogProps {
  search: string
  setSearch: (value: string) => void
  isLoading: boolean
  debouncedSearch: string
  formsData: { forms: Form[] }
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

  useEffect(() => {
    // Store the original body overflow style
    const originalOverflow = document.body.style.overflow;
    // Prevent scrolling on mount
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling on unmount
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  const handleApplyFilters = () => {
    if (isProUser && setAdvancedFilters) {
      // console.log("Applying advanced filters:", tempFilters)
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
    return (
      <div className="pt-1 text-[10px] text-gray-400 dark:text-zinc-500 px-3">
        <span>Search tips: </span>
        <span className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono mx-1">email@example.com</span>
        <span className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono mx-1">abc123</span>
        {isProUser && (
          <>
            <span className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono mx-1">@id:abc123</span>
            <span className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono mx-1">date:{'>'} 2023-01-01</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" onClick={onClose} />
      <div className="relative z-50 bg-white dark:bg-zinc-900 rounded-lg max-w-[90vw] w-[550px] overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-lg flex items-center px-3 py-1.5 flex-1 transition-shadow hover:shadow-inner">
            <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400 dark:text-zinc-500" />
            <Input 
              placeholder={`${isProUser ? 'Search' : 'Search'} by email, ID${isProUser ? ', or content' : ''}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-full w-full bg-transparent py-1 text-sm outline-none border-none placeholder:text-gray-400 dark:placeholder:text-zinc-500" 
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
                  className="h-9 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-gray-700 dark:text-gray-300 rounded-lg min-w-[140px] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:ring-orange-400/20 dark:focus:border-orange-400 cursor-pointer hover:bg-zinc-50 dark:hover:bg-amber-500transition-all duration-200 "
                >
                  <SelectValue placeholder="Choose a form" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm rounded-xl overflow-hidden  min-w-[200px] max-w-[300px]">
                  <SelectGroup>
                    <div className="p-2 max-h-[300px] overflow-y-auto">
                      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-500 px-2 py-1 mb-1">
                        Available Forms ({formsData.forms.length})
                      </div>
                      <SelectItem 
                        value="all" 
                        disabled={!isProUser}
                        className={`relative rounded-lg mb-1 px-3 py-2.5 cursor-pointer transition-all duration-200 ${
                          !isProUser 
                            ? "opacity-50 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20" 
                            : "hover:bg-zinc-50 dark:hover:bg-amber-500focus:bg-zinc-100 dark:focus:bg-zinc-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-500 flex-shrink-0"></div>
                            <span className="font-medium truncate">All Forms</span>
                          </div>
                          {!isProUser && (
                            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ml-2">
                              PRO
                            </span>
                          )}
                        </div>
                      </SelectItem>
                      
                      <div className="border-t border-zinc-200 dark:border-zinc-800 my-2"></div>
                      
                      {formsData.forms.map((form: Form, index: number) => {
                        const truncatedName = form.name.length > 15 
                          ? `${form.name.substring(0, 15)}...` 
                          : form.name;
                        
                        return (
                          <SelectItem 
                            key={form.id} 
                            value={form.id} 
                            className="rounded-lg mb-1 px-3 py-2.5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-amber-500focus:bg-zinc-100 dark:focus:bg-zinc-700 transition-all duration-200 group"
                          >
                            <div className="flex items-center gap-2 min-w-0 w-full" title={form.name}>
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                index % 4 === 0 ? 'bg-green-500' :
                                index % 4 === 1 ? 'bg-blue-500' :
                                index % 4 === 2 ? 'bg-amber-500' : 'bg-amber-500'
                              }`}></div>
                              <span className="font-medium truncate min-w-0 flex-1">
                                {truncatedName}
                              </span>
                              {form.name.length > 15 && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute left-0 top-full mt-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs px-2 py-1 rounded  z-50 whitespace-nowrap pointer-events-none">
                                  {form.name}
                                </div>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
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
                  className={`ml-2 p-1.5 rounded-lg ${
                    Object.keys(advancedFilters || {}).length > 0 
                      ? "bg-zinc-50 dark:bg-zinc-900/30 border border-orange-200 dark:border-orange-700/50 text-orange-500" 
                      : "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-500"
                  } transition-colors cursor-pointer`}
                  title="Advanced Filters"
                >
                  <Filter className={`h-4 w-4 ${Object.keys(advancedFilters || {}).length > 0 ? "text-orange-500" : ""}`} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 rounded-lg border border-zinc-200 dark:border-zinc-700  bg-white dark:bg-zinc-900" align="end">
                <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                  <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">Advanced Search</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">Pro users can filter with these advanced options</p>
                </div>
                
                <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="date-range" className="border-b border-zinc-200 dark:border-zinc-800">
                      <AccordionTrigger className="text-sm py-2 hover:bg-zinc-50 dark:hover:bg-amber-500/50 px-2 rounded-lg transition-colors">
                        <div className="flex items-center">
                          <CalendarRange className="h-4 w-4 mr-2 text-zinc-500" />
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
                    
                    <AccordionItem value="quick-timeframe" className="border-b border-zinc-200 dark:border-zinc-800">
                      <AccordionTrigger className="text-sm py-2 hover:bg-zinc-50 dark:hover:bg-amber-500/50 px-2 rounded-lg transition-colors">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-zinc-500" />
                          <span>Time Frame</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-1 grid grid-cols-4 gap-2">
                          {['all', '24h', '7d', '30d'].map((period) => (
                            <button
                              key={period}
                              onClick={() => setTempFilters({...tempFilters, timeFrame: period as 'all' | '24h' | '7d' | '30d'})}
                              className={`px-2 py-1 text-xs rounded-lg border ${
                                tempFilters.timeFrame === period 
                                  ? 'bg-zinc-50 border-orange-200 text-orange-700 dark:bg-zinc-900/30 dark:border-orange-800 dark:text-orange-400' 
                                  : 'bg-zinc-50 border-zinc-200 text-gray-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-300'
                              } transition-all`}
                            >
                              {period === 'all' ? 'All Time' : period}
                            </button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="sort-order" className="border-b border-zinc-200 dark:border-zinc-800">
                      <AccordionTrigger className="text-sm py-2 hover:bg-zinc-50 dark:hover:bg-amber-500/50 px-2 rounded-lg transition-colors">
                        <div className="flex items-center">
                          <ArrowDownUp className="h-4 w-4 mr-2 text-zinc-500" />
                          <span>Sort Order</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-1 flex gap-2">
                          <button
                            onClick={() => setTempFilters({...tempFilters, sortOrder: 'newest'})}
                            className={`flex-1 px-3 py-1.5 text-xs rounded-lg border ${
                              tempFilters.sortOrder !== 'oldest' 
                                ? 'bg-zinc-50 border-orange-200 text-orange-700 dark:bg-zinc-900/30 dark:border-orange-800 dark:text-orange-400' 
                                : 'bg-zinc-50 border-zinc-200 text-gray-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-300'
                            } transition-all`}
                          >
                            Newest First
                          </button>
                          <button
                            onClick={() => setTempFilters({...tempFilters, sortOrder: 'oldest'})}
                            className={`flex-1 px-3 py-1.5 text-xs rounded-lg border ${
                              tempFilters.sortOrder === 'oldest'
                                ? 'bg-zinc-50 border-orange-200 text-orange-700 dark:bg-zinc-900/30 dark:border-orange-800 dark:text-orange-400' 
                                : 'bg-zinc-50 border-zinc-200 text-gray-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-300'
                            }  transition-all`}
                          >
                            Oldest First
                          </button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="content-filters" className="border-b border-zinc-200 dark:border-zinc-800">
                      <AccordionTrigger className="text-sm py-2 hover:bg-zinc-50 dark:hover:bg-amber-500/50 px-2 rounded-lg transition-colors">
                        <div className="flex items-center">
                          <Filter className="h-4 w-4 mr-2 text-zinc-500" />
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
                              className="data-[state=checked]:bg-green-500"
                            />
                            <Label htmlFor="has-email" className="text-xs">Only with email</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="has-attachments" 
                              checked={tempFilters.showOnlyWithAttachments || false}
                              onCheckedChange={(checked) => setTempFilters({...tempFilters, showOnlyWithAttachments: checked})}
                              className="data-[state=checked]:bg-green-500"
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
                    className="text-xs h-8 rounded-lg"
                  >
                    Reset Filters
                  </Button>
                  <Button 
                    onClick={handleApplyFilters} 
                    className="text-xs h-8 rounded-lg bg-zinc-600 hover:bg-zinc-700 text-white font-medium"
                  >
                    Apply Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="relative ml-2">
              <button
                className="p-1.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 text-gray-400/50 dark:text-zinc-500/50 cursor-not-allowed opacity-70"
                title="Advanced Filters (PRO)"
                onClick={showUpgradeModal}
              >
                <Filter className="h-4 w-4" />
              </button>
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-lg">
                PRO
              </span>
            </div>
          )}
          
          <button 
            onClick={onClose}
            className="ml-3 p-1.5 rounded-lg hover:bg-amber-500 dark:hover:bg-amber-500text-gray-400 dark:text-zinc-500 hover:text-white dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {renderSearchHint()}
        
        {isProUser && advancedFilters && Object.keys(advancedFilters).length > 0 && (
          <div className="px-4 py-2 bg-zinc-50/80 dark:bg-zinc-900/10 border-b border-orange-100 dark:border-orange-800/20 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-orange-700 dark:text-orange-400">Active filters:</span>
            {advancedFilters.dateRange && (
              <Badge className="bg-zinc-100 text-orange-700 dark:bg-zinc-900/30 dark:text-orange-400 text-[10px] rounded-lg px-2.5">
                Date Range
              </Badge>
            )}
            {advancedFilters.timeFrame && advancedFilters.timeFrame !== 'all' && (
              <Badge className="bg-zinc-100 text-orange-700 dark:bg-zinc-900/30 dark:text-orange-400 text-[10px] rounded-lg px-2.5">
                Last {advancedFilters.timeFrame}
              </Badge>
            )}
            {advancedFilters.sortOrder && (
              <Badge className="bg-zinc-100 text-orange-700 dark:bg-zinc-900/30 dark:text-orange-400 text-[10px] rounded-lg px-2.5">
                {advancedFilters.sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
              </Badge>
            )}
            {advancedFilters.hasEmail && (
              <Badge className="bg-zinc-100 text-orange-700 dark:bg-zinc-900/30 dark:text-orange-400 text-[10px] rounded-lg px-2.5">
                Has Email
              </Badge>
            )}
            {advancedFilters.showOnlyWithAttachments && (
              <Badge className="bg-zinc-100 text-orange-700 dark:bg-zinc-900/30 dark:text-orange-400 text-[10px] rounded-lg px-2.5">
                Has Attachments
              </Badge>
            )}
            <button
              onClick={handleResetFilters}
              className="text-[10px] text-orange-700 dark:text-orange-400 hover:underline ml-auto"
            >
              Reset
            </button>
          </div>
        )}
        
        {!isProUser && selectedFormId === null && (
          <div className="mx-4 my-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-600 dark:text-amber-500" />
              <span className="text-sm text-amber-500 dark:text-amber-300">Select a form to search</span>
            </div>
            {showUpgradeModal && (
              <button 
                onClick={showUpgradeModal}
                className="text-xs px-3 py-1 cursor-pointer bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium transition-colors"
              >
                Upgrade
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
        
        <div className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs text-gray-400 dark:text-zinc-500">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="mr-1">Press</span>
              <div className="inline-flex h-5 select-none items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium">
                Esc
              </div>
              <span className="ml-1">to close</span>
            </div>
            {data?.submissions && data.submissions.length > 0 && (
              <Badge variant="secondary" className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-lg px-2.5">
                {!isProUser && data.submissions.length >= 10 ? "10+ results" : `${data.submissions.length} results`}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}