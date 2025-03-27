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
    <Card className="relative bg-zinc-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-md">
      {/* Retro grid background */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01] bg-zinc-100 dark:bg-zinc-900 pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                              linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
             backgroundSize: '20px 20px'
           }} />
      
      {/* Accent line */}
      <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-br from-slate-300 to-slate-600 dark:from-zinc-700 dark:to-zinc-900" />

      <CardHeader className="relative flex flex-col items-stretch space-y-0 border-b border-slate-200 dark:border-zinc-800 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-900 dark:text-zinc-50 font-mono text-lg tracking-wider flex items-center gap-2">
              <span className="relative">
                <span className="absolute -inset-1 blur-sm rounded-lg" />
                <span className="relative">FORM ANALYTICS</span>
              </span>
            </CardTitle>
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
          <CardDescription className="text-slate-600 dark:text-zinc-400 font-mono text-xs tracking-wide">{getTimeRangeLabel()}</CardDescription>
        </div>
        
        {/* Metric Selector */}
        <div className={`flex overflow-hidden transition-all duration-300 ${
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[200px] opacity-100'
        }`}>
          {["submissions", "uniqueEmails"].map((key) => {
            const metric = key as keyof typeof chartConfig
            return (
              <button
                key={metric}
                data-active={activeMetric === metric}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-slate-200 dark:border-zinc-800 px-6 py-4 text-left even:border-l data-[active=true]:bg-slate-100 dark:data-[active=true]:bg-zinc-800 data-[active=true]:text-slate-900 dark:data-[active=true]:text-zinc-50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-zinc-800"
                onClick={() => setActiveMetric(metric)}
              >
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono tracking-wide">
                  {chartConfig[metric].label}
                </span>
                <span className="text-lg font-mono font-bold leading-none sm:text-3xl text-slate-900 dark:text-zinc-50">
                  {total[metric].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>

        {/* Time Range Selector */}
        <div className={`flex border-t border-slate-200 dark:border-zinc-800 sm:border-l sm:border-t-0 overflow-hidden transition-all duration-300 ${
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[200px] opacity-100'
        }`}>
          {['day', 'week', 'month'].map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range as 'day' | 'week' | 'month')}
              data-active={timeRange === range}
              className="flex-1 px-4 py-4 text-sm font-mono text-slate-700 dark:text-zinc-300 data-[active=true]:bg-slate-100 dark:data-[active=true]:bg-zinc-800 data-[active=true]:text-slate-900 dark:data-[active=true]:text-zinc-50"
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className={`relative px-2 sm:p-6 overflow-hidden transition-all duration-300 ${
        isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[400px] opacity-100'
      }`}>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
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
                className: 'text-slate-500 dark:text-zinc-400'
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
                  className="w-[150px] bg-zinc-100 dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 border border-slate-200 dark:border-zinc-800 p-3 rounded-md shadow-lg"
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
              className="transition-all duration-200 hover:opacity-80"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 