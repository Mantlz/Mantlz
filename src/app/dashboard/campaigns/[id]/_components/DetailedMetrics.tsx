'use client';

import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { CampaignStats } from './types';
import { CampaignChart } from './CampaignChart';

interface DetailedMetricsProps {
  stats: CampaignStats | null;
  isPremium: boolean;
  onUpgradeClick: () => void;
  onRetryStats: () => void;
  loadingStats: boolean;
}

export function DetailedMetrics({
  stats,
  isPremium,
  onUpgradeClick,
  onRetryStats,
  loadingStats
}: DetailedMetricsProps) {
  ('DetailedMetrics render:', { stats, isPremium, loadingStats });

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
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
        >
          Upgrade Now
        </Button>
      </div>
    );
  }

  if (loadingStats) {
    return (
      <div className="space-y-8">
        <div className="h-[300px] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Failed to load campaign statistics
        </p>
        <Button
          variant="outline"
          onClick={onRetryStats}
          className="inline-flex items-center gap-2"
        >
          <Mail className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  const hasTimeSeriesData = stats.timeSeriesData && stats.timeSeriesData.length > 0;
  ('Time series data:', { hasTimeSeriesData, data: stats.timeSeriesData });

  return (
    <div className="space-y-8">
      {hasTimeSeriesData ? (
        <CampaignChart data={stats.timeSeriesData} />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300">
            No analytics data available for this campaign yet.
          </p>
        </div>
      )}
    </div>
  );
} 