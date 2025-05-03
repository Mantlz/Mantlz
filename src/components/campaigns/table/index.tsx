"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { StatsGridSkeleton } from "@/components/skeletons"
import { Button } from "@/components/ui/button"
import { Plus, Send } from "lucide-react"
import { TableHeader } from "./TableHeader"
import { TableContent } from "./TableContent"
import { CampaignTableSkeleton } from "./CampaignTableSkeleton"
import { useState, useEffect, Suspense } from "react"
import { FormsListView } from "../FormsListView"

interface CampaignTableProps {
  formId?: string;
  itemsPerPage?: number;
}

export function CampaignTable({ formId: initialFormId, itemsPerPage = 8 }: CampaignTableProps) {
  return (
    <Suspense fallback={<StatsGridSkeleton />}>
      <CampaignTableContent formId={initialFormId} itemsPerPage={itemsPerPage} />
    </Suspense>
  )
}

function CampaignTableContent({ formId: initialFormId, itemsPerPage = 8 }: CampaignTableProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const page = Number(searchParams.get("page")) || 1
  
  // Either use the formId from props or from URL params
  const formIdFromUrl = searchParams.get("formId")
  const formId = initialFormId || formIdFromUrl || undefined
  
  const viewParam = searchParams.get("view") as "grid" | "list" | null
  const [viewMode, setViewMode] = useState<"grid" | "list">(viewParam || "grid")

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

  // Handle form selection
  const handleFormSelect = (selectedFormId: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set("formId", selectedFormId)
    router.push(`?${newParams.toString()}`)
  }

  // Fetch form data
  const { data: formData, isLoading: isLoadingForm } = useQuery({
    queryKey: ["form", formId],
    queryFn: async () => {
      const response = await client.forms.getUserForms.$get();
      const forms = await response.json();
      return forms.forms.find((form: any) => form.id === formId);
    },
    enabled: !!formId,
  })

  // Fetch campaigns for the selected form
  const { 
    data, 
    isLoading,
    error
  } = useQuery({
    queryKey: ["campaigns", formId, page],
    queryFn: async () => {
      if (!formId) return [];
      const response = await client.campaign.getFormCampaigns.$get({ formId });
      return response.json();
    },
    enabled: !!formId,
  })

  // If no form selected, show forms list
  if (!formId) {
    return (
      <FormsListView 
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onFormSelect={handleFormSelect}
        showCreateButton={true}
      />
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center bg-white dark:bg-zinc-900 rounded-lg border border-red-100 dark:border-red-900/50 shadow-sm p-6">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Error Loading Campaigns</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">{(error as Error)?.message || "An unknown error occurred"}</p>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading || isLoadingForm || !data) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <CampaignTableSkeleton />
      </div>
    );
  }

  // No campaigns state
  if (!data.length) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <TableHeader 
          formId={formId}
          formData={formData}
          campaignsData={[]}
          searchParams={searchParams}
          router={router}
        />
        <div className="text-center py-12 sm:py-16 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-white dark:bg-zinc-800/50 flex items-center justify-center">
            <Send className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">No campaigns yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-sm mx-auto px-4">
            Create your first campaign to start sending emails to your form submissions
          </p>
          <Button
            className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-all duration-200 rounded-lg px-6 shadow-sm hover:shadow-md"
            onClick={() => router.push(`${pathname}?formId=${formId}&action=create`)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>
    );
  }

  // Campaigns loaded successfully
  return (
    <div className="space-y-6 sm:space-y-8">
      <TableHeader 
        formId={formId}
        formData={formData}
        campaignsData={data}
        searchParams={searchParams}
        router={router}
      />
      <TableContent 
        data={data}
        isLoading={false}
        page={page}
        searchParams={searchParams}
        router={router}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
} 