"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Users, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { SubmissionSearch } from "../SubmissionSearch"
import { LogsTableHeaderProps } from "./types"

export function TableHeader({ formId, formsData, searchParams, router }: LogsTableHeaderProps) {
  const selectedForm = formsData?.forms?.find((f) => f.id === formId)

  return (
    <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full px-3"
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams)
                    newParams.delete("formId")
                    router.push(`?${newParams.toString()}`)
                  }}
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden xs:inline">Back to Forms</span>
                </Button>
                <Badge variant="secondary" className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
                  Form ID: {selectedForm?.id.slice(0, 8)}...
                </Badge>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                {selectedForm?.name}
              </h1>
            </div>
            <SubmissionSearch />
          </div>

          {/* Description */}
          {selectedForm?.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
              {selectedForm.description}
            </p>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-gray-100 dark:border-zinc-700/50 hover:border-gray-200 dark:hover:border-zinc-600/50 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedForm?.submissionCount || 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Submissions</p>
                </div>
              </div>
              <div className="mt-2 h-1 w-full bg-gray-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((selectedForm?.submissionCount || 0) / 100) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-gray-100 dark:border-zinc-700/50 hover:border-gray-200 dark:hover:border-zinc-600/50 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedForm?.createdAt ? formatDistanceToNow(new Date(selectedForm.createdAt), { addSuffix: true }) : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 