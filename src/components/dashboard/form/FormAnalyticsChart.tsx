"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChevronDown } from "lucide-react"
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

interface TimeSeriesPoint {
  time: string;
  submissions: number;
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
  chartData,
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

  const total = React.useMemo(
    () => ({
      submissions: chartData.reduce((acc, curr) => acc + curr.submissions, 0),
    }),
    [chartData]
  )

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

  return (
    <Card className="relative bg-zinc-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-md w-full">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-zinc-900/50 dark:to-zinc-800/50 pointer-events-none" />
      
      {/* Accent line */}
      <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-500" />

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

        {/* Metrics Grid */}
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

        {/* Additional Metrics Grid */}
        <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 transition-all duration-300 ${
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[200px] opacity-100'
        }`}>
          <MetricCard
            label="Peak Hour"
            value={analytics?.peakSubmissionHour ?? 0}
            format="number"
            suffix={getPeakHourLabel(analytics?.peakSubmissionHour ?? 0)}
          />
          <MetricCard
            label="Completion Rate"
            value={analytics?.completionRate ?? 0}
            format="percentage"
          />
          <MetricCard
            label="Avg Response Time"
            value={analytics?.averageResponseTime ?? 0}
            format="number"
            suffix="min"
          />
          <MetricCard
            label="Engagement Score"
            value={analytics?.engagementScore ?? 0}
            format="number"
            suffix="/10"
          />
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
      </CardHeader>

      <CardContent className={`relative p-3 sm:p-4 md:p-6 overflow-hidden transition-all duration-300 ${
        isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[400px] opacity-100'
      }`}>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{
              left: 8,
              right: 8,
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
              minTickGap={24}
              tick={{ 
                fill: 'currentColor',
                fontFamily: 'monospace', 
                fontSize: 10,
                className: 'text-slate-900 dark:text-white'
              }}
              tickFormatter={(value) => {
                if (timeRange === 'day') {
                  const hour = parseInt(value?.split(':')?.[0] ?? '0', 10);
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  const hour12 = hour % 12 || 12;
                  return `${hour12}${ampm}`;
                }
                return value;
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[140px] sm:w-[160px] bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 border border-slate-200 dark:border-zinc-800 p-2 sm:p-3 rounded-lg shadow-lg text-xs sm:text-sm"
                  nameKey={activeMetric}
                  labelFormatter={(value) => {
                    if (timeRange === 'day') {
                      return value;
                    }
                    return value;
                  }}
                />
              }
            />
            <Bar 
              dataKey={activeMetric}
              fill={`var(--color-${activeMetric})`}
              radius={[4, 4, 0, 0]}
              className="transition-all duration-200 hover:opacity-80 dark:fill-white"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 