"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useSubscription } from "../../../../hooks/useSubscription"
import { CampaignsGridSkeleton, LogsTableHeaderSkeleton } from "../../../../components/skeletons"
import { Button } from "../../../../components/ui/button"
import { FileSpreadsheet } from "lucide-react"
import { FormsResponse, CampaignResponse } from "./types"
import { fetchUserForms, fetchCampaigns } from "./tableUtils"
import { TableHeader } from "./TableHeader"
import { TableContent } from "./TableContent"
import { CampaignTableSkeleton } from "../../../skeletons/CampaignTableSkeleton"

interface CampaignsTableContentProps {
  itemsPerPage?: number
  isPremium?: boolean
  onUpgradeClick?: () => void
}

export function CampaignsTableContent({ itemsPerPage = 8, isPremium = false, onUpgradeClick }: CampaignsTableContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const page = Number(searchParams.get("page")) || 1
  const formId = searchParams.get("formId")
  const { subscription } = useSubscription()

  // Get the plan from the subscription or default to FREE
  const userPlan = subscription?.plan || 'FREE'

  // Fetch forms data
  const {
    data: formsData,
    isLoading: isLoadingForms,
    error: formsError,
  } = useQuery<FormsResponse>({
    queryKey: ["userForms", page, itemsPerPage],
    queryFn: () => fetchUserForms(page, itemsPerPage),
    retry: 3,
    staleTime: 30000,
  })

  // Fetch campaigns for selected form
  const startDateParam = searchParams.get('startDate')
  const endDateParam = searchParams.get('endDate')

  const { 
    data, 
    isLoading: isLoadingCampaigns, 
    refetch 
  } = useQuery<CampaignResponse>({
    queryKey: ["campaignLogs", formId, page, startDateParam, endDateParam],
    queryFn: () => fetchCampaigns(formId, page, startDateParam || undefined, endDateParam || undefined, itemsPerPage),
    enabled: !!formId,
  })

  // Error state
  if (formsError) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center  rounded-lg border border-red-100 dark:border-red-900/50 shadow-sm p-6">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg">
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

  // Handle different view states based on formId and loading states
  if (formId) {
    // Form-specific view (with proper loading state)
    if (isLoadingForms || isLoadingCampaigns || !data) {
      return (
        <div className="space-y-6 sm:space-y-8">
          <LogsTableHeaderSkeleton />
          <CampaignTableSkeleton  />
        </div>
      )
    }

    // Form is loaded and campaigns are loaded
    return (
      <div className="space-y-6 sm:space-y-8">
        <TableHeader 
          formId={formId}
          formsData={formsData}
          searchParams={searchParams}
          router={router}
          campaignsData={data}
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
          itemsPerPage={itemsPerPage}
        />
      </div>
    )
  }

  // Forms list view (with proper loading state)
  if (isLoadingForms) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <CampaignsGridSkeleton />
      </div>
    )
  }

  // No forms state with premium check
  if (!formsData?.forms?.length) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800/50">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative p-6 sm:p-8 lg:p-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      {isPremium ? "Let's create your first form" : "Upgrade to create email campaigns"}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                            className="h-10 px-2 text-md bg-amber-500 text-black dark:text-white dark:border-background border text-sm  ring ring-inset ring-white/20 transition-[filter] duration-200 hover:brightness-125 active:brightness-95"

                onClick={() => isPremium ? router.push("/dashboard/forms") : onUpgradeClick?.()}
              >
                {isPremium ? "Create Your First Form" : "Upgrade to Create Campaigns"}
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center py-12 sm:py-16  rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 rounded-xl bg-accent/80 flex items-center justify-center">
            <FileSpreadsheet className="h-5 w-5 text-black dark:text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">
            {isPremium ? "Ready to create your first form?" : "Upgrade to access email campaigns"}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4 sm:mb-6 max-w-sm mx-auto px-4">
            {isPremium 
              ? "Create your first form to start collecting responses and sending email campaigns."
              : "Upgrade your account to unlock email campaigns and start engaging with your audience."
            }
          </p>
        </div>
      </div>
    )
  }

  return null
} 