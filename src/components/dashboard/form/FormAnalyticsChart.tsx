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
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface TimeSeriesPoint {
  time: string;
  submissions: number;
  uniqueEmails: number;
}

interface FormAnalyticsChartProps {
  chartData: TimeSeriesPoint[];
  latestDataPoint: TimeSeriesPoint;
  analytics?: {
    totalSubmissions?: number;
    uniqueSubmitters?: number;
    last24Hours?: number;
    lastWeek?: number;
    lastMonth?: number;
  };
  isLoading: boolean;
  formCreatedAt?: Date;
  timeRange: 'day' | 'week' | 'month';
  onTimeRangeChange: (range: 'day' | 'week' | 'month') => void;
}

const chartConfig = {
  submissions: {
    label: "Total Submissions",
    color: "hsl(var(--chart-1))",
  },
  uniqueEmails: {
    label: "Unique Submitters",
    color: "hsl(var(--chart-2))",
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
      uniqueEmails: chartData.reduce((acc, curr) => acc + curr.uniqueEmails, 0),
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

      <CardHeader className="relative space-y-4 border-b border-slate-200 dark:border-zinc-800 p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-slate-900 dark:text-zinc-50 font-mono text-lg sm:text-xl tracking-wider">
              Form Analytics
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-zinc-400 font-mono text-sm">
              {getTimeRangeLabel()}
            </CardDescription>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="group p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md transition-all duration-200"
            aria-label={isCollapsed ? 'Expand chart' : 'Collapse chart'}
          >
            <ChevronDown 
              className={`h-5 w-5 text-slate-500 dark:text-zinc-400 transition-transform duration-300 group-hover:text-slate-900 dark:group-hover:text-zinc-50 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className={`grid grid-cols-2 gap-4 sm:gap-6 transition-all duration-300 ${
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[200px] opacity-100'
        }`}>
          {["submissions", "uniqueEmails"].map((key) => {
            const metric = key as keyof typeof chartConfig
            return (
              <button
                key={metric}
                data-active={activeMetric === metric}
                onClick={() => setActiveMetric(metric)}
                className="group relative flex flex-col items-start p-4 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-200 hover:border-slate-300 dark:hover:border-zinc-700 data-[active=true]:border-slate-400 dark:data-[active=true]:border-zinc-600 data-[active=true]:bg-slate-50 dark:data-[active=true]:bg-zinc-800"
              >
                <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
                  {chartConfig[metric].label}
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-zinc-50">
                  {total[metric].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>

        {/* Time Range Selector */}
        <div className={`flex items-center gap-2 transition-all duration-300 ${
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[200px] opacity-100'
        }`}>
          {['day', 'week', 'month'].map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range as 'day' | 'week' | 'month')}
              data-active={timeRange === range}
              className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                text-slate-600 dark:text-white hover:text-slate-900 dark:hover:text-white
                data-[active=true]:bg-slate-900 dark:data-[active=true]:bg-white
                data-[active=true]:text-white dark:data-[active=true]:text-zinc-900"
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className={`relative p-4 sm:p-6 overflow-hidden transition-all duration-300 ${
        isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[400px] opacity-100'
      }`}>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px]  sm:h-[300px] lg:h-[350px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{
              left: 16,
              right: 16,
              top: 16,
              bottom: 16,
            }}
          >
            <CartesianGrid vertical={false} stroke="currentColor" className="text-slate-200 dark:text-zinc-800" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ 
                fill: 'currentColor',
                fontFamily: 'monospace', 
                fontSize: 12,
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
                  className="w-[160px] bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 border border-slate-200 dark:border-zinc-800 p-3 rounded-lg shadow-lg"
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
              radius={[6, 6, 0, 0]}
              className="transition-all duration-200 hover:opacity-80 dark:fill-white"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 