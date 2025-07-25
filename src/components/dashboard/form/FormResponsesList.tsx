"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Eye, FileText, AlertCircle, Mail, Calendar, Download, FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SubmissionDetails } from "@/components/dashboard/form/SubmissionDetails"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent } from "@/components/ui/card"

// Define a FormData interface for submission data
export interface FormData {
  email: string | null
  [key: string]: string | number | boolean | string[] | null // Allow other form fields with specific types
}

interface Submission {
  id: string
  createdAt: Date
  data: FormData
}

interface FormResponsesListProps {
  isLoading: boolean
  isError: boolean
  submissions?: { submissions: Submission[] }
  onRetry: () => void
  onSubmissionDelete?: (id: string) => void
}

// Add helper function to check if a value is a file URL
const isFileUrl = (value: string | null | undefined): boolean => {
  if (!value) return false;
  return value.startsWith('https://ucarecdn.com/') || value.startsWith('http');
}

// Add helper function to get file name from URL
const getFileNameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    return pathParts[pathParts.length - 1] || 'Download';
  } catch {
    return 'Download';
  }
}

export function FormResponsesList({
  isLoading,
  isError,
  submissions,
  onRetry,
  onSubmissionDelete,
}: FormResponsesListProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [localSubmissions, setLocalSubmissions] = useState<Submission[]>(submissions?.submissions || [])

  useEffect(() => {
    if (submissions?.submissions) {
      setLocalSubmissions(submissions.submissions)
    }
  }, [submissions?.submissions])

  useEffect(() => {
    if (localSubmissions.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = Math.min(startIndex + itemsPerPage, localSubmissions.length)
      const currentPageItems = localSubmissions.slice(startIndex, endIndex)

      if (currentPageItems.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    }
  }, [localSubmissions, currentPage, itemsPerPage])

  // Add helper function for smart pagination
  const getVisiblePages = (currentPage: number, totalPages: number) => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    range.push(1);

    // Calculate start and end of middle range
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Always show last page if there are multiple pages
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Remove duplicates and sort
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    // Add dots where there are gaps
    for (let i = 0; i < uniqueRange.length; i++) {
      const current = uniqueRange[i];
      const next = uniqueRange[i + 1];

      rangeWithDots.push(current);

      if (current !== undefined && next && next - current > 1) {
        rangeWithDots.push('...');
      }
    }

    return rangeWithDots;
  };

  const handleDeleteSubmission = (id: string) => {
    setLocalSubmissions((prev) => prev.filter((sub) => sub.id !== id))
    setSheetOpen(false)
    setSelectedSubmission(null)
    onSubmissionDelete?.(id)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Form Responses</h3>
          <div className="w-24 h-9 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800  shadow-sm">
          <CardContent className="p-0">
            <div className=" p-3 border-b border-zinc-200 dark:border-zinc-800 grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6  rounded animate-pulse"></div>
              ))}
            </div>

            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="p-4 border-b last:border-0 border-zinc-200 dark:border-zinc-800 grid grid-cols-4 gap-4"
              >
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 rounded animate-pulse"></div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardContent className="flex flex-col items-center text-center gap-4 py-16">
          <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-4 mb-2">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">Failed to load responses</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">
              There was an error loading the form responses. Please try again.
            </p>
            <Button variant="default" onClick={onRetry}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!localSubmissions.length) {
    return (
      <Card className="border-zinc-200 bg-background dark:border-zinc-800 shadow-none">
        <CardContent className="flex flex-col items-center text-center gap-4 py-16">
          <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-4 mb-2">
            <FileText className="h-8 w-8 text-zinc-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">No responses yet</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
              This form has not received any submissions yet.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalSubmissions = localSubmissions.length
  const totalPages = Math.ceil(totalSubmissions / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalSubmissions)
  const paginatedSubmissions = localSubmissions.slice(startIndex, endIndex)

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Form Responses</h3>
        <Badge variant="secondary" className="text-xs bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
          {localSubmissions.length} {localSubmissions.length === 1 ? "response" : "responses"}
        </Badge>
      </div>

      <Card className="bg-background border-zinc-200 dark:border-zinc-800">
        <CardContent className="p-0 bg-background">
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Email</div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden sm:block">
              Date
            </div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden sm:block">
              Status
            </div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">
              Actions
            </div>
          </div>

          {paginatedSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="p-4 border-b last:border-0 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                <div className="font-medium text-zinc-900 dark:text-white truncate flex items-center">
                  <Mail className="h-3.5 w-3.5 mr-2 text-zinc-400 sm:hidden" />
                  {submission.data?.email || "—"}
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-zinc-400 sm:hidden" />
                  {submission.createdAt ? format(new Date(submission.createdAt), "MMM d, yyyy h:mm a") : "—"}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  >
                    Complete
                  </Badge>
                  {Object.entries(submission.data).map(([key, value]) => {
                    if (typeof value === 'string' && isFileUrl(value)) {
                      return (
                        <Badge
                          key={key}
                          variant="outline"
                          className="text-[10px] px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1"
                        >
                          <FileIcon className="h-3 w-3" />
                          {key}
                        </Badge>
                      );
                    }
                    return null;
                  })}
                </div>
                <div className="flex justify-end gap-2">
                  {Object.entries(submission.data).map(([key, value]) => {
                    if (typeof value === 'string' && isFileUrl(value)) {
                      return (
                        <Button
                          key={key}
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs cursor-pointer bg-white hover:bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-all duration-200"
                          onClick={() => window.open(value, '_blank')}
                        >
                          <Download className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
                          {getFileNameFromUrl(value)}
                        </Button>
                      );
                    }
                    return null;
                  })}
                  <Sheet
                    open={sheetOpen && selectedSubmission?.id === submission.id}
                    onOpenChange={(open) => {
                      setSheetOpen(open)
                      if (!open) setSelectedSubmission(null)
                    }}
                  >
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs cursor-pointer bg-white hover:bg-zinc-100 text-zinc-600  dark:hover:bg-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-all duration-200"
                        onClick={() => {
                          setSelectedSubmission(submission)
                          setSheetOpen(true)
                        }}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
                        View
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full max-w-md sm:max-w-lg p-0 overflow-y-auto">
                      <div className="h-full flex flex-col">
                        <SheetHeader className="p-6 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-950 z-10">
                          <div className="flex items-center justify-between">
                            <SheetTitle className="text-base font-semibold text-zinc-900 dark:text-white">
                              Submission Details
                            </SheetTitle>
                            <Badge variant="outline" className="bg-transparent text-xs font-normal">
                              ID: {submission.id.slice(0, 8)}...
                            </Badge>
                          </div>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto">
                          {selectedSubmission && (
                            <SubmissionDetails
                              submission={{
                                id: selectedSubmission.id,
                                submittedAt: selectedSubmission.createdAt,
                                data: selectedSubmission.data,
                              }}
                              onBack={() => setSheetOpen(false)}
                              onDelete={handleDeleteSubmission}
                            />
                          )}
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Smart Pagination UI */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent className="flex-wrap gap-1">
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={`${
                    currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                  } text-xs sm:text-sm`}
                />
              </PaginationItem>

              {/* Mobile: Show current page info */}
              <div className="flex items-center px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400 sm:hidden">
                Page {currentPage} of {totalPages}
              </div>

              {/* Desktop: Show page numbers */}
              <div className="hidden sm:flex items-center gap-1">
                {getVisiblePages(currentPage, totalPages).map((page, index) => {
                  if (page === '...') {
                    return (
                      <PaginationItem key={`dots-${index}`}>
                        <span className="px-3 py-2 text-zinc-400">...</span>
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page as number)}
                        isActive={currentPage === page}
                        className="cursor-pointer text-sm"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
              </div>

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={`${
                    currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                  } text-xs sm:text-sm`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Mobile: Quick jump to first/last */}
      {totalPages > 10 && (
        <div className="mt-2 flex justify-center gap-2 sm:hidden">
          {currentPage > 5 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              className="text-xs h-8"
            >
              First
            </Button>
          )}
          {currentPage < totalPages - 4 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              className="text-xs h-8"
            >
              Last
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

