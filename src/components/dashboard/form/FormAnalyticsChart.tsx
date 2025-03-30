"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChevronDown, Info, Lock } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MetricCard } from "./MetricCard"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { AdvancedAnalytics } from "./AdvancedAnalytics"

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

// Helper function to generate demo data for week and month
const generateDemoDataForRange = (
  timeRange: 'day' | 'week' | 'month', 
  baseSubmissions: number,
): TimeSeriesPoint[] => {
  // Get random number with base value and variability
  const getRandomValue = (base: number) => {
    const variability = base * 0.7; // 70% variability
    return Math.max(0, Math.floor(base + (Math.random() * variability * 2 - variability)));
  };
  
  if (timeRange === 'week') {
    // Hardcoded week data to avoid type issues
    return [
      { time: "Mon", submissions: getRandomValue(Math.max(1, baseSubmissions / 7)) },
      { time: "Tue", submissions: getRandomValue(Math.max(1, baseSubmissions / 7)) },
      { time: "Wed", submissions: getRandomValue(Math.max(1, baseSubmissions / 7)) },
      { time: "Thu", submissions: getRandomValue(Math.max(1, baseSubmissions / 7)) },
      { time: "Fri", submissions: getRandomValue(Math.max(1, baseSubmissions / 7)) },
      { time: "Sat", submissions: getRandomValue(Math.max(1, baseSubmissions / 7)) },
      { time: "Sun", submissions: getRandomValue(Math.max(1, baseSubmissions / 7)) },
    ];
  } else if (timeRange === 'month') {
    // Generate simplified month data (30 days)
    const monthData: TimeSeriesPoint[] = [];
    const date = new Date();
    
    for (let i = 0; i < 30; i++) {
      const d = new Date(date);
      d.setDate(date.getDate() - 29 + i);
      monthData.push({
        time: `${d.getMonth() + 1}/${d.getDate()}`,
        submissions: i === 29 ? baseSubmissions : getRandomValue(Math.max(1, baseSubmissions / 30)),
      });
    }
    
    return monthData;
  }
  
  // Default: return empty array (should never happen)
  return [];
};

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
  
  // Use the real data directly from the backend
  const chartData = React.useMemo(() => rawChartData, [rawChartData]);

  const total = React.useMemo(
    () => ({
      submissions: chartData.reduce((acc, curr) => acc + curr.submissions, 0),
    }),
    [chartData]
  )

  // User insights data
  const userInsights = analytics?.userInsights || [];

  // Check if user has premium access (standard or pro tier)
  const userPlan = analytics?.userPlan?.toUpperCase() || 'FREE'
  const hasPremiumAccess = userPlan === 'STANDARD' || userPlan === 'PRO';

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
      <Card className="bg-zinc-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
        <CardContent className="flex h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 dark:border-zinc-800 border-t-slate-500 dark:border-t-zinc-600" />
            <p className="text-sm text-slate-500 dark:text-zinc-400 font-mono">Loading data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Handle empty data scenario
  const hasData = chartData.some(point => point.submissions > 0);
  
  return (
    <Card className="relative bg-zinc-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-md w-full">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-zinc-900/50 dark:to-zinc-800/50 pointer-events-none" />
      
      {/* Accent line */}


      <CardHeader className="relative space-y-4 border-b border-slate-200 dark:border-zinc-800 p-3 sm:p-4 md:p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-slate-900 dark:text-zinc-50 font-mono text-base sm:text-lg md:text-xl tracking-wider">
              Form Analytics
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-zinc-400 font-mono text-xs sm:text-sm">
              {getTimeRangeLabel()}
            </CardDescription>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="group p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md transition-all duration-200"
            aria-label={isCollapsed ? 'Expand chart' : 'Collapse chart'}
          >
            <ChevronDown 
              className={`h-4 w-4 sm:h-5 sm:w-5 text-slate-500 dark:text-zinc-400 transition-transform duration-300 group-hover:text-slate-900 dark:group-hover:text-zinc-50 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Analytics Tab Selector */}
        <div className={`flex items-center gap-1.5 sm:gap-2 transition-all duration-300 ${
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[200px] opacity-100'
        }`}>
          <button
            onClick={() => setActiveTab('overview')}
            data-active={activeTab === 'overview'}
            className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200
              text-slate-600 dark:text-white hover:text-slate-900 dark:hover:text-white
              data-[active=true]:bg-slate-900 dark:data-[active=true]:bg-white
              data-[active=true]:text-white dark:data-[active=true]:text-zinc-900"
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            data-active={activeTab === 'insights'}
            className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200
              text-slate-600 dark:text-white hover:text-slate-900 dark:hover:text-white
              data-[active=true]:bg-slate-900 dark:data-[active=true]:bg-white
              data-[active=true]:text-white dark:data-[active=true]:text-zinc-900 flex items-center gap-1"
          >
            {!hasPremiumAccess && <Lock className="h-3 w-3" />}
            User Insights
          </button>
        </div>

        {/* Time Range Selector */}
        <div className={`flex items-center gap-1.5 sm:gap-2 transition-all duration-300 ${
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[200px] opacity-100'
        }`}>
          {['day', 'week', 'month'].map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range as 'day' | 'week' | 'month')}
              data-active={timeRange === range}
              className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200
                text-slate-600 dark:text-white hover:text-slate-900 dark:hover:text-white
                data-[active=true]:bg-slate-900 dark:data-[active=true]:bg-white
                data-[active=true]:text-white dark:data-[active=true]:text-zinc-900"
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB CONTENT */}
        {activeTab === 'overview' && (
          <>
            {/* Basic Metrics Grid (Free for all users) */}
            <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 transition-all duration-300 ${
              isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[200px] opacity-100'
            }`}>
              <MetricCard
                label="Total Submissions"
                value={analytics?.totalSubmissions ?? 0}
                format="number"
              />
              <MetricCard
                label="Daily Rate"
                value={analytics?.dailySubmissionRate ?? 0}
                format="number"
                suffix="/day"
              />
              <MetricCard
                label="24h Activity"
                value={analytics?.last24HoursSubmissions ?? 0}
                format="number"
                suffix="submissions"
              />
              <MetricCard
                label="Week Growth"
                value={analytics?.weekOverWeekGrowth ?? 0}
                format="percentage"
                trend={(analytics?.weekOverWeekGrowth ?? 0) > 0 ? 'up' : 'down'}
              />
            </div>

            {/* Advanced Metrics Grid (Premium only) */}
            <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 relative transition-all duration-300 ${
              isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[200px] opacity-100'
            }`}>
              {/* Overlay for free users */}
              {!hasPremiumAccess && (
                <div className="absolute inset-0 backdrop-blur-sm bg-white/30 dark:bg-black/30 rounded-lg z-10 flex flex-col items-center justify-center">
                  <Lock className="h-5 w-5 text-slate-500 dark:text-zinc-400 mb-2" />
                  <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">Advanced Analytics</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 text-center max-w-[260px] mt-1">
                    Upgrade to Standard or Pro plan to unlock advanced metrics
                  </p>
                </div>
              )}
              
              <MetricCard
                label="Peak Hour"
                value={analytics?.peakSubmissionHour ?? 0}
                format="custom"
                customValue={getPeakHourLabel(analytics?.peakSubmissionHour ?? 0)}
                locked={!hasPremiumAccess}
              />
              <MetricCard
                label="Completion Rate"
                value={analytics?.completionRate ?? 0}
                format="percentage"
                locked={!hasPremiumAccess}
              />
              <MetricCard
                label="Avg Response Time"
                value={analytics?.averageResponseTime ?? 0}
                format="number"
                suffix="min"
                locked={!hasPremiumAccess}
              />
              <MetricCard
                label="Engagement Score"
                value={analytics?.engagementScore ?? 0}
                format="number"
                suffix="/10"
                locked={!hasPremiumAccess}
              />
            </div>
          </>
        )}

        {/* USER INSIGHTS TAB */}
        {activeTab === 'insights' && (
          <AdvancedAnalytics
            activeTab="insights"
            hasPremiumAccess={hasPremiumAccess}
            userInsights={[]}
            isCollapsed={isCollapsed}
            browserStats={analytics?.browserStats || []}
            locationStats={analytics?.locationStats || []}
          />
        )}
      </CardHeader>

      <CardContent className={`relative p-3 sm:p-4 md:p-6 overflow-hidden transition-all duration-300 ${
        isCollapsed || activeTab !== 'overview' ? 'max-h-0 opacity-0' : 'max-h-[400px] opacity-100'
      }`}>
        {!hasData && timeRange === 'day' ? (
          <div className="flex flex-col items-center justify-center h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]">
            <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium mb-2">No submissions in the last 24 hours</p>
            <p className="text-slate-400 dark:text-zinc-500 text-xs">Try changing the time range to see more data</p>
          </div>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    left: 8,
                    right: 16,
                    top: 8,
                    bottom: 8,
                  }}
                >
                  <CartesianGrid vertical={false} stroke="currentColor" className="text-slate-200 dark:text-zinc-800" />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={4}
                    minTickGap={5}
                    tick={{ 
                      fill: 'currentColor',
                      fontFamily: 'monospace', 
                      fontSize: 10,
                      className: 'text-slate-900 dark:text-white'
                    }}
                    tickFormatter={formatTimeLabel}
                  />
                  <YAxis 
                    hide={false}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ 
                      fill: 'currentColor',
                      fontFamily: 'monospace', 
                      fontSize: 10,
                      className: 'text-slate-500 dark:text-zinc-400'
                    }}
                  />
                  <Tooltip
                    content={
                      <ChartTooltipContent
                        className="w-[140px] sm:w-[160px] bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 border border-slate-200 dark:border-zinc-800 p-2 sm:p-3 rounded-lg shadow-lg text-xs sm:text-sm"
                        nameKey={activeMetric}
                        labelFormatter={(value) => {
                          if (timeRange === 'day') {
                            return formatTimeLabel(value);
                          }
                          return value;
                        }}
                      />
                    }
                  />
                  <Bar 
                    dataKey="submissions"
                    fill={`var(--color-${activeMetric})`}
                    radius={[4, 4, 0, 0]}
                    className="transition-all duration-200 hover:opacity-80 dark:fill-white"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            {timeRange !== 'day' && total.submissions === 0 && (
              <div className="flex items-center justify-center mt-2 gap-1 text-xs text-slate-500 dark:text-zinc-400">
                <Info className="h-3.5 w-3.5" />
                <span>No submission data for {timeRange} view. Submit more forms to see analytics.</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
} 