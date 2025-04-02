"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChevronDown, Info, Lock, Users, Activity, Clock, Chrome, MonitorSmartphone, CircleIcon, Globe, GlobeIcon } from "lucide-react"


import {
  ChartConfig,
  ChartContainer,

  ChartTooltipContent,
} from "@/components/ui/chart"
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
  formCreatedAt?: Date;
  timeRange: 'day' | 'week' | 'month';
  onTimeRangeChange: (range: 'day' | 'week' | 'month') => void;
}

const chartConfig = {
  submissions: {
    label: "Form Submissions",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function FormAnalyticsChart({
  chartData: rawChartData,
  latestDataPoint,
  analytics,
  isLoading,
  formCreatedAt,
  timeRange,
  onTimeRangeChange
}: FormAnalyticsChartProps) {
  const [activeMetric, setActiveMetric] = 
    React.useState<keyof typeof chartConfig>("submissions")
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'overview' | 'insights'>('overview')
  
  // Debug logs for analytics data
  React.useEffect(() => {
    console.log('🔍 FormAnalyticsChart Raw Data:', {
      analytics,
      isLoading,
      timeRange,
      hasData: !!analytics,
      chartData: rawChartData,
      latestDataPoint,
      browserStats: analytics?.browserStats,
      locationStats: analytics?.locationStats,
      userInsights: analytics?.userInsights
    });
  }, [analytics, isLoading, timeRange, rawChartData, latestDataPoint]);

  // Use the real data directly from the backend
  const chartData = React.useMemo(() => rawChartData, [rawChartData]);

  const total = React.useMemo(
    () => ({
      submissions: chartData.reduce((acc, curr) => acc + curr.submissions, 0),
    }),
    [chartData]
  )

  // User insights data
  const userInsights = React.useMemo(() => {
    console.log('📊 User Insights:', analytics?.userInsights);
    return analytics?.userInsights || [];
  }, [analytics?.userInsights]);

  // Use the subscription hook for premium access check
  const { isPremium } = useSubscription();

  // Get browser icon based on name
  const getBrowserIcon = (browserName: string) => {
    console.log('🎨 Getting Browser Icon for:', browserName);
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
    console.log('🔄 Processing Browser Stats:', analytics?.browserStats);
    if (!analytics?.browserStats) {
      console.log('❌ No browser stats available');
      return [];
    }
    const transformed = analytics.browserStats.map(stat => ({
      ...stat,
      icon: getBrowserIcon(stat.name)
    }));
    console.log('✅ Transformed Browser Stats:', transformed);
    return transformed;
  }, [analytics?.browserStats]);

  // Transform location stats for the advanced analytics
  const locationStats = React.useMemo(() => {
    console.log('🔄 Processing Location Stats:', analytics?.locationStats);
    if (!analytics?.locationStats) {
      console.log('❌ No location stats available');
      return [];
    }
    console.log('✅ Location Stats:', analytics.locationStats);
    return analytics.locationStats;
  }, [analytics?.locationStats]);

  // Debug log for the data being passed to AdvancedAnalytics
  React.useEffect(() => {
    console.log('📤 Data being passed to AdvancedAnalytics:', {
      browserStats,
      locationStats,
      userInsights,
      isPremium,
      activeTab,
      isCollapsed,
      analytics: {
        browserStats: analytics?.browserStats,
        locationStats: analytics?.locationStats,
        userInsights: analytics?.userInsights
      }
    });
  }, [browserStats, locationStats, userInsights, isPremium, activeTab, isCollapsed, analytics]);

  // Get the appropriate time range label
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'day': return 'Last 24 hours';
      case 'week': return 'Last 7 days';
      case 'month': return 'Last 30 days';
      default: return 'Submission data';
    }
  }

  // Format peak hour for display
  const getPeakHourLabel = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}${ampm}`;
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
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-6 sm:p-8 lg:p-12">
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <div className="w-8 h-8 animate-spin rounded-full border-4 border-gray-200 dark:border-gray-800 border-t-black dark:border-t-white"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading analytics data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Handle empty data scenario
  const hasData = chartData.some(point => point.submissions > 0);
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800/50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative p-6 sm:p-8 lg:p-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white">Analytics Overview</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{getTimeRangeLabel()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={timeRange === 'day' ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                "rounded-xl cursor-pointer",
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
                "rounded-xl cursor-pointer",
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
                "rounded-xl cursor-pointer",
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
              "rounded-xl cursor-pointer",
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
              "rounded-xl cursor-pointer",
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
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No data yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm text-center">
                  Once your form starts receiving submissions, you'll see analytics data here.
                </p>
              </div>
            ) : (

              
                <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800/50">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData || []}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
                        <XAxis 
                          dataKey="time" 
                          tickFormatter={formatTimeLabel}
                          className="text-xs text-gray-500 dark:text-gray-400"
                        />
                        <YAxis 
                          className="text-xs text-gray-500 dark:text-gray-400"
                        />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-3 border border-gray-100 dark:border-gray-800">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
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