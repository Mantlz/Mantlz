import { useState } from "react"
import { useRouter, ReadonlyURLSearchParams } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Copy, CheckCheck, Mail, Calendar, File, Bell, Loader2, Globe, MapPin, BarChart, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { UpgradeModal } from "@/components/modals/UpgradeModal"

interface NotificationLog {
  id: string
  type: 'SUBMISSION_CONFIRMATION' | 'DEVELOPER_NOTIFICATION' | 'DIGEST'
  status: 'SENT' | 'FAILED' | 'SKIPPED'
  error: string | null
  createdAt: string
}

interface Submission {
  id: string
  createdAt: Date
  email: string | null
  data: any
  formId: string
  form: {
    id: string
    name: string
  }
  notificationLogs: NotificationLog[]
  analytics: {
    browser: string
    location: string
  }
}

interface SubmissionResponse {
  submissions: Submission[]
  pagination: {
    total: number
    pages: number
    currentPage: number
  }
}

interface LogsTableContentProps {
  data: SubmissionResponse | undefined
  isLoading: boolean
  page: number
  pagination: {
    total: number
    pages: number
    currentPage: number
  } | undefined
  searchParams: ReadonlyURLSearchParams
  router: any
  isPremium: boolean
}

export function LogsTableContent({ data, isLoading, page, pagination, searchParams, router, isPremium }: LogsTableContentProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full mt-8">
        <div className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white rounded-full mb-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading submissions...</p>
      </div>
    )
  }

  const { submissions = [] } = data

  // Enhance submissions with analytics data
  const enhancedSubmissions = submissions.map(submission => {
    const data = submission.data as any;
    const meta = data?._meta || {};
    return {
      ...submission,
      analytics: {
        browser: meta.browser || 'Unknown',
        location: meta.country || 'Unknown',
      }
    };
  });

  const copyToClipboard = (key: string, value: any) => {
    navigator.clipboard.writeText(String(value))
    setCopiedField(key)
    setTimeout(() => setCopiedField(null), 2000)
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
          <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">No submissions yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-sm mx-auto px-4">
          Submissions will appear here once your form receives responses
        </p>
      </div>
    )
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
              {enhancedSubmissions.map((submission: Submission) => (
                <TableRow
                  key={submission.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800/50 last:border-0"
                >
                  <TableCell className="font-mono text-xs text-gray-900 dark:text-white py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <span className="hidden sm:inline">{submission.id.slice(0, 8)}...</span>
                      <span className="sm:hidden">{submission.id.slice(0, 4)}...</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-gray-900 dark:text-white py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      <span className="max-w-[100px] sm:max-w-[150px] truncate">{submission.email || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4">
                    <div className="flex flex-col gap-1">
                      {/* User Email Status */}
                      {submission.email && (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-md",
                            submission.notificationLogs?.some(log => 
                              log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'SENT'
                            )
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : submission.notificationLogs?.some(log => 
                                  log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'FAILED'
                                )
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : submission.notificationLogs?.some(log => 
                                  log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'SKIPPED'
                                )
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          )}
                        >
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="hidden sm:inline">User Email: </span>
                            <span>{submission.notificationLogs?.find(log => log.type === 'SUBMISSION_CONFIRMATION')?.status || 'Pending'}</span>
                          </div>
                        </Badge>
                      )}
                      {/* Developer Email Status - Premium Only */}
                      {isPremium && (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-md",
                            submission.notificationLogs?.some(log => 
                              log.type === 'DEVELOPER_NOTIFICATION' && log.status === 'SENT'
                            )
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : submission.notificationLogs?.some(log => 
                                  log.type === 'DEVELOPER_NOTIFICATION' && log.status === 'FAILED'
                                )
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          )}
                        >
                          <div className="flex items-center gap-1">
                            <Bell className="h-3 w-3" />
                            <span className="hidden sm:inline">Dev Email: </span>
                            <span>{submission.notificationLogs?.find(log => log.type === 'DEVELOPER_NOTIFICATION')?.status || 'Pending'}</span>
                          </div>
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  {isPremium && (
                    <TableCell className="py-3 sm:py-4 hidden md:table-cell">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <Globe className="h-3.5 w-3.5" />
                          <span>{submission.analytics.browser}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{submission.analytics.location}</span>
                        </div>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="text-xs text-gray-600 dark:text-gray-400 py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
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
                  <TableCell className="py-3 sm:py-4 text-right">
                    {isPremium ? (
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <span className="hidden sm:inline">View Details</span>
                            <span className="sm:hidden">View</span>
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full max-w-md sm:max-w-lg p-0 overflow-y-auto">
                          <div className="h-full flex flex-col">
                            <SheetHeader className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800/50 sticky top-0 bg-white dark:bg-zinc-950 z-10">
                              <div className="flex items-center justify-between">
                                <SheetTitle className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                                  Submission Details
                                </SheetTitle>
                                <Badge variant="outline" className="bg-transparent text-xs font-normal">
                                  ID: {submission.id.slice(0, 8)}...
                                </Badge>
                              </div>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                              {/* Header section with gradient background */}
                              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800 p-3 sm:p-6 border border-gray-100 dark:border-gray-800/50 rounded-xl">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div className="space-y-2">
                                    <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight flex flex-wrap items-center gap-2">
                                      <span>Submission #{submission.id.slice(0, 8)}</span>
                                      <Badge
                                        variant="secondary"
                                        className={cn(
                                          "text-[10px] ",
                                          submission.notificationLogs?.some(log => 
                                            log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'SENT'
                                          )
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                            : submission.notificationLogs?.some(log => 
                                                log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'FAILED'
                                              )
                                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                        )}
                                      >
                                        {submission.notificationLogs?.some(log => 
                                          log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'SENT'
                                        ) ? "Email Sent" : "No Email Sent"}
                                      </Badge>
                                    </h2>
                                    <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
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
                                      className="h-8 text-xs bg-white hover:bg-gray-100 text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-full transition-all duration-200"
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

                              <div className="space-y-4 sm:space-y-6">
                                <div>
                                  <div className="flex items-center mb-3">
                                    <File className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Form Data
                                    </p>
                                  </div>
                                  <div className="space-y-3">
                                    {Object.entries(submission.data)
                                      .filter(([key]) => key !== '_meta')
                                      .map(([key, value]) => (
                                      <div
                                        key={key}
                                        className="p-3 sm:p-4 border border-gray-100 dark:border-gray-800/50 rounded-xl bg-white dark:bg-zinc-900"
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center">
                                            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></div>
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                              {key}
                                            </p>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2 text-gray-500 cursor-pointer dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
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
                                        <div className="h-px w-full bg-gray-100 dark:bg-gray-800 mb-3"></div>
                                        <p className="text-xs sm:text-sm text-gray-900 dark:text-white break-words">
                                          {String(value)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Email Status Section in Details */}
                                <div>
                                  <div className="flex items-center mb-3">
                                    <Mail className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Email Status
                                    </p>
                                  </div>
                                  <div className="space-y-3">
                                    {/* User Email Status */}
                                    {submission.email && (
                                      <div className="p-3 sm:p-4 border border-gray-100 dark:border-gray-800/50 rounded-xl bg-white dark:bg-zinc-900">
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center gap-2">
                                            <Mail className="h-3.5 w-3.5 text-gray-500" />
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">User Email</p>
                                          </div>
                                          <Badge
                                            variant="secondary"
                                            className={cn(
                                              "text-[10px] px-2 py-0.5 rounded-md",
                                              submission.notificationLogs?.some(log => 
                                                log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'SENT'
                                              )
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : submission.notificationLogs?.some(log => 
                                                    log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'FAILED'
                                                  )
                                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                : submission.notificationLogs?.some(log => 
                                                    log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'SKIPPED'
                                                  )
                                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                            )}
                                          >
                                            {submission.notificationLogs?.find(log => log.type === 'SUBMISSION_CONFIRMATION')?.status || 'Pending'}
                                          </Badge>
                                        </div>
                                        <div className="space-y-2">
                                          <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                                            {submission.email}
                                          </p>
                                          {submission.notificationLogs?.find(log => 
                                            log.type === 'SUBMISSION_CONFIRMATION' && log.error
                                          )?.error && (
                                            <div className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                                              Error: {submission.notificationLogs?.find(log => 
                                                log.type === 'SUBMISSION_CONFIRMATION' && log.error
                                              )?.error}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    {/* Developer Email Status */}
                                    <div className="p-3 sm:p-4 border border-gray-100 dark:border-gray-800/50 rounded-xl bg-white dark:bg-zinc-900">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                          <Bell className="h-3.5 w-3.5 text-gray-500" />
                                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Developer Email</p>
                                        </div>
                                        <Badge
                                          variant="secondary"
                                          className={cn(
                                            "text-[10px] px-2 py-0.5 rounded-md",
                                            submission.notificationLogs?.some(log => 
                                              log.type === 'DEVELOPER_NOTIFICATION' && log.status === 'SENT'
                                            )
                                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                              : submission.notificationLogs?.some(log => 
                                                  log.type === 'DEVELOPER_NOTIFICATION' && log.status === 'FAILED'
                                                )
                                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                          )}
                                        >
                                          {submission.notificationLogs?.find(log => log.type === 'DEVELOPER_NOTIFICATION')?.status || 'Pending'}
                                        </Badge>
                                      </div>
                                      <div className="space-y-2">
                                        <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                                          Developer notifications are {submission.notificationLogs?.some(log => 
                                            log.type === 'DEVELOPER_NOTIFICATION' && log.status === 'SENT'
                                          ) ? 'enabled' : 'disabled'}
                                        </p>
                                        {submission.notificationLogs?.find(log => 
                                          log.type === 'DEVELOPER_NOTIFICATION' && log.error
                                        )?.error && (
                                          <div className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                                            Error: {submission.notificationLogs?.find(log => 
                                              log.type === 'DEVELOPER_NOTIFICATION' && log.error
                                            )?.error}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Analytics Section */}
                                <div>
                                  <div className="flex items-center mb-3">
                                    <BarChart className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Analytics
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="p-3 sm:p-4 border border-gray-100 dark:border-gray-800/50 rounded-xl bg-white dark:bg-zinc-900">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Globe className="h-3.5 w-3.5 text-gray-500" />
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Browser</p>
                                      </div>
                                      <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                                        {submission.data?._meta?.browser || 'Unknown'}
                                      </p>
                                    </div>
                                    <div className="p-3 sm:p-4 border border-gray-100 dark:border-gray-800/50 rounded-xl bg-white dark:bg-zinc-900">
                                      <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="h-3.5 w-3.5 text-gray-500" />
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Location</p>
                                      </div>
                                      <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                                        {submission.data?._meta?.country || 'Unknown'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                        onClick={() => setShowUpgradeModal(true)}
                      >
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 px-2 sm:px-0">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          disabled={page <= 1}
          onClick={() => {
            const newParams = new URLSearchParams(searchParams)
            newParams.set("page", String(page - 1))
            router.push(`?${newParams.toString()}`)
          }}
        >
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </Button>
        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Page {page} of {pagination?.pages} {pagination?.total && pagination.total > 0 && `(${pagination.total} total)`}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          disabled={page >= (pagination?.pages || 1)}
          onClick={() => {
            const newParams = new URLSearchParams(searchParams)
            newParams.set("page", String(page + 1))
            router.push(`?${newParams.toString()}`)
          }}
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">Next</span>
        </Button>
      </div>

      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Detailed Submission View"
        featureIcon={<Maximize2 className="h-5 w-5 m-2 text-gray-700 dark:text-gray-300" />}
        description="Access comprehensive submission logs, including form data Track submission status, view user responses, and analyze form performance with our advanced logging system."
      />
    </>
  )
} 