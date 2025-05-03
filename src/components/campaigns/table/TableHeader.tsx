"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Send, Clock, File} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ReadonlyURLSearchParams } from "next/navigation"

interface TableHeaderProps {
  formId: string
  formData?: {
    name: string
    submissionCount: number
  }
  campaignsData: any[]
  searchParams: ReadonlyURLSearchParams
  router: any
}

export function TableHeader({ 
  formId, 
  formData,
  campaignsData, 
  searchParams, 
  router 
}: TableHeaderProps) {

  // Find last created campaign
  const lastCampaign = campaignsData.length > 0 ? 
    campaignsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] : 
    null;

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg px-3"
                  onClick={() => {
                    router.push(`/dashboard/campaigns`)
                  }}
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden xs:inline">Back to Forms</span>
                </Button>
                <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  Form ID: {formId.slice(0, 8)}...
                </Badge>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                {formData?.name || 'Campaigns'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formData?.submissionCount || 0} submissions
              </p>
            </div>
            <Button
              onClick={() => router.push(`/dashboard/campaigns?formId=${formId}&action=create`)}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-all duration-200 rounded-lg shadow-sm"
            >
              <Send className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <Send className="h-5 w-5 text-gray-900 dark:text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{campaignsData.length || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Campaigns</p>
            </div>
          </div>
          <div className="mt-2 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
            <div 
              className="h-full bg-black dark:bg-white rounded-lg transition-all duration-500"
              style={{ width: `${Math.min(((campaignsData.length || 0) / 10) * 100, 100)}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <Clock className="h-5 w-5 text-gray-900 dark:text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {campaignsData.filter(c => c.status === 'SENT').length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sent Campaigns</p>
            </div>
          </div>
        </div>

        {/* Last Campaign Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <File className="h-5 w-5 text-gray-900 dark:text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {lastCampaign ? formatDistanceToNow(new Date(lastCampaign.createdAt), { addSuffix: true }) : 'No campaigns yet'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Last Campaign</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 