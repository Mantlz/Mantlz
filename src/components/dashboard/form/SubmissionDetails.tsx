"use client"

import { Copy, CheckCheck, Calendar, File, Trash2, MapPin, Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"

export interface FormSubmission {
  id: string
  submittedAt: Date
  data: Record<string, any>
  location?: {
    lat: number
    lng: number
    country?: string
    city?: string
  }
}

interface SubmissionDetailsProps {
  submission?: FormSubmission
  isLoading?: boolean
  onBack?: () => void
  onDelete?: (id: string) => void
}

export function SubmissionDetails({ submission, isLoading, onBack, onDelete }: SubmissionDetailsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const copyToClipboard = (key: string, value: any) => {
    navigator.clipboard.writeText(String(value))
    setCopiedField(key)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!submission) return

    setIsDeleting(true)

    try {
      // Instead of calling API directly, use the callback
      // which will trigger the mutation in the parent component
      onDelete?.(submission.id)

      // Show success toast will be handled in the parent
    } catch (error) {
      // Error handling will be done by the parent
      console.error("Error triggering delete:", error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-16" />
                </div>
                <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800 mb-3"></div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!submission) {
    return (
      <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-4 mb-4">
            <File className="h-8 w-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Submission Selected</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-md mb-6">
            Please select a submission from the list to view details
          </p>
          <Button variant="default" onClick={onBack}>
            Back to List
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      
        <div className="bg-gradient-to-r  from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 p-4 sm:p-6  ">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2 p-2">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex flex-wrap items-center gap-2">
                <span>Submission Details</span>
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  ID: {submission.id.slice(0, 8)}...
                </Badge>
              </h2>
              <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                <Calendar className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
                <span>Received {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto mt-2 sm:mt-0">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs bg-white hover:bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-all duration-200"
                onClick={() => copyToClipboard("id", submission.id)}
              >
                {copiedField === "id" ? (
                  <CheckCheck className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                )}
                <span className="text-xs">{copiedField === "id" ? "Copied!" : "Copy ID"}</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 text-xs cursor-pointer bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 border border-red-600 dark:border-red-700 rounded-lg transition-all duration-200"
                onClick={handleDeleteClick}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                )}
                <span className="text-xs">{isDeleting ? "Deleting..." : "Delete"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Location information if available */}
        {submission.location && (
          <div className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <MapPin className="h-4 w-4 text-zinc-500" />
              <span>
                {submission.location.city && submission.location.country
                  ? `${submission.location.city}, ${submission.location.country}`
                  : submission.location.country || "Location recorded"}
              </span>
              <Badge variant="outline" className="ml-auto text-[10px] bg-red-500">
                Lat: {submission.location.lat.toFixed(4)}, Lng: {submission.location.lng.toFixed(4)}
              </Badge>
              
            </div>
          </div>
        )}

        {/* Content section */}
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="flex items-center mb-2">
            <File className="h-3.5 w-3.5 mr-2 text-zinc-500" />
            <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Form Data</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(submission.data)
            .filter(([key]) => key !== '_meta')
            .map(([key, value], index) => (
              <div
                key={key}
                className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-zinc-300 dark:bg-zinc-600 rounded-full mr-2"></div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      {key}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                      onClick={() => copyToClipboard(key, value)}
                    >
                      {copiedField === key ? (
                        <CheckCheck className="h-3.5 w-3.5 mr-1 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 mr-1" />
                      )}
                      <span className="text-xs font-medium">{copiedField === key ? "Copied!" : "Copy"}</span>
                    </Button>
                    <Badge
                      variant="secondary"
                      className="text-[10px] bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                    >
                      {typeof value === "string" ? `${value.length} chars` : typeof value}
                    </Badge>
                  </div>
                </div>
                <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800 mb-3"></div>
                <div className="overflow-x-auto">
                  <p className="text-zinc-900 dark:text-zinc-100 text-sm break-words">{String(value)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      {/* </Card> */}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => !isDeleting && setDeleteDialogOpen(open)}>
        <AlertDialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-900 dark:text-zinc-100">Delete Submission</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-600 dark:text-zinc-400">
              Are you sure you want to delete this submission? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

