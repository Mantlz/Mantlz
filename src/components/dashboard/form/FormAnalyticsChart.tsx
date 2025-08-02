"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Lock, Chrome, MonitorSmartphone, CircleIcon, Globe, GlobeIcon } from "lucide-react"

import { AdvancedAnalytics } from "./AdvancedAnalytics"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import { useSubscription } from "@/hooks/useSubscription"
import { cn } from "@/lib/utils"

interface TimeSeriesPoint {
  time: string;
  submissions: number;
}

interface UserInsight {
  type: string;
  value: string;
  percentage: number;
}

interface BrowserStat {
  name: string;
  count: number;
  percentage: number;
}

interface CountryStat {
  name: string;
  count: number;
  percentage: number;
}

interface FormAnalyticsChartProps {
  chartData: TimeSeriesPoint[];
  latestDataPoint: TimeSeriesPoint;
  analytics?: {
    totalSubmissions: number;
    dailySubmissionRate: number;
    weekOverWeekGrowth: number;
    last24HoursSubmissions: number;
    engagementScore: number;
    peakSubmissionHour: number;
    completionRate: number;
    averageResponseTime: number;
    userPlan?: string;
    // User insights data
    userInsights?: UserInsight[];
    browserStats?: BrowserStat[];
    locationStats?: CountryStat[];
  };
  isLoading: boolean;
  timeRange: 'day' | 'week' | 'month';
  onTimeRangeChange: (range: 'day' | 'week' | 'month') => void;
}

export function FormAnalyticsChart({
  chartData: rawChartData,
  analytics,
  isLoading,
  timeRange,
  onTimeRangeChange
}: FormAnalyticsChartProps) {

  const [activeTab, setActiveTab] = React.useState<'overview' | 'insights'>('overview')
  const [isCollapsed] = React.useState(false)

  // Use the real data directly from the backend
  const chartData = React.useMemo(() => rawChartData, [rawChartData]);

  // User insights data
  const userInsights = React.useMemo(() => {
    return analytics?.userInsights || [];
  }, [analytics?.userInsights]);

  // Use the subscription hook for premium access check
  const { isPremium } = useSubscription();

  // Get browser icon based on name
  const getBrowserIcon = (browserName: string) => {
    switch (browserName.toLowerCase()) {
      case 'chrome':
        return <Chrome className="h-5 w-5 text-white dark:text-zinc-900" />;
      case 'safari':
      case 'mobile safari':
        return <MonitorSmartphone className="h-5 w-5 text-white dark:text-zinc-900" />;
      case 'firefox':
        return <CircleIcon className="h-5 w-5 text-white dark:text-zinc-900" />;
      case 'edge':
        return <Globe className="h-5 w-5 text-white dark:text-zinc-900" />;
      default:
        return <GlobeIcon className="h-5 w-5 text-white dark:text-zinc-900" />;
    }
  };

  // Transform browser stats for the advanced analytics
  const browserStats = React.useMemo(() => {
    if (!analytics?.browserStats) {
      return [];
    }
    const transformed = analytics.browserStats.map(stat => ({
      ...stat,
      icon: getBrowserIcon(stat.name)
    }));
    return transformed;
  }, [analytics?.browserStats]);

  // Transform location stats for the advanced analytics
  const locationStats = React.useMemo(() => {
    if (!analytics?.locationStats) {
      return [];
    }
    return analytics.locationStats;
  }, [analytics?.locationStats]);

  // Get the appropriate time range label
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'day': return 'Last 24 hours';
      case 'week': return 'Last 7 days';
      case 'month': return 'Last 30 days';
      default: return 'Submission data';
    }
  }

  // Format time labels based on time range
  const formatTimeLabel = (value: string) => {
    if (timeRange === 'day') {
      const hour = parseInt(value?.split(':')?.[0] ?? '0', 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}${ampm}`;
    }

    // For week and month, return as is
    return value;
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden  rounded-lg sm:rounded-xl border border-zinc-200 dark:border-zinc-800/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-6 sm:p-8 lg:p-12">
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <div className="w-8 h-8 animate-spin rounded-full border-4 border-black dark:border-white border-t-orange-300 dark:border-t-orange-600"></div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">Loading analytics data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Handle empty data scenario
  const hasData = chartData.some(point => point.submissions > 0);

  return (
    <div className="relative overflow-hidden  rounded-lg sm:rounded-xl border border-zinc-200 dark:border-zinc-800/50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative p-6 sm:p-8 lg:p-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white">Analytics Overview</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{getTimeRangeLabel()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={timeRange === 'day' ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                "rounded-lg cursor-pointer",
                timeRange === 'day'
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              )}
              onClick={() => onTimeRangeChange('day')}
            >
              24h
            </Button>
            <Button
              variant={timeRange === 'week' ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                "rounded-lg cursor-pointer",
                timeRange === 'week'
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              )}
              onClick={() => onTimeRangeChange('week')}
            >
              7d
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                "rounded-lg cursor-pointer",
                timeRange === 'month'
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              )}
              onClick={() => onTimeRangeChange('month')}
            >
              30d
            </Button>
          </div>
        </div>

        {/* Analytics Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              "rounded-lg cursor-pointer",
              activeTab === 'overview'
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            )}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'insights' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              "rounded-lg cursor-pointer",
              activeTab === 'insights'
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            )}
            onClick={() => setActiveTab('insights')}
          >
            {!isPremium && <Lock className="h-3 w-3 mr-1" />}
            User Insights
          </Button>
        </div>

        {activeTab === 'overview' && (
          <>
            {!hasData ? (
              <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-gray-400 dark:text-zinc-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No data yet</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-sm text-center">
                  Once your form starts receiving submissions, you&apos;ll see analytics data here.
                </p>
              </div>
            ) : (


                <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-4 sm:p-5 border border-zinc-200 dark:border-zinc-800/50">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData || []}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
                        <XAxis
                          dataKey="time"
                          tickFormatter={formatTimeLabel}
                          className="text-xs text-zinc-600 dark:text-zinc-300"
                        />
                        <YAxis
                          className="text-xs text-zinc-600 dark:text-zinc-300"
                        />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-3 border border-zinc-200 dark:border-zinc-800">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                    {payload[0]?.value || 0} submissions
                                  </p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar
                          dataKey="submissions"
                          fill="currentColor"
                          className="fill-black dark:fill-white"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

            )}
          </>
        )}

        {activeTab === 'insights' && (
          <div className="relative">
            <AdvancedAnalytics
              activeTab="insights"
              hasPremiumAccess={isPremium}
              userInsights={userInsights}
              browserStats={browserStats}
              locationStats={locationStats}
              isCollapsed={isCollapsed}
            />
          </div>
        )}
      </div>
    </div>
  )
}
