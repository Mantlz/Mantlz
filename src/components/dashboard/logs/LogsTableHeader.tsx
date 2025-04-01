import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Mail, FileSpreadsheet, Users, Clock } from "lucide-react"
import { ReadonlyURLSearchParams } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

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

interface LogsTableHeaderProps {
  formId: string | null
  formsData: FormsResponse | undefined
  searchParams: ReadonlyURLSearchParams
  router: any
}

export function LogsTableHeader({ formId, formsData, searchParams, router }: LogsTableHeaderProps) {
  const selectedForm = formsData?.forms?.find((f) => f.id === formId)

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800/50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative p-6 sm:p-8 lg:p-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams)
                  newParams.delete("formId")
                  router.push(`?${newParams.toString()}`)
                }}
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                <span className="hidden xs:inline">Back to Forms</span>
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-white tracking-tight">
                  {selectedForm?.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Form ID: {selectedForm?.id.slice(0, 8)}...
                </p>
              </div>
            </div>

            {selectedForm?.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {selectedForm.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full sm:w-auto">
              <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800/50 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedForm?.submissionCount || 0}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Submissions</p>
                  </div>
                </div>
                <div className="mt-2 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(((selectedForm?.submissionCount || 0) / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800/50 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200">
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
    </div>
  )
} 