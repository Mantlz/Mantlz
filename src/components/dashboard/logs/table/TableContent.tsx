"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Globe, MapPin, Loader2, Maximize2, Bell, Lock, Sparkles, BarChart, AlertCircle, Filter, CalendarRange, Calendar as CalendarIcon } from "lucide-react"
import { UpgradeModal } from "@/components/modals/UpgradeModal"
import { LogsTableContentProps, Submission } from "./types"
import { TableSubmissionSheet } from "./TableSubmissionSheet"
import { enhanceSubmissions, safeSearchParamsToString } from "./tableUtils"
import { NoSubmissionsView } from "./NoSubmissionsView"
import { SubmissionTableSkeleton } from "./SubmissionTableSkeleton"
import { toast } from "sonner"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { usePathname } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function TableContent({ 
  data, 
  isLoading, 
  page, 
  pagination, 
  searchParams, 
  router, 
  isPremium,
  userPlan,
  refetch
}: LogsTableContentProps) {
  const pathname = usePathname();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  
  // Get initial date range values from URL parameters if they exist
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');
    
  // Safely parse dates (will be null if invalid)
  const initialStartDate = startDateParam ? new Date(startDateParam) : null;
  const initialEndDate = endDateParam ? new Date(endDateParam) : null;

  // Check if date filter is active based on valid dates in URL
  const isDateFilterActive = !!(startDateParam || endDateParam);
    
  // State for date range picker
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Check if user has pro plan for advanced filtering
  const isProPlan = userPlan === 'PRO';

  if (isLoading || !data) {
    return <SubmissionTableSkeleton isPremium={isPremium} />
  }

  const { submissions = [] } = data

  // Enhance submissions with analytics data
  const enhancedSubmissions = enhanceSubmissions(submissions)

  // Add premium rule: standard users only see submissions from the last 30 days
  const standardTimeLimit = new Date()
  standardTimeLimit.setDate(standardTimeLimit.getDate() - 30)
  
  // Limit submissions for non-premium users
  const limitedSubmissions = isPremium 
    ? enhancedSubmissions 
    : userPlan === 'FREE'
        ? enhancedSubmissions
            .filter(sub => new Date(sub.createdAt) > standardTimeLimit)
            .slice(0, 20)
        : enhancedSubmissions
            .filter(sub => new Date(sub.createdAt) > standardTimeLimit)
  
  // Count how many are filtered out by time limit
  const timeLimitedCount = !isPremium ? 
    enhancedSubmissions.filter(sub => new Date(sub.createdAt) <= standardTimeLimit).length : 0
    
  // Count how many are filtered out by the 20 limit (free plan only)
  const freePlanLimitedCount = userPlan === 'FREE' && enhancedSubmissions.length > 20 
    ? enhancedSubmissions.filter(sub => new Date(sub.createdAt) > standardTimeLimit).length - 20 
    : 0

  if (submissions.length === 0) {
    return <NoSubmissionsView />
  }

  // A function to stringify search params safely
  function createSearchParams() {
    if (typeof searchParams.toString === 'function') {
      return new URLSearchParams(searchParams.toString())
    }
    // Fallback for when toString is not available
    return new URLSearchParams()
  }

  // Update handlePaginationChange
  function handlePaginationChange(newPage: number) {
    const newParams = new URLSearchParams(safeSearchParamsToString(searchParams))
    newParams.set("page", String(newPage))
    router.push(`${pathname}?${newParams.toString()}`)
  }

  function openSubmissionDetails(submission: Submission) {
    if (isPremium) {
      setSelectedSubmission(submission)
      // No toast for premium users
    } else {
      // For non-premium users, show limited data preview
      setSelectedSubmission(submission) 
      // toast("Limited View Mode", {
      //   description: "Upgrade to premium for complete submission details and analytics.",
      //   action: {
      //     label: "Upgrade",
      //     onClick: () => setShowUpgradeModal(true)
      //   },
      //   icon: <Lock className="h-4 w-4 text-amber-500" />,
      //   duration: 5000,
      // })
    }
  }

  function viewFullDetails(submission: Submission) {
    const newParams = new URLSearchParams(searchParams)
    newParams.set("submissionId", submission.id)
    router.push(`${pathname}?${newParams.toString()}`)
  }

  // Apply date filter
  const handleApplyFilter = () => {
    if (!isPremium) {
      setShowUpgradeModal(true);
      setIsCalendarOpen(false);
      return;
    }
    
    // Only PRO users can apply date filters
    if (!isProPlan) {
      toast("PRO Plan Required", {
        description: "Date filtering is only available with our PRO plan.",
        action: {
          label: "Upgrade",
          onClick: () => setShowUpgradeModal(true)
        },
        icon: <Sparkles className="h-4 w-4 text-amber-500" />,
        duration: 5000,
      });
      setIsCalendarOpen(false);
      return;
    }

    if (!startDate && !endDate) return;
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (startDate) {
      params.set('startDate', startDate.toISOString());
    } else {
      params.delete('startDate');
    }
    
    if (endDate) {
      params.set('endDate', endDate.toISOString());
    } else {
      params.delete('endDate');
    }
    
    // Reset to page 1 when filter changes
    params.set('page', '1');
    
    router.push(`${pathname}?${params.toString()}`);
    setIsCalendarOpen(false);
    
    // Trigger refetch of data with new parameters
    if (refetch) {
      refetch();
    }
  };

  // Clear date filter
  const handleClearFilter = () => {
    if (!isPremium || !isProPlan) return;
    
    setStartDate(null);
    setEndDate(null);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete('startDate');
    params.delete('endDate');
    
    router.push(`${pathname}?${params.toString()}`);
    setIsCalendarOpen(false);
    
    // Trigger refetch of data with new parameters
    if (refetch) {
      refetch();
    }
  };

  const getUpgradeReason = () => {
    if (timeLimitedCount > 0) {
      return "Historical Data Access"
    } else if (enhancedSubmissions.length > 20) {
      return "View All Submissions"
    } else if (isFiltering) {
      return "Advanced Filtering" 
    } else {
      return "Premium Features"
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Submission Logs
            </h3>
            <Badge className="ml-2 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-200">
              {submissions.length} submissions
            </Badge>
            {userPlan === 'FREE' && enhancedSubmissions.filter(sub => new Date(sub.createdAt) > standardTimeLimit).length > 20 && (
              <Badge variant="outline" className="ml-1 text-[10px] border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
                Showing 20 of {enhancedSubmissions.filter(sub => new Date(sub.createdAt) > standardTimeLimit).length} submissions
              </Badge>
            )}
            {isPremium && isDateFilterActive && (
              <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Date Filtered
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Popover open={isCalendarOpen} onOpenChange={(open) => {
              if (!isPremium) {
                setShowUpgradeModal(true);
                return;
              }
              
              if (!isProPlan) {
                toast("PRO Plan Required", {
                  description: "Date filtering is only available with our PRO plan.",
                  action: {
                    label: "Upgrade",
                    onClick: () => setShowUpgradeModal(true)
                  },
                  icon: <Sparkles className="h-4 w-4 text-amber-500" />,
                });
                return;
              }
              
              setIsCalendarOpen(open);
            }}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 border-dashed cursor-pointer relative"
                >
                  <CalendarRange className="h-3.5 w-3.5" />
                  <span>Date Range</span>
                  {!isProPlan && (
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full">
                      PRO
                    </div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg" align="end">
                <div className="p-3">
                  <Calendar
                    mode="range"
                    selected={{
                      from: startDate ?? undefined,
                      to: endDate ?? undefined
                    }}
                    onSelect={(range) => {
                      setStartDate(range?.from ?? null);
                      setEndDate(range?.to ?? null);
                    }}
                    className="rounded-md border"
                  />
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={handleApplyFilter}
                      className="flex-1"
                      disabled={!startDate || !endDate}
                    >
                      Apply Filter
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCalendarOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Include active filter info when filter is applied */}
        {isPremium && isProPlan && isDateFilterActive && (
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-zinc-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
              <CalendarRange className="h-4 w-4" />
              <span>
                Showing filtered submissions
                {initialStartDate && (
                  <>
                    {" "}from{" "}
                    <strong>{initialStartDate.toLocaleDateString()}</strong>
                  </>
                )}
                {initialEndDate && (
                  <>
                    {" "}to{" "}
                    <strong>{initialEndDate.toLocaleDateString()}</strong>
                  </>
                )}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilter}
              className="h-7 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20"
            >
              Clear Filter
            </Button>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-zinc-200 dark:border-zinc-800">
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                  <span className="hidden sm:inline">Submission ID</span>
                  <span className="sm:hidden">ID</span>
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">Email</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                  <div className="flex items-center">
                    <span>Status</span>
                  </div>
                </TableHead>
                {isPremium && (
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4 hidden md:table-cell">
                    <div className="flex items-center">
                      <span>Analytics</span>
                    </div>
                  </TableHead>
                )}
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                  Submitted
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {limitedSubmissions.map((submission) => (
                <TableRow
                  key={submission.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 last:border-0"
                >
                  <TableCell className="py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                      <span className="font-mono text-xs text-gray-600 dark:text-gray-400">{submission.id.slice(0, 8)}...</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px] sm:max-w-[200px]">
                        {submission.email || "No email"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4">
                    <div className="flex flex-col gap-1">
                      <EmailStatusBadge submission={submission} isPremium={isPremium} />
                    </div>
                  </TableCell>
                  {isPremium && (
                    <TableCell className="py-3 sm:py-4 hidden md:table-cell">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Globe className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            {submission.analytics.browser}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            {submission.analytics.location}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openSubmissionDetails(submission)}
                      className="h-7 px-2 text-xs  cursor-pointer bg-white hover:bg-zinc-100 text-gray-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-gray-300 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-all duration-200"
                    >
                      <Maximize2 className="h-3 w-3 mr-1" />
                      <span>Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {userPlan === 'FREE' && (freePlanLimitedCount > 0 || timeLimitedCount > 0) && (
                <TableRow className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-200 dark:border-zinc-800">
                  <TableCell colSpan={5} className="py-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="flex items-center gap-2">
                        {timeLimitedCount > 0 ? (
                          <>
                            <CalendarRange className="h-4 w-4 text-amber-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {timeLimitedCount} older submissions available with Premium
                            </span>
                          </>
                        ) : freePlanLimitedCount > 0 ? (
                          <>
                            <Lock className="h-4 w-4 text-amber-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Free plan limited to 20 submissions. Upgrade to see {freePlanLimitedCount} more submissions.
                            </span>
                          </>
                        ) : null}
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-2 mt-2 max-w-lg">
                        <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1 flex items-center">
                          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                          Premium Plan Features
                        </h4>
                        <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1 pl-5 list-disc">
                          <li><strong>Full Data Access:</strong> See all historical submissions (not just 30 days)</li>
                          <li><strong>Detailed View:</strong> Access complete submission details and analytics</li>
                          <li><strong>Advanced Filtering:</strong> Filter and search by date, status, and more</li>
                          <li><strong>Developer Notifications:</strong> Track both user and developer email statuses</li>
                        </ul>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setShowUpgradeModal(true)
                          // No toast for the button click since we're showing the modal immediately
                        }}
                        className="h-8 mt-3 cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full transition-all duration-200"
                      >
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                        <span>Upgrade Now</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {pagination && pagination.pages > 1 && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            {!isPremium && (
              <div className="flex items-center gap-1 mr-2">
                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-[10px] text-amber-600 dark:text-amber-400">
                  {userPlan === 'FREE' ? 'Free users: 20 submissions from last 30 days only' : 'Standard users: last 30 days only'}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Page {pagination.currentPage} of {userPlan === 'FREE' ? Math.min(pagination.pages, 4) : pagination.pages}
              {!isPremium && " (Limited view)"}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage <= 1}
                onClick={() => handlePaginationChange(pagination.currentPage - 1)}
                className="h-8 text-xs bg-white hover:bg-zinc-100 text-gray-600 dark:bg-zinc-900 cursor-pointer dark:hover:bg-zinc-800 dark:text-gray-300 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </Button>
              {(userPlan !== 'FREE' || pagination.currentPage < 4) ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage >= (userPlan === 'FREE' ? Math.min(pagination.pages, 4) : pagination.pages)}
                  onClick={() => handlePaginationChange(pagination.currentPage + 1)}
                  className="h-8 text-xs bg-white hover:bg-zinc-100 text-gray-600  dark:bg-zinc-900 cursor-pointer dark:hover:bg-zinc-800 dark:text-gray-300 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setShowUpgradeModal(true)}
                  className="h-8 bg-gradient-to-r from-amber-500 cursor-pointer to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all duration-200"
                >
                  <Lock className="h-3.5 w-3.5 mr-1.5" />
                  <span>Upgrade for More</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedSubmission && (
        <TableSubmissionSheet
          submission={selectedSubmission}
          isOpen={!!selectedSubmission}
          setIsOpen={(open) => !open && setSelectedSubmission(null)}
          onViewFull={() => viewFullDetails(selectedSubmission)}
          isPremium={isPremium}
        />
      )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName={getUpgradeReason()}
        featureIcon={
          timeLimitedCount > 0 ? (
            <CalendarRange className="h-5 w-5 m-2 text-amber-500" />
          ) : isFiltering ? (
            <Filter className="h-5 w-5 m-2 text-amber-500" />
          ) : (
            <Sparkles className="h-5 w-5 m-2 text-amber-500" />
          )
        }
        description={
          timeLimitedCount > 0
            ? "Access historical data, including submissions older than 30 days. Unlock comprehensive submission history with our premium plan."
            : isFiltering
            ? "Apply advanced filters to submissions by date, email status, and more with our premium plan."
            : userPlan === 'FREE' 
              ? "Free plan is limited to 20 submissions in the last 30 days. Upgrade to view all your submissions, access analytics, and unlock comprehensive submission history."
              : "Access comprehensive submission data, advanced analytics and unlimited submission history with our premium plan."
        }
      />
    </>
  )
}

function EmailStatusBadge({ submission, isPremium }: { submission: Submission, isPremium: boolean }) {
  // User Email Status
  const userEmailStatus = getUserEmailStatus(submission);
  
  // Developer Email Status
  const devEmailStatus = getDeveloperEmailStatus(submission);
  
  return (
    <div className="flex flex-col gap-1">
      {/* User Email Status */}
      <Badge 
        className={`text-[10px] ${userEmailStatus.className}`}
        variant={userEmailStatus.variant}
      >
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3" />
          <span className="hidden sm:inline">User: </span>
          <span>{userEmailStatus.text}</span>
        </div>
      </Badge>
      
      {/* Developer Email Status */}
      <Badge 
        className={`text-[10px] ${devEmailStatus.className}`}
        variant={devEmailStatus.variant}
      >
        <div className="flex items-center gap-1">
          <Bell className="h-3 w-3" />
          <span className="hidden sm:inline">Dev: </span>
          <span>{devEmailStatus.text}</span>
        </div>
      </Badge>
    </div>
  );
}

// Helper function to determine user email status
function getUserEmailStatus(submission: Submission) {
  // No email provided
  if (!submission.email) {
    return {
      text: "No Email",
      className: "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700",
      variant: "outline" as const
    };
  }
  
  // Check for sent email confirmation
  if (submission.notificationLogs?.some(log => 
    log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'SENT'
  )) {
    return {
      text: "Sent",
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-700/30",
      variant: "default" as const
    };
  }
  
  // Check for failed email
  if (submission.notificationLogs?.some(log => 
    log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'FAILED'
  )) {
    return {
      text: "Failed",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-700/30",
      variant: "default" as const
    };
  }
  
  // Check for skipped email
  if (submission.notificationLogs?.some(log => 
    log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'SKIPPED'
  )) {
    return {
      text: "Skipped",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700/30",
      variant: "default" as const
    };
  }
  
  // Default case - pending
  return {
    text: "Pending",
    className: "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700",
    variant: "outline" as const
  };
}

// Helper function to determine developer email status
function getDeveloperEmailStatus(submission: Submission) {
  // Check for sent notification
  if (submission.notificationLogs?.some(log => 
    log.type === 'DEVELOPER_NOTIFICATION' && log.status === 'SENT'
  )) {
    return {
      text: "Sent",
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-700/30",
      variant: "default" as const
    };
  }
  
  // Check for failed notification
  if (submission.notificationLogs?.some(log => 
    log.type === 'DEVELOPER_NOTIFICATION' && log.status === 'FAILED'
  )) {
    return {
      text: "Failed",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-700/30",
      variant: "default" as const
    };
  }
  
  // Check for skipped notification
  if (submission.notificationLogs?.some(log => 
    log.type === 'DEVELOPER_NOTIFICATION' && log.status === 'SKIPPED'
  )) {
    return {
      text: "Skipped",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700/30",
      variant: "default" as const
    };
  }
  
  // Default case - pending
  return {
    text: "Pending",
    className: "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700",
    variant: "outline" as const
  };
} 