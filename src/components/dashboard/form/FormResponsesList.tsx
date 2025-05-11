"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Eye, FileText, AlertCircle, Mail, Calendar } from "lucide-react"
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

        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <CardContent className="p-0">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 border-b border-zinc-200 dark:border-zinc-800 grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
              ))}
            </div>

            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="p-4 border-b last:border-0 border-zinc-200 dark:border-zinc-800 grid grid-cols-4 gap-4"
              >
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"></div>
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
      <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
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
      <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
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

      <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <CardContent className="p-0">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 border-b border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                <div className="flex items-center">
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  >
                    Complete
                  </Badge>
                </div>
                <div className="flex justify-end">
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
                        className="h-8 text-xs cursor-pointer bg-white hover:bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-all duration-200"
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

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

