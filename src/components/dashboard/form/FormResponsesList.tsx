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
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-12 border border-gray-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900">
        <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2 font-mono text-gray-800 dark:text-gray-200">Failed to load responses</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          There was an error fetching the form responses.
        </p>
        <Button 
          onClick={onRetry} 
          className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-mono"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (!submissions?.submissions?.length) {
    return (
      <div className="text-center py-12 border border-gray-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900">
        <Inbox className="h-10 w-10 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2 font-mono text-gray-800 dark:text-gray-200">No responses yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Your form is waiting for its first submission. Responses will appear here when they arrive.
        </p>
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
    <div>
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-gray-100 dark:bg-zinc-800 grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-zinc-800 font-mono font-medium text-sm">
          <div className="col-span-3">ID</div>
          <div className="col-span-4">Date Submitted</div>
          <div className="col-span-3">Data Preview</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        
        {paginatedSubmissions.map((submission) => (
          <div key={submission.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
            <div className="col-span-3 font-mono text-sm truncate bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded">{submission.id.substring(0, 8)}</div>
            <div className="col-span-4 text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              {format(new Date(submission.createdAt), "MMM d, yyyy 'at' h:mm a")}
            </div>
            <div className="col-span-3">
              {submission.data && typeof submission.data === 'object' && 
                Object.keys(submission.data as Record<string, any>).length > 0 ? (
                  <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {Object.keys(submission.data as Record<string, any>).length} fields
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-500">No data</div>
                )
              }
            </div>
            <div className="col-span-2 text-right">
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