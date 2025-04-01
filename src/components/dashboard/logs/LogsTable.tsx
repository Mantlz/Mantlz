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
import { Copy, CheckCheck, Mail, ChevronLeft, Calendar, File, Bell, Loader2, Globe, MapPin, BarChart, Monitor, Link, Clock, Maximize2, FileSpreadsheet, Users, ChevronRight, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { LogsTableContent } from "./LogsTableContent"
import { LogsTableHeader } from "./LogsTableHeader"
import { useSubscription } from "@/hooks/useSubscription"
import { useUser } from "@clerk/nextjs"

interface NotificationLog {
  id: string
  type: 'SUBMISSION_CONFIRMATION' | 'DEVELOPER_NOTIFICATION' | 'DIGEST'
  status: 'SENT' | 'FAILED' | 'SKIPPED'
  error: string | null
  createdAt: string
}

interface Analytics {
  browser: string
  location: string
  _meta?: {
    browser: string
    country: string
  }
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
  const { user } = useUser()
  const page = Number(searchParams.get("page")) || 1
  const formId = searchParams.get("formId")
  const status = searchParams.get("status")
  const type = searchParams.get("type")
  const search = searchParams.get("search")
  const { isPremium } = useSubscription()
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

  const { data, isLoading, error } = useQuery<SubmissionResponse>({
    queryKey: ["submissionLogs", formId, page, status, type, search],
    queryFn: async () => {
      if (!formId) {
        return {
          submissions: [],
          pagination: {
            total: 0,
            pages: 1,
            currentPage: 1
          }
        };
      }

      const response = await client.forms.getSubmissionLogs.$get({
        formId,
        page,
        limit: isPremium ? 50 : 10,
        ...(status ? { status } : {}),
        ...(type ? { type } : {}),
        ...(search ? { search } : {})
      });

      const responseData = await response.json();
      return responseData as unknown as SubmissionResponse;
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
      <div className="space-y-6 sm:space-y-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800/50">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative p-6 sm:p-8 lg:p-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black dark:bg-white flex items-center justify-center">
                    <span className="text-lg sm:text-xl font-medium text-white dark:text-black">
                      {user?.firstName?.[0] || '👋'}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-white tracking-tight">
                      Loading...
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Please wait while we fetch your data
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (formsError) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center bg-white dark:bg-zinc-900 rounded-lg border border-red-100 dark:border-red-900/50 shadow-sm p-6">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Error Loading Forms</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">{(formsError as Error)?.message || "An unknown error occurred"}</p>
        </div>
      </div>
    )
  }

  if (!formsData?.forms?.length) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800/50">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative p-6 sm:p-8 lg:p-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black dark:bg-white flex items-center justify-center">
                    <span className="text-lg sm:text-xl font-medium text-white dark:text-black">
                      {user?.firstName?.[0] || '👋'}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-white tracking-tight">
                      Welcome back, {user?.firstName || 'there'}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Let's create your first form
                    </p>
                  </div>
                </div>
              </div>
              <Button
                className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 transition-all duration-200 rounded-full px-6 shadow-sm hover:shadow-md"
                onClick={() => router.push("/dashboard/forms/new")}
              >
                Create Your First Form
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center py-12 sm:py-16 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
            <FileSpreadsheet className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">Ready to create your first form?</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-sm mx-auto px-4">
            Start collecting responses in minutes with our easy-to-use form builder
          </p>
          <Button
            className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 transition-all duration-200 rounded-full px-6 shadow-sm hover:shadow-md"
            onClick={() => router.push("/dashboard/forms/new")}
          >
            Create Your First Form
          </Button>
        </div>
      </div>
    )
  }

  if (!formId) {
    const totalSubmissions = formsData.forms.reduce((acc, form) => acc + form.submissionCount, 0)
    const mostRecentForm = formsData.forms.reduce((latest, current) => 
      new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
    )

    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Stats Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800/50">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative p-6 sm:p-8 lg:p-12">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800/50 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <FileSpreadsheet className="h-5 w-5 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formsData.forms.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Forms</p>
                  </div>
                </div>
                <div className="mt-2 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((formsData.forms.length / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800/50 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{totalSubmissions}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Submissions</p>
                  </div>
                </div>
                <div className="mt-2 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((totalSubmissions / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {formsData.forms.map((form) => (
            <Card 
              key={form.id}
              className="group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800/50 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 cursor-pointer hover:shadow-md"
              onClick={() => handleFormClick(form.id)}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">
                    {form.name}
                  </h3>
                  <span className="text-xs sm:text-sm bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white px-2 sm:px-3 py-1 rounded-full">
                    {form.submissionCount} responses
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    <span>{formatDistanceToNow(new Date(form.createdAt), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    <span>View</span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <LogsTableHeader 
        formId={formId}
        formsData={formsData}
        searchParams={searchParams}
        router={router}
      />
      <LogsTableContent 
        data={data}
        isLoading={isLoading}
        page={page}
        pagination={data?.pagination}
        searchParams={searchParams}
        router={router}
        isPremium={isPremium}
      />
    </div>
  )
}

