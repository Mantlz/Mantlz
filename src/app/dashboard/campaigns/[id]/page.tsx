'use client';

import { useEffect, useState, useCallback } from 'react';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Mail } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradeModal } from '@/components/modals/UpgradeModal';
import { Campaign, CampaignStats } from './_components/types';
import { CampaignHeader } from './_components/CampaignHeader';
import { CampaignStats as CampaignStatsComponent } from './_components/CampaignStats';
import { DetailedMetrics } from './_components/DetailedMetrics';
import { CampaignActions } from './_components/CampaignActions';
import { CampaignDetailSkeleton } from './_components/CampaignDetailSkeleton';
import { fetchCampaignById, fetchCampaignStats, getBackUrl } from './_components/utils';
import { NoAnalytics } from './_components/NoAnalytics';

interface CampaignDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const unwrappedParams = React.use(params);
  const campaignId = unwrappedParams.id;
  
  const { isPremium, userPlan } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get('formId') ?? undefined;

  const loadStats = useCallback(async () => {
    const statsData = await fetchCampaignStats(campaignId);
    setStats(statsData);
  }, [campaignId]);

  useEffect(() => {
    async function loadCampaign() {
      setLoading(true);
      const result = await fetchCampaignById(campaignId, formId);
      setCampaign(result);
      setLoading(false);
    }

    loadCampaign();
  }, [campaignId, formId]);

  useEffect(() => {
    if (campaign?.status === 'SENT' && isPremium) {
      loadStats();
    }
  }, [campaign?.status, isPremium, campaignId, loadStats]);

  const handleBackClick = () => {
    router.push(getBackUrl(formId));
  };

  const refreshCampaignData = async () => {
    const result = await fetchCampaignById(campaignId, formId);
    if (result) {
      setCampaign(result);
      if (result.status === 'SENT' && isPremium) {
        loadStats();
      }
    }
  };

  if (loading) {
    return <CampaignDetailSkeleton />;
  }

  if (!campaign) {
    return (
      <div className="container py-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBackClick}
          className="mb-6 h-8 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg px-3"
        >
          <ChevronLeft className="h-3.5 w-3.5 mr-1" />
          <span className="hidden xs:inline">Back to Campaigns</span>
        </Button>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-lg font-medium text-red-800 dark:text-red-300">Campaign not found</h2>
          <p className="text-red-600 dark:text-red-400 mt-2">
            The campaign you&apos;re looking for does not exist or you don&apos;t have permission to view it.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8 space-y-6">
      {/* Top Header Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <CampaignHeader campaign={campaign} onBackClick={handleBackClick} />
              <CampaignActions
                campaign={campaign}
                isPremium={isPremium}
                userPlan={userPlan}
                onUpgradeClick={() => setShowUpgradeModal(true)}
                onSent={refreshCampaignData}
                onScheduled={refreshCampaignData}
              />
            </div>
            <CampaignStatsComponent campaign={campaign} />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {campaign.status === 'SENT' ? (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Campaign Analytics</h3>
              {!isPremium && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowUpgradeModal(true)}
                  className="h-7 px-2 text-xs cursor-pointer gap-1 bg-white hover:bg-zinc-100 text-gray-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-gray-300 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-all duration-200"
                >
                  Upgrade for Analytics
                </Button>
              )}
            </div>
          </div>
          <div className="p-6">
            <DetailedMetrics
              stats={stats}
              isPremium={isPremium}
              onUpgradeClick={() => setShowUpgradeModal(true)}

            />
          </div>
        </div>
      ) : (
        <NoAnalytics 
          isDraft={campaign.status === 'DRAFT'}
        />
      )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Email Campaign Analytics"
        featureIcon={<Mail className="h-5 w-5 text-slate-700 dark:text-slate-300" />}
        description="Get detailed insights into your campaign performance with advanced analytics. Track opens, clicks, bounces, and more in real-time."
      />
    </div>
  );
} 