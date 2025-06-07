'use client';

import { Button } from '@/components/ui/button';
import { CampaignStats } from './types';
import { CampaignChart } from './CampaignChart';

interface DetailedMetricsProps {
  stats: CampaignStats | null;
  isPremium: boolean;
  onUpgradeClick: () => void;
}

export function DetailedMetrics({
  stats,
  isPremium,
  onUpgradeClick,
}: DetailedMetricsProps) {
  if (!isPremium) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Upgrade to Access Analytics
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-lg mx-auto">
          Get detailed insights into your campaign performance with advanced analytics.
          Track opens, clicks, and more.
        </p>
        <Button
          onClick={onUpgradeClick}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
        >
          Upgrade Now
        </Button>
      </div>
    );
  }

  // Only show chart if we have data
  const hasData = stats?.timeSeriesData && stats.timeSeriesData.length > 0;
  if (!hasData) {
    return null;
  }
  
  return (
    <div className="space-y-8">
      <CampaignChart data={stats.timeSeriesData} />
    </div>
  );
} 