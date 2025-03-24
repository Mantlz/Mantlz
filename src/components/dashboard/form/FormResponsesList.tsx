import React from 'react';
import { useState } from "react"
import { format } from "date-fns"
import { AlertCircle, Inbox, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {SubmissionDetails} from "@/components/dashboard/form/SubmissionDetails"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Submission {
  id: string
  createdAt: Date
  data: any
}

interface FormResponsesListProps {
  isLoading: boolean
  isError: boolean
  submissions?: { submissions: Submission[] }
  onRetry: () => void
}

export function FormResponsesList({ isLoading, isError, submissions, onRetry }: FormResponsesListProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Form Responses</h3>
          <div className="w-24 h-9 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
        </div>
        
        <div className="overflow-hidden border border-gray-200 dark:border-zinc-800 rounded-lg">
          <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 border-b border-gray-200 dark:border-zinc-800 grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse"></div>
            ))}
          </div>
          
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="p-4 border-b last:border-0 border-gray-200 dark:border-zinc-800 grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-red-200 dark:border-red-900/30 p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-mono font-bold text-gray-900 dark:text-white mb-2">Failed to load responses</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">There was an error loading the form responses. Please try again.</p>
            <button 
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
              onClick={onRetry}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!submissions?.submissions || submissions.submissions.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-500 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No responses yet</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">This form has not received any submissions yet.</p>
          </div>
        </div>
      </div>
    )
  }

  // Calculate pagination
  const totalSubmissions = submissions?.submissions?.length || 0
  const totalPages = Math.ceil(totalSubmissions / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalSubmissions)
  const paginatedSubmissions = submissions?.submissions?.slice(startIndex, endIndex) || []

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Form Responses</h3>
        <span className="text-sm px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-full font-mono">{submissions.submissions.length} responses</span>
      </div>
      
      <div className="overflow-hidden border border-gray-200 dark:border-zinc-800 rounded-lg">
        <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 border-b border-gray-200 dark:border-zinc-800 grid grid-cols-4 gap-4">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Date</div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 text-right">Actions</div>
        </div>
        
        {paginatedSubmissions.map((submission) => (
          <div key={submission.id} className="p-4 border-b last:border-0 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="font-medium text-gray-900 dark:text-white truncate">{submission.data?.email || "—"}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {submission.createdAt ? format(new Date(submission.createdAt), "MMM d, yyyy h:mm a") : "—"}
              </div>
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                  Complete
                </span>
              </div>
              <div className="flex justify-end">
                <Sheet open={sheetOpen && selectedSubmission?.id === submission.id} onOpenChange={(open) => {
                  setSheetOpen(open);
                  if (!open) setSelectedSubmission(null);
                }}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="font-mono text-xs border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 group"
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setSheetOpen(true);
                      }}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5 opacity-70 group-hover:opacity-100" />
                      VIEW
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle className="font-mono text-gray-800 dark:text-gray-200">Response Details</SheetTitle>
                    </SheetHeader>
                    {selectedSubmission && (
                      <SubmissionDetails 
                        submission={{
                          id: selectedSubmission.id,
                          submittedAt: selectedSubmission.createdAt,
                          data: selectedSubmission.data
                        }} 
                      />
                    )}
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
} 