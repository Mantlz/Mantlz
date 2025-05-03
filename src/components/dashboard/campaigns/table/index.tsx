"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useSubscription } from "@/hooks/useSubscription"
import { StatsGridSkeleton } from "@/components/skeletons"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, Mail, LayoutGrid, List } from "lucide-react"
import { FormsResponse, CampaignResponse } from "./types"
import { fetchUserForms, fetchCampaigns } from "./tableUtils"
import { TableHeader } from "./TableHeader"
import { TableContent } from "./TableContent"
import { CampaignSearch } from "../CampaignSearch"
import { CampaignTableSkeleton } from "./CampaignTableSkeleton"
import { useState, useEffect, Suspense } from "react"

interface CampaignsTableProps {
  itemsPerPage?: number;
}

export function CampaignsTable({ itemsPerPage = 8 }: CampaignsTableProps) {
  return (
    <Suspense fallback={<StatsGridSkeleton />}>
      <CampaignsTableContent itemsPerPage={itemsPerPage} />
    </Suspense>
  )
}

function CampaignsTableContent({ itemsPerPage = 8 }: CampaignsTableProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const page = Number(searchParams.get("page")) || 1
  const formId = searchParams.get("formId")
  const viewParam = searchParams.get("view") as "grid" | "list" | null
  const [viewMode, setViewMode] = useState<"grid" | "list">(viewParam || "grid")
  const { isPremium, subscription } = useSubscription()

  // Get the plan from the subscription or default to FREE
  const userPlan = subscription?.plan || 'FREE'

  // Update viewMode when URL parameter changes
  useEffect(() => {
    if (viewParam === "grid" || viewParam === "list") {
      setViewMode(viewParam)
    }
  }, [viewParam])

  // Handle view mode change
  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode)
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set("view", mode)
    router.push(`?${newParams.toString()}`)
  }

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
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');

  const { 
    data, 
    isLoading: isLoadingCampaigns, 
    refetch 
  } = useQuery<CampaignResponse>({
    queryKey: ["campaignLogs", formId, page, startDateParam, endDateParam],
    queryFn: () => fetchCampaigns(formId, page, startDateParam || undefined, endDateParam || undefined, itemsPerPage),
    enabled: !!formId,
  })

  // Handle form selection
  function handleFormClick(formId: string) {
    const newParams = new URLSearchParams(searchParams)
    newParams.set("formId", formId)
    newParams.set("page", "1") // Reset to page 1 when selecting a form
    router.push(`?${newParams.toString()}`)
  }

  // Calculate the total pages for forms pagination
  const formsPerPage = itemsPerPage;
  const totalFormsPages = formsData?.pagination?.totalPages || 
    Math.ceil((formsData?.forms?.length || 0) / formsPerPage);

  // Error state
  if (formsError) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center bg-white dark:bg-zinc-900 rounded-lg border border-red-100 dark:border-red-900/50 shadow-sm p-6">
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
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Campaigns</h2>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/campaigns/new")}
              >
                Create Campaign
              </Button>
            </div>
          </div>
          <CampaignTableSkeleton isPremium={isPremium} />
        </div>
      );
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
    );
  } else {
    // Forms list view (with proper loading state)
    if (isLoadingForms) {
      return (
        <div className="space-y-6 sm:space-y-8">
          <StatsGridSkeleton />
        </div>
      );
    }

    // No forms state
    if (!formsData?.forms?.length) {
      return (
        <div className="space-y-6 sm:space-y-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-800 rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="relative p-6 sm:p-8 lg:p-12">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4 w-full sm:w-auto">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Let&apos;s create your first form
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-all duration-200 rounded-lg px-6 shadow-sm hover:shadow-md"
                  onClick={() => router.push("/dashboard/forms/new")}
                >
                  Create Your First Form
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center py-12 sm:py-16 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-white dark:bg-zinc-800/50 flex items-center justify-center">
              <FileSpreadsheet className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">Ready to create your first form?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-sm mx-auto px-4">
              Start collecting responses in minutes with our easy-to-use form builder
            </p>
            <Button
              className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-all duration-200 rounded-lg px-6 shadow-sm hover:shadow-md"
              onClick={() => router.push("/dashboard/forms/new")}
            >
              Create Your First Form
            </Button>
          </div>
        </div>
      );
    }

    // Display the list of forms
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-medium">View</span>
              <div className="flex items-center space-x-1 rounded-md bg-muted p-1">
                <button
                  className={`rounded-sm p-1.5 ${
                    viewMode === "grid"
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => handleViewModeChange("grid")}
                >
                  <LayoutGrid className="h-5 w-5" />
                  <span className="sr-only">Grid view</span>
                </button>
                <button
                  className={`rounded-sm p-1.5 ${
                    viewMode === "list"
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => handleViewModeChange("list")}
                >
                  <List className="h-5 w-5" />
                  <span className="sr-only">List view</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formsData?.forms.map((form) => (
            <div
              key={form.id}
              className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleFormClick(form.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white truncate max-w-[200px]">
                    {form.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created on{" "}
                    {new Date(form.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2 rounded-lg">
                  <Mail className="h-5 w-5" />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFormClick(form.id);
                }}
              >
                View Campaigns
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }
} 