'use client';

import { Button } from '@/components/ui/button';
import { Mail, Check, Eye, MousePointer, XCircle, AlertTriangle, Ban } from 'lucide-react';
import { CampaignStats } from './types';

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
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

  const metrics = [
    {
      icon: <Mail className="h-5 w-5 text-gray-900 dark:text-white" />,
      label: 'Total Recipients',
      value: stats.totalRecipients,
      color: 'bg-black/5 dark:bg-white/5'
    },
    {
      icon: <Check className="h-5 w-5 text-green-600" />,
      label: 'Delivered',
      value: stats.totalDelivered,
      color: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: <Eye className="h-5 w-5 text-blue-600" />,
      label: 'Opened',
      value: stats.totalOpened,
      color: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: <MousePointer className="h-5 w-5 text-purple-600" />,
      label: 'Clicked',
      value: stats.totalClicked,
      color: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: <XCircle className="h-5 w-5 text-red-600" />,
      label: 'Bounced',
      value: stats.totalBounced,
      color: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
      label: 'Complaints',
      value: stats.totalComplaints,
      color: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      icon: <Ban className="h-5 w-5 text-gray-600" />,
      label: 'Unsubscribed',
      value: stats.totalUnsubscribed,
      color: 'bg-gray-50 dark:bg-gray-900/20'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Basic stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.slice(0, 4).map((metric, index) => (
          <div key={index} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <div className="flex flex-col items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${metric.color} flex items-center justify-center`}>
                {metric.icon}
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {metric.value.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {metric.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed metrics */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Detailed Metrics
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-x divide-y divide-zinc-200 dark:divide-zinc-700">
          {metrics.slice(4).map((metric, index) => (
            <div key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${metric.color} flex items-center justify-center`}>
                    {metric.icon}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {metric.label}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {metric.value.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 