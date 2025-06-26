"use client"

import { useRouter, ReadonlyURLSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Mail, Clock, Send, Users } from "lucide-react"
import { useSubscription } from "@/hooks/useSubscription"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { UpgradeModal } from "@/components/modals/UpgradeModal"
import { CreateCampaignDialog } from "../dialogs/CreateCampaignDialog"
import { useState } from "react"
import { FormsResponse, CampaignResponse, Form } from "./types"

interface TableHeaderProps {
  formId: string | null
  formsData?: FormsResponse
  searchParams: ReadonlyURLSearchParams
  router: ReturnType<typeof useRouter>
  campaignsData?: CampaignResponse
}

export function TableHeader({
  formId,
  formsData,
  router,
  campaignsData,
}: TableHeaderProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const { isPremium } = useSubscription()
  const selectedForm = formsData?.forms?.find((f) => f.id === formId) as Form | undefined
  const campaignCount = campaignsData?.campaigns?.length || 0

  const handleBackClick = () => {
    router.push("/dashboard/campaigns")
  }

  return (
    <div className="relative overflow-hidden bg-white dark:bg-background rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
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
                  className="h-8 text-xs cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg px-3"
                  onClick={handleBackClick}
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden xs:inline">Back to Forms</span>
                </Button>
                {selectedForm && (
                  <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    Form ID: {selectedForm?.id.slice(0, 8)}...
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                {selectedForm?.name || "Select a Form"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <CreateCampaignDialog
                formId={formId}
                isPremium={isPremium}
                onUpgradeClick={() => setShowUpgradeModal(true)}
              />
            </div>
          </div>

          {/* Description */}
          {selectedForm?.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
              {selectedForm.description}
            </p>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{campaignCount}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Campaigns</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-background rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedForm?.createdAt ? formatDistanceToNow(new Date(selectedForm.createdAt), { addSuffix: true }) : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Form Created</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-background rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedForm?._count?.submissions || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Submissions</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-background rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Send className="h-5 w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedForm?._count?.unsubscribed || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Unsubscribed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Email Campaigns"
        featureIcon={<Mail className="h-5 w-5 text-slate-700 dark:text-slate-300" />}
        description="Create and manage email campaigns with advanced features like scheduling, analytics, and more. Available on Standard and Pro plans."
      />
    </div>
  )
} 
