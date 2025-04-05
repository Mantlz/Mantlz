"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useSubscription } from "@/hooks/useSubscription"
import { StatsGridSkeleton } from "@/components/skeletons"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, Users } from "lucide-react"
import { FormsResponse, SubmissionResponse } from "./types"
import { fetchUserForms, fetchSubmissions } from "./tableUtils"
import { TableHeader } from "./TableHeader"
import { TableContent } from "./TableContent"
import { LogsTableHeaderSkeleton } from "@/components/skeletons"
import { SubmissionSearch } from "../../logs/SubmissionSearch"
import { SubmissionTableSkeleton } from "./SubmissionTableSkeleton"

export function LogsTable() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useUser()
  const page = Number(searchParams.get("page")) || 1
  const formId = searchParams.get("formId")
  const { isPremium, subscription } = useSubscription()

  // Get the plan from the subscription or default to FREE
  const userPlan = subscription?.plan || 'FREE'

  // Fetch forms data
  const {
    data: formsData,
    isLoading: isLoadingForms,
    error: formsError,
  } = useQuery<FormsResponse>({
    queryKey: ["userForms"],
    queryFn: fetchUserForms,
    retry: 3,
    staleTime: 30000,
  })

  // Fetch submissions for selected form
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');

  const { 
    data, 
    isLoading, 
    error: submissionsError,
    refetch 
  } = useQuery<SubmissionResponse>({
    queryKey: ["submissionLogs", formId, page, startDateParam, endDateParam],
    queryFn: () => fetchSubmissions(formId, page, startDateParam || undefined, endDateParam || undefined),
    enabled: !!formId,
  })

  // Handle form selection
  function handleFormClick(formId: string) {
    const newParams = new URLSearchParams(searchParams)
    newParams.set("formId", formId)
    newParams.set("page", "1")
    router.push(`?${newParams.toString()}`)
  }

  // Loading state
  if (isLoadingForms) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <StatsGridSkeleton />
      </div>
    )
  }

  // Error state
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

  // No forms state
  if (!formsData?.forms?.length) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800/50">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative p-6 sm:p-8 lg:p-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <div>
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

  // Form is selected
  return (
    <div className="space-y-6 sm:space-y-8">
      {formId ? (
        // If we have a form ID, check if submissions data is loading
        isLoading || !data ? (
          <>
            <LogsTableHeaderSkeleton />
            <SubmissionTableSkeleton isPremium={isPremium} />
          </>
        ) : (
          <>
            <TableHeader 
              formId={formId}
              formsData={formsData}
              searchParams={searchParams}
              router={router}
              submissionsData={data}
            />
            <TableContent 
              data={data}
              isLoading={false}
              page={page}
              pagination={data.pagination}
              searchParams={searchParams}
              router={router}
              isPremium={isPremium}
              userPlan={userPlan}
              refetch={refetch}
            />
          </>
        )
      ) : (
        // Show forms grid
        <>
          <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm mb-6">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
            <div className="relative p-6 lg:p-8">
              <div className="flex flex-col gap-6">
                {/* Header Section */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                      Your Forms
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {formsData.forms.length} form{formsData.forms.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                  <SubmissionSearch />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-gray-100 dark:border-zinc-700/50 hover:border-gray-200 dark:hover:border-zinc-600/50 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <FileSpreadsheet className="h-5 w-5 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{formsData.forms.length}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Forms</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-gray-100 dark:border-zinc-700/50 hover:border-gray-200 dark:hover:border-zinc-600/50 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formsData.forms.reduce((total, form) => total + (form.submissionCount || 0), 0)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Submissions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {formsData.forms.map((form) => (
              <div
                key={form.id}
                className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
                onClick={() => handleFormClick(form.id)}
              >
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">{form.name}</h3>
                  {form.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{form.description}</p>
                  )}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-1">
                      <FileSpreadsheet className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{form.submissionCount} submission{form.submissionCount !== 1 ? 's' : ''}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full"
                    >
                      View Logs
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
} 