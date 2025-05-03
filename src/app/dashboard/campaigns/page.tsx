"use client"

import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/client';
import { Button } from '@/components/ui/button';
import { CampaignList } from '@/components/campaigns';
import { CampaignWizard } from '@/components/campaigns/CampaignWizard';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

import { Suspense } from 'react';
import { CampaignTableSkeleton } from '@/components/campaigns/table/CampaignTableSkeleton';
import { FormsListView } from '@/components/campaigns/FormsListView';

export default function CampaignsPage() {
  return (
    <div className="py-8 space-y-6 sm:space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Email Campaigns</h1>
      <Suspense fallback={<CampaignTableSkeleton />}>
        <CampaignsPageContent />
      </Suspense>
    </div>
  );
}

function CampaignsPageSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <Skeleton className="h-8 w-48" />
      <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-48" />
                </div>
              </div>
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CampaignsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");
  const viewParam = searchParams.get("view") as "grid" | "list" | null;
  const [viewMode, setViewMode] = useState<"grid" | "list">(viewParam || "grid");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: forms, isLoading: isLoadingForms } = useQuery({
    queryKey: ['forms'],
    queryFn: async () => {
      const response = await client.forms.getUserForms.$get();
      return response.json();
    },
  });

  // Handle view mode change
  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("view", mode);
    router.push(`?${newParams.toString()}`);
  };

  // Handle form selection
  const handleFormSelect = (selectedFormId: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("formId", selectedFormId);
    router.push(`?${newParams.toString()}`);
  }

  if (isLoadingForms) {
    return <CampaignsPageSkeleton />;
  }

  if (!forms?.forms?.length) {
    return (
      <FormsListView 
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onFormSelect={handleFormSelect}
        showCreateButton={true}
      />
    );
  }

  // If a specific form is selected
  if (formId) {
    const currentForm = forms.forms.find(form => form.id === formId);
    
    return (
      <div className="space-y-6 sm:space-y-8">

      
        <div className="rounded-lg bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
          <div className="p-4">
            <CampaignList formId={formId} />
          </div>
        </div>

        {/* Create Campaign Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <CampaignWizard formId={formId} onClose={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Show all forms
  return (
    <FormsListView 
      viewMode={viewMode}
      onViewModeChange={handleViewModeChange}
      onFormSelect={handleFormSelect}
      showCreateButton={true}
    />
  );
}

