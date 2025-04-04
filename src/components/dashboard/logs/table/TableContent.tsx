"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Calendar, Globe, MapPin, Loader2, Maximize2, Bell } from "lucide-react"
import { UpgradeModal } from "@/components/modals/UpgradeModal"
import { LogsTableContentProps, Submission } from "./types"
import { TableSubmissionSheet } from "./TableSubmissionSheet"
import { enhanceSubmissions } from "./tableUtils"
import { NoSubmissionsView } from "./NoSubmissionsView"
import { SubmissionTableSkeleton } from "./SubmissionTableSkeleton"

export function TableContent({ 
  data, 
  isLoading, 
  page, 
  pagination, 
  searchParams, 
  router, 
  isPremium 
}: LogsTableContentProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  if (isLoading || !data) {
    return <SubmissionTableSkeleton isPremium={isPremium} />
  }

  const { submissions = [] } = data

  // Enhance submissions with analytics data
  const enhancedSubmissions = enhanceSubmissions(submissions)

  if (submissions.length === 0) {
    return <NoSubmissionsView />
  }

  function handlePaginationChange(newPage: number) {
    const newParams = new URLSearchParams(searchParams)
    newParams.set("page", newPage.toString())
    router.push(`?${newParams.toString()}`)
  }

  function openSubmissionDetails(submission: Submission) {
    if (isPremium) {
      setSelectedSubmission(submission)
    } else {
      setShowUpgradeModal(true)
    }
  }

  function viewFullDetails(submission: Submission) {
    const newParams = new URLSearchParams(searchParams)
    newParams.set("submissionId", submission.id)
    router.push(`?${newParams.toString()}`)
  }

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-gray-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-gray-100 dark:border-gray-800/50">
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                  <span className="hidden sm:inline">Submission ID</span>
                  <span className="sm:hidden">ID</span>
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">Email</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                  Status
                </TableHead>
                {isPremium && (
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4 hidden md:table-cell">
                    Analytics
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
              {enhancedSubmissions.map((submission) => (
                <TableRow
                  key={submission.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800/50 last:border-0"
                >
                  <TableCell className="py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
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
                      <EmailStatusBadge submission={submission} />
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
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
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
                      className="h-7 px-2 text-xs bg-white hover:bg-gray-100 text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-full transition-all duration-200"
                    >
                      <Maximize2 className="h-3 w-3 mr-1" />
                      <span>Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {pagination && pagination.pages > 1 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Page {pagination.currentPage} of {pagination.pages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage <= 1}
                onClick={() => handlePaginationChange(pagination.currentPage - 1)}
                className="h-8 text-xs bg-white hover:bg-gray-100 text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-full transition-all duration-200"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage >= pagination.pages}
                onClick={() => handlePaginationChange(pagination.currentPage + 1)}
                className="h-8 text-xs bg-white hover:bg-gray-100 text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-full transition-all duration-200"
              >
                Next
              </Button>
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
        />
      )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Submission Details"
        featureIcon={<Maximize2 className="h-5 w-5 m-2 text-gray-700 dark:text-gray-300" />}
        description="Get detailed insights into each submission with our premium plan."
      />
    </>
  )
}

function EmailStatusBadge({ submission }: { submission: Submission }) {
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
      className: "bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
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
    className: "bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
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
    className: "bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
    variant: "outline" as const
  };
} 