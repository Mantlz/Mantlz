"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { client } from "@/lib/client"
import { useQuery } from "@tanstack/react-query"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Copy, CheckCheck, Mail, ChevronLeft, Calendar, File, Bell, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface Submission {
  id: string
  createdAt: Date
  email: string | null
  data: any
  form: {
    id: string
    name: string
  }
  notificationLogs: {
    type: string
    createdAt: Date
  }[]
}

interface SubmissionResponse {
  submissions: Submission[]
  pagination: {
    total: number
    pages: number
    currentPage: number
  }
}

interface Form {
  id: string
  name: string
  description: string | null
  submissionCount: number
  createdAt: Date
  updatedAt: Date
}

interface FormsResponse {
  forms: Form[]
  nextCursor?: string
}

export function LogsTable() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const page = Number(searchParams.get("page")) || 1
  const formId = searchParams.get("formId")
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const {
    data: formsData,
    isLoading: isLoadingForms,
    error: formsError,
  } = useQuery<FormsResponse>({
    queryKey: ["userForms"],
    queryFn: async () => {
      try {
        const response = await client.forms.getUserForms.$get({
          limit: 50,
        })

        const responseData = await response.json()

        return {
          forms: responseData.forms.map((form) => ({
            id: form.id,
            name: form.name,
            description: form.description,
            submissionCount: form.submissionCount,
            createdAt: new Date(form.createdAt),
            updatedAt: new Date(form.updatedAt),
          })),
          nextCursor: responseData.nextCursor,
        }
      } catch (error) {
        console.error("Error fetching forms:", error)
        throw error
      }
    },
    retry: 3,
    staleTime: 30000,
  })

  const { data: submissionData, isLoading: isLoadingSubmissions } = useQuery<SubmissionResponse>({
    queryKey: ["submissionLogs", page, formId],
    queryFn: async () => {
      if (!formId) return { submissions: [], pagination: { total: 0, pages: 1, currentPage: 1 } }

      try {
        const response = await client.forms.getSubmissionLogs.$get({
          page,
          limit: 10,
          formId,
        })

        const responseData = await response.json()
        return responseData
      } catch (error) {
        console.error("Error fetching submission logs:", error)
        throw error
      }
    },
    enabled: !!formId,
  })

  const handleFormClick = (formId: string) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set("formId", formId)
    newParams.set("page", "1")
    router.push(`?${newParams.toString()}`)
  }

  const copyToClipboard = (key: string, value: any) => {
    navigator.clipboard.writeText(String(value))
    setCopiedField(key)
    setTimeout(() => setCopiedField(null), 2000)
  }

  if (isLoadingForms) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                <CardHeader className="pb-3 pt-4 px-5">
                  <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    )
  }

  if (formsError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-500">
        <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="font-medium mb-2">Error loading forms</p>
        <p className="text-sm">{(formsError as Error).message}</p>
        <Button variant="outline" className="mt-4 cursor-pointer" onClick={() => window.location.reload()} size="sm" >
          Try again
        </Button>
      </div>
    )
  }

  if (!formsData?.forms?.length) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">Your Forms</h2>
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-4 mb-4">
              <File className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No forms found</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-md mb-6">
              Create your first form to start collecting submissions
            </p>
            <Button variant="default" onClick={() => router.push("/dashboard/forms/new")} size="sm" className=" text-xs cursor-pointer">
              Create your first form
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!formId) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Your Forms</h2>
          <Button variant="default" onClick={() => router.push("/dashboard/forms/new")} size="sm" className=" text-xs cursor-pointer">
            Create New Form
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {formsData.forms.map((form) => (
            <Card
              key={form.id}
              className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
              onClick={() => handleFormClick(form.id)}
            >
              <CardHeader className="pb-3 pt-4 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-zinc-900 dark:text-white text-sm group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    {form.name}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    ID: {form.id.slice(0, 8)}...
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
                  {form.description || "No description provided"}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center text-zinc-600 dark:text-zinc-400">
                    <Mail className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
                    {form.submissionCount} {form.submissionCount === 1 ? "submission" : "submissions"}
                  </div>
                  <div className="flex items-center text-zinc-500 dark:text-zinc-400">
                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
                    {formatDistanceToNow(new Date(form.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (isLoadingSubmissions || !submissionData) {
    return (
      <div className="space-y-4">
        <header className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs cursor-pointer"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams)
                newParams.delete("formId")
                router.push(`?${newParams.toString()}`)
              }}
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Back to Forms
            </Button>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              {formsData?.forms?.find((f) => f.id === formId)?.name || "Loading..."}
            </h2>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center min-h-[40vh] w-full mt-8">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading submissions...</p>
        </div>
      </div>
    )
  }

  const { submissions = [], pagination = { total: 0, pages: 1, currentPage: 1 } } = submissionData
  const selectedForm = formsData?.forms?.find((f) => f.id === formId)

  return (
    <div className="space-y-4">
      <header className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs cursor-pointer"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams)
                newParams.delete("formId")
                router.push(`?${newParams.toString()}`)
              }}
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Back to Forms
            </Button>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">{selectedForm?.name}</h2>
            <Badge
              variant="secondary"
              className="text-[10px] bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
            >
              ID: {selectedForm?.id.slice(0, 8)}...
            </Badge>
          </div>
          <Badge variant="outline" className="bg-transparent text-xs font-normal">
            <Mail className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
            {pagination.total} {pagination.total === 1 ? "submission" : "submissions"} total
          </Badge>
        </div>
        {selectedForm?.description && (
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">{selectedForm.description}</p>
        )}
      </header>

      {submissions.length === 0 ? (
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-4 mb-4">
              <Mail className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-md">
              Submissions will appear here once your form receives responses
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-zinc-200 p-2  dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-zinc-200 dark:border-zinc-800">
                      <TableHead className="text-xs font-medium text-zinc-500 dark:text-zinc-400 py-4">
                        Submission ID
                      </TableHead>
                      <TableHead className="text-xs font-medium text-zinc-500 dark:text-zinc-400 py-4">Email</TableHead>
                      <TableHead className="text-xs font-medium text-zinc-500 dark:text-zinc-400 py-4">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-medium text-zinc-500 dark:text-zinc-400 py-4">
                        Submitted
                      </TableHead>
                      <TableHead className="text-xs font-medium text-zinc-500 dark:text-zinc-400 py-4 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow
                        key={submission.id}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0"
                      >
                        <TableCell className="font-mono text-xs text-zinc-900 dark:text-white py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                            {submission.id.slice(0, 8)}...
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-zinc-900 dark:text-white py-4">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-zinc-400" />
                            <span className="max-w-[150px] truncate">{submission.email || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded-md",
                              submission.notificationLogs.length > 0
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                            )}
                          >
                            {submission.notificationLogs.length > 0 ? "Email Sent" : "No Email Sent"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-zinc-600 dark:text-zinc-400 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                            <span className="hidden sm:inline">
                              {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                            </span>
                            <span className="sm:hidden">
                              {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })
                                .replace(" ago", "")
                                .replace("about ", "")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs bg-zinc-200 cursor-pointer dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                onClick={() => setSelectedSubmission(submission)}
                              >
                                View Details
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="w-full max-w-md sm:max-w-lg p-0 overflow-y-auto">
                              <div className="h-full flex flex-col">
                                {/* Header with sticky position */}
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

                                {/* Content section with padding and scrollable area */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                  {/* Header section with gradient background */}
                                  <div className="bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                      <div className="space-y-2">
                                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex flex-wrap items-center gap-2">
                                          <span>Submission #{submission.id.slice(0, 8)}</span>
                                          <Badge
                                            variant="secondary"
                                            className={cn(
                                              "text-[10px] ",
                                              submission.notificationLogs.length > 0
                                                ? "bg-green-100 text-green-800  dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                                            )}
                                          >
                                            {submission.notificationLogs.length > 0 ? "Email Sent" : "No Email Sent"}
                                          </Badge>
                                        </h2>
                                        <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
                                          <span>
                                            Received{" "}
                                            {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                                          </span>
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
                                          <span className="text-xs">
                                            {copiedField === "id" ? "Copied!" : "Copy ID"}
                                          </span>
                                        </Button>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-6">
                                    <div>
                                      <div className="flex items-center mb-3">
                                        <File className="h-3.5 w-3.5 mr-2 text-zinc-500" />
                                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                          Form Data
                                        </p>
                                      </div>
                                      <div className="space-y-3">
                                        {Object.entries(submission.data).map(([key, value]) => (
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
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-zinc-500 cursor-pointer dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                                                onClick={() => copyToClipboard(key, value)}
                                              >
                                                {copiedField === key ? (
                                                  <CheckCheck className="h-3.5 w-3.5 mr-1 text-green-500" />
                                                ) : (
                                                  <Copy className="h-3.5 w-3.5 mr-1" />
                                                )}
                                                <span className="text-xs font-medium">
                                                  {copiedField === key ? "Copied!" : "Copy"}
                                                </span>
                                              </Button>
                                            </div>
                                            <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800 mb-3"></div>
                                            <p className="text-zinc-900 dark:text-zinc-100 text-sm break-words">
                                              {String(value)}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Notification History Section */}
                                    {submission.notificationLogs.length > 0 && (
                                      <div>
                                        <div className="flex items-center mb-3">
                                          <Bell className="h-3.5 w-3.5 mr-2 text-zinc-500" />
                                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                            Notification History
                                          </p>
                                        </div>
                                        <div className="space-y-2">
                                          {submission.notificationLogs.map((log, index) => (
                                            <div
                                              key={index}
                                              className="flex items-center gap-2 text-sm p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900"
                                            >
                                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                              <span className="text-zinc-900 dark:text-zinc-100">{log.type}</span>
                                              <span className="text-zinc-500 dark:text-zinc-400 ml-auto">
                                                {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </SheetContent>
                          </Sheet>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
              disabled={page <= 1}
              onClick={() => {
                const newParams = new URLSearchParams(searchParams)
                newParams.set("page", String(page - 1))
                router.push(`?${newParams.toString()}`)
              }}
            >
              Previous
            </Button>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Page {page} of {pagination.pages} {pagination.total > 0 && `(${pagination.total} total)`}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
              disabled={page >= pagination.pages}
              onClick={() => {
                const newParams = new URLSearchParams(searchParams)
                newParams.set("page", String(page + 1))
                router.push(`?${newParams.toString()}`)
              }}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

