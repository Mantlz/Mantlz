"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSubscription } from "@/hooks/useSubscription";
import { StatsGridSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Users, LayoutGrid, List } from "lucide-react";
import { FormsResponse, SubmissionResponse } from "./types";
import { fetchUserForms, fetchSubmissions } from "./tableUtils";
import { TableHeader } from "./TableHeader";
import { TableContent } from "./TableContent";
import { LogsTableHeaderSkeleton } from "@/components/skeletons";
import { SubmissionSearch } from "../../logs/SubmissionSearch";
import { SubmissionTableSkeleton } from "../../../skeletons";
import { useState, useEffect, Suspense } from "react";

interface LogsTableProps {
  itemsPerPage?: number;
}

export function LogsTable({ itemsPerPage = 8 }: LogsTableProps) {
  return (
    <Suspense fallback={<StatsGridSkeleton />}>
      <LogsTableContent itemsPerPage={itemsPerPage} />
    </Suspense>
  );
}

function LogsTableContent({ itemsPerPage = 8 }: LogsTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page")) || 1;
  const formId = searchParams.get("formId");
  const viewParam = searchParams.get("view") as "grid" | "list" | null;
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    viewParam || "grid"
  );
  const { isPremium, subscription } = useSubscription();

  // Get the plan from the subscription or default to FREE
  const userPlan = subscription?.plan || "FREE";

  // Update viewMode when URL parameter changes
  useEffect(() => {
    if (viewParam === "grid" || viewParam === "list") {
      setViewMode(viewParam);
    }
  }, [viewParam]);

  // Handle view mode change
  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("view", mode);
    router.push(`?${newParams.toString()}`);
  };

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
    refetchOnWindowFocus: true,
  });

  // Fetch submissions for selected form
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  const {
    data,
    isLoading: isLoadingSubmissions,
    refetch,
  } = useQuery<SubmissionResponse>({
    queryKey: ["submissionLogs", formId, page, startDateParam, endDateParam],
    queryFn: () =>
      fetchSubmissions(
        formId,
        page,
        startDateParam || undefined,
        endDateParam || undefined,
        itemsPerPage
      ),
    enabled: !!formId,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Handle form selection
  function handleFormClick(formId: string) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("formId", formId);
    newParams.set("page", "1"); // Reset to page 1 when selecting a form
    router.push(`?${newParams.toString()}`);
  }

  // Calculate the total pages for forms pagination
  const formsPerPage = itemsPerPage;
  const totalFormsPages =
    formsData?.pagination?.totalPages ||
    Math.ceil((formsData?.forms?.length || 0) / formsPerPage);

  // Error state
  if (formsError) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center rounded-lg border border-red-100 dark:border-red-900/50  p-6">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
            Error Loading Forms
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {(formsError as Error)?.message || "An unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }

  // Handle different view states based on formId and loading states
  if (formId) {
    // Form-specific view (with proper loading state)
    if (isLoadingForms || isLoadingSubmissions || !data) {
      return (
        <div className="space-y-6 sm:space-y-8">
          <LogsTableHeaderSkeleton />
          <SubmissionTableSkeleton isPremium={isPremium} />
        </div>
      );
    }

    // Form is loaded and submissions are loaded
    return (
      <div className="space-y-6 sm:space-y-8">
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
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800/50">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="relative p-6 sm:p-8 lg:p-12">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4 w-full sm:w-auto">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300">
                        Let&apos;s create your first form
                      </p>
                    </div>
                  </div>
                </div>
                <Button
              className="h-10 px-2 text-md bg-amber-500 text-black dark:text-white dark:border-background border text-sm ring ring-inset ring-white/20 transition-[filter] duration-200 hover:brightness-125 active:brightness-95"
                  onClick={() => router.push("/dashboard/form")}
                >
                  Create Your First Form
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center py-12 sm:py-16  rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 rounded-xl bg-accent/80 flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5 text-black dark:text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">
              Ready to create your first form?
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4 sm:mb-6 max-w-sm mx-auto px-4">
              Start collecting responses in minutes with our easy-to-use form
              builder
            </p>
            <Button
              className="h-10 px-2 text-md bg-amber-500 text-black dark:text-white dark:border-background border text-sm  shadow-zinc-950/30 ring ring-inset ring-white/20 transition-[filter] duration-200 hover:brightness-125 active:brightness-95"
              onClick={() => router.push("/dashboard/form")}
            >
              Create Your First Form
            </Button>
          </div>
        </div>
      );
    }

    // Show forms grid/list based on viewMode
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="relative overflow-hidden bg-white dark:bg-background rounded-2xl border border-zinc-200 dark:border-zinc-800  mb-6">
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
                    {formsData.forms.length} form
                    {formsData.forms.length !== 1 ? "s" : ""} available
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* View Toggle */}
                  {/* <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1 flex items-center">
                    <button
                      onClick={() => handleViewModeChange('grid')}
                      className={`p-1.5 rounded-lg ${viewMode === 'grid' 
                        ? 'bg-zinc-100 dark:bg-zinc-700 text-gray-900 dark:text-white' 
                        : 'text-zinc-600 dark:text-zinc-300 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      aria-label="Grid view"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleViewModeChange('list')}
                      className={`p-1.5 rounded-lg ${viewMode === 'list' 
                        ? 'bg-zinc-100 dark:bg-zinc-700 text-gray-900 dark:text-white' 
                        : 'text-zinc-600 dark:text-zinc-300 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      aria-label="List view"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div> */}
                  <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 gap-1 flex items-center">
                    <Button
                      variant="outline"
                      onClick={() => handleViewModeChange("grid")}
                      className={`p-1 rounded-lg ${
                        viewMode === "grid"
                          ? "bg-zinc-100 dark:bg-zinc-700 text-gray-900 dark:text-white "
                          : "text-zinc-600 dark:text-zinc-300 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                      aria-label="Grid view"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="7" height="7" x="3" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="14" rx="1" />
                        <rect width="7" height="7" x="3" y="14" rx="1" />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleViewModeChange("list")}
                      className={`p-1 rounded-lg ${
                        viewMode === "list"
                          ? "bg-zinc-100 dark:bg-zinc-700 text-gray-900 dark:text-white"
                          : "text-zinc-600 dark:text-zinc-300 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                      aria-label="List view"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="3" x2="21" y1="6" y2="6" />
                        <line x1="3" x2="21" y1="12" y2="12" />
                        <line x1="3" x2="21" y1="18" y2="18" />
                      </svg>
                    </Button>
                  </div>
                  <SubmissionSearch />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className=" rounded-xl  p-4 border border-zinc-200 dark:border-zinc-700/50 hover:border-zinc-200 dark:hover:border-zinc-600/50 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                      <FileSpreadsheet className="h-5 w-5 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formsData.forms.length}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300">
                        Total Forms
                      </p>
                    </div>
                  </div>
                </div>

                <div className=" rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/50 hover:border-zinc-200 dark:hover:border-zinc-600/50 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formsData.forms.reduce(
                          (total, form) => total + (form.submissionCount || 0),
                          0
                        )}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300">
                        Total Submissions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {formsData.forms
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((form) => (
                <div
                  key={form.id}
                  className={` border ${form.submissionCount > 0 ? "border-amber-100 dark:border-amber-500/20" : "border-zinc-200 dark:border-amber-500/50"} rounded-xl  hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer`}
                  onClick={() => handleFormClick(form.id)}
                >
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                      {form.name}
                    </h3>
                    {form.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-3 line-clamp-2">
                        {form.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-1">
                        <FileSpreadsheet className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-zinc-600 dark:text-zinc-300">
                          {form.submissionCount} submission
                          {form.submissionCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        className={`h-7 px-2 text-xs ${
                          form.submissionCount > 0
                            ? "bg-background hover:bg-background-100 text-stone-800 dark:bg-background-900/20 dark:hover:bg-amber-500 dark:text-white"
                            : "hover:bg-zinc-200 text-gray-600 dark:hover:bg-amber-500 dark:text-gray-300"
                        } rounded-lg`}
                      >
                        View Logs
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-3">
            {formsData.forms
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((form) => (
                <div
                  key={form.id}
                  className={`bg-white dark:bg-background border ${form.submissionCount > 0 ? "border-amber-100 dark:border-amber-500/30" : "border-zinc-200 dark:border-zinc-800/50"} rounded-lg  hover:shadow-md transition-all duration-200 cursor-pointer`}
                  onClick={() => handleFormClick(form.id)}
                >
                  <div className="p-4 sm:p-5 flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <FileSpreadsheet className="h-5 w-5 text-gray-900 dark:text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">
                          {form.name}
                        </h3>
                        <div className="flex items-center gap-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                            <span>
                              {form.submissionCount} submission
                              {form.submissionCount !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                        variant="default"
                        size="sm"
                        className={`h-7 px-2 text-xs ${
                          form.submissionCount > 0
                            ? "bg-background hover:bg-background-100 text-stone-800 dark:bg-background-900/20 dark:hover:bg-amber-500 dark:text-white"
                            : "hover:bg-zinc-200 text-gray-600 dark:hover:bg-amber-500 dark:text-gray-300"
                        } rounded-lg`}
                      >
                        View Logs
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
                const newParams = new URLSearchParams(searchParams.toString());
                newParams.set("page", String(page - 1));
                router.push(`?${newParams.toString()}`);
              }}
            >
              Previous
            </Button>
            <span className="text-sm text-zinc-600 dark:text-zinc-300">
              Page {page} of {totalFormsPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 rounded-lg"
              disabled={page >= totalFormsPages}
              onClick={() => {
                const newParams = new URLSearchParams(searchParams.toString());
                newParams.set("page", String(page + 1));
                router.push(`?${newParams.toString()}`);
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
