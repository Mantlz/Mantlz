"use client"

import React, { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useSubscription } from "../../../../hooks/useSubscription"
import { CampaignsGridSkeleton,CampaignsTableHeaderSkeleton } from "../../../../components/skeletons"
import { Button } from "../../../../components/ui/button"
import { FileSpreadsheet, Mail, LayoutGrid, List } from "lucide-react"
import { FormsResponse, CampaignResponse } from "./types"
import { fetchUserForms, fetchCampaigns } from "./tableUtils"
import { TableHeader } from "./TableHeader"
import { TableContent } from "./TableContent"

import { CampaignTableSkeleton } from "../../../skeletons"



interface CampaignsTableProps {
  itemsPerPage?: number;
  isPremium?: boolean;
  onUpgradeClick?: () => void;
}

export function CampaignsTable({ itemsPerPage = 8, isPremium = false, onUpgradeClick }: CampaignsTableProps) {
  return (
    <Suspense fallback={<CampaignsGridSkeleton />}>
      <CampaignsTableContent itemsPerPage={itemsPerPage} isPremium={isPremium} onUpgradeClick={onUpgradeClick} />
    </Suspense>
  )
}

function CampaignsTableContent({ itemsPerPage = 8, isPremium = false, onUpgradeClick }: CampaignsTableProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const page = Number(searchParams.get("page")) || 1
  const formId = searchParams.get("formId")
  const viewParam = searchParams.get("view") as "grid" | "list" | null
  const [viewMode, setViewMode] = useState<"grid" | "list">(viewParam || "grid")
  const { subscription } = useSubscription()

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
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  })

  // Add debug logs
  // console.log('Forms Data:', formsData);
  if (formsData?.forms) {
    formsData.forms.forEach((form, index) => {
      console.log(`Form ${index + 1}:`, {
        id: form.id,
        name: form.name,
        description: form.description,
        campaignCount: form._count?.campaigns,
        submissionCount: form._count?.submissions,
        _count: form._count
      });
    });
  }

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
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  })

  // Handle form selection with premium check
  function handleFormClick(formId: string) {
    console.log('Form clicked:', formId);
    
    if (!isPremium) {
      console.log('User is not premium, showing upgrade modal');
      onUpgradeClick?.();
      return;
    }
    
    console.log('Setting formId in URL params:', formId);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("formId", formId);
    newParams.set("page", "1");
    
    const newUrl = `?${newParams.toString()}`;
    console.log('Navigating to new URL:', newUrl);
    
    router.push(newUrl);
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
          <CampaignsTableHeaderSkeleton />
          <CampaignTableSkeleton />
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
          <CampaignsGridSkeleton />
        </div>
      );
    }

    // No forms state with premium check
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
                        {isPremium ? "Let's create your first form" : "Upgrade to create email campaigns"}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-all duration-200 rounded-lg px-6 shadow-sm hover:shadow-md"
                  onClick={() => isPremium ? router.push("/dashboard/forms") : onUpgradeClick?.()}
                >
                  {isPremium ? "Create Your First Form" : "Upgrade to Create Campaigns"}
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center py-12 sm:py-16 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-white dark:bg-zinc-800/50 flex items-center justify-center">
              <FileSpreadsheet className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">
              {isPremium ? "Ready to create your first form?" : "Upgrade to access email campaigns"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-sm mx-auto px-4">
              {isPremium 
                ? "Start collecting responses in minutes with our easy-to-use form builder"
                : "Create and manage email campaigns with advanced features like scheduling, analytics, and more"}
            </p>
            <Button
              className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-all duration-200 rounded-lg px-6 shadow-sm hover:shadow-md"
              onClick={() => isPremium ? router.push("/dashboard/forms") : onUpgradeClick?.()}
            >
              {isPremium ? "Create Your First Form" : "Upgrade Now"}
            </Button>
          </div>
        </div>
      );
    }

    // Show forms grid/list based on viewMode
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="relative overflow-hidden bg-white dark:bg-background rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm mb-6">
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
                <div className="flex items-center gap-3">
                  {/* View Toggle */}
                  <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-lg p-1 flex items-center">
                    <button
                      onClick={() => handleViewModeChange('grid')}
                      className={`p-1.5 rounded-lg ${viewMode === 'grid' 
                        ? 'bg-zinc-100 dark:bg-zinc-700 text-gray-900 dark:text-white' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      aria-label="Grid view"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleViewModeChange('list')}
                      className={`p-1.5 rounded-lg ${viewMode === 'list' 
                        ? 'bg-zinc-100 dark:bg-zinc-700 text-gray-900 dark:text-white' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      aria-label="List view"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className=" rounded-xl hover:bg-zinc-100 p-4 border border-zinc-100 dark:border-zinc-700/50  dark:hover:border-zinc-300/50 transition-all duration-200">
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
                
                <div className=" rounded-xl p-4 border border-zinc-100 dark:border-zinc-700/50 hover:border-zinc-200 dark:hover:border-zinc-600/50 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formsData.forms.reduce((total, form) => total + (form._count?.campaigns || 0), 0)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Campaigns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {formsData.forms.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((form) => (
              <div
                key={form.id}
                className={` border ${(form._count?.campaigns || 0) > 0 ? 'border-background dark:border-background' : 'border-zinc-100 dark:border-zinc-800/50'} rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer`}
                onClick={() => handleFormClick(form.id)}
              >
                {(() => {
                  // console.log('Rendering form description:', form.description);
                  return (
                    <div className="p-4 sm:p-6">
                      <div className="space-y-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {form.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {form.description || "No description available"}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            <strong>{form._count?.campaigns || 0}</strong> campaign{(form._count?.campaigns || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-7 px-2 text-xs ${(form._count?.campaigns || 0) > 0 
                            ? 'bg-background hover:bg-background text-stone-800 dark:bg-background dark:hover:bg-background dark:text-white' 
                            : 'hover:bg-zinc-200 text-gray-600 dark:hover:bg-zinc-950 dark:text-gray-300'} rounded-lg`}
                        >
                          View Campaigns
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {formsData.forms.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((form) => (
              <div
                key={form.id}
                className={` border ${(form._count?.campaigns || 0) > 0 ? 'border-background dark:border-background' : 'border-zinc-100 dark:border-zinc-800/50'} rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
                onClick={() => handleFormClick(form.id)}
              >
                <div className="p-4 sm:p-5 flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                      <FileSpreadsheet className="h-5 w-5 text-gray-900 dark:text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="space-y-1">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">
                          {form.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {form.description || "No description available"}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                          <span>{form._count?.campaigns || 0} campaign{(form._count?.campaigns || 0) !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-7 px-2 text-xs ${(form._count?.campaigns || 0) > 0 
                      ? 'bg-orange-50 hover:bg-orange-100 text-stone-800 dark:bg-blue-900/20 dark:hover:bg-orange-900/30 dark:text-white' 

                      : 'hover:bg-zinc-200 text-gray-600 dark:hover:bg-zinc-950 dark:text-gray-300'} rounded-lg`}
                  >
                    View Campaigns
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination for forms list */}
        {formsData?.forms?.length > itemsPerPage && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 rounded-lg"
              disabled={page <= 1}
              onClick={() => {
                const newParams = new URLSearchParams(searchParams.toString())
                newParams.set("page", String(page - 1))
                router.push(`?${newParams.toString()}`)
              }}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {page} of {totalFormsPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 rounded-lg"
              disabled={page >= totalFormsPages}
              onClick={() => {
                const newParams = new URLSearchParams(searchParams.toString())
                newParams.set("page", String(page + 1))
                router.push(`?${newParams.toString()}`)
              }}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    );
  }
} 