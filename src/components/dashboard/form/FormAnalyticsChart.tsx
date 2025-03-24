import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import * as RechartsPrimitive from "recharts";

// Define different data types for different time ranges
interface TimeSeriesPoint {
  time: string;
  submissions: number;
  uniqueEmails: number;
  [key: string]: any; // For flexibility with additional metrics
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

export function FormAnalyticsChart({
  chartData,
  latestDataPoint,
  analytics,
  isLoading,
  formCreatedAt,
  timeRange = 'day',
  onTimeRangeChange
}: FormAnalyticsChartProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);
  const chartRef = React.useRef<HTMLDivElement>(null);

  // Dynamically update chart dimensions based on container size
  useEffect(() => {
    if (chartRef.current) {
      const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
          setChartWidth(entry.contentRect.width);
          setChartHeight(entry.contentRect.height);
        }
      });
      
      observer.observe(chartRef.current);
      return () => observer.disconnect();
    }
  }, []);

  // Determine if we're in dark mode for chart colors
  const isDarkMode = typeof window !== 'undefined' ? 
    document.documentElement.classList.contains('dark') : false;

  // Updated colors with MUCH higher contrast for dark mode
  const chartConfig = {
    submissions: { 
      color: isDarkMode ? "#ffffff" : "#000000" 
    },
    uniqueEmails: { 
      color: isDarkMode ? "#f8fafc" : "#525252" // Much lighter for dark mode
    }
  };

  // Stroke and fill colors - significantly improved for dark mode
  const submissionsStroke = isDarkMode ? "#ffffff" : "#000000";
  const submissionsFill = isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)";
  const emailsStroke = isDarkMode ? "#f8fafc" : "#525252"; // Almost white in dark mode
  const emailsFill = isDarkMode ? "rgba(248, 250, 252, 0.15)" : "rgba(82, 82, 82, 0.1)";

  // Grid and axis colors - dramatically improved for dark mode
  const gridColor = isDarkMode ? "#64748b" : "#e5e5e5"; // Much more visible grid in dark mode
  const axisColor = isDarkMode ? "#f1f5f9" : "#a3a3a3"; // Almost white text in dark mode

  // Simplified formatter that shows appropriate labels based on timeRange
  const formatXAxis = (value: string) => {
    if (timeRange === 'day') {
      // For day, show simple hour format (e.g., 3PM)
      try {
        const hour = parseInt(value?.split(':')?.[0] ?? '0', 10);
        if (isNaN(hour)) return value;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}${ampm}`;
      } catch (e) {
        return value;
      }
    } 
    // For week and month, we'll just use the label as-is (days will be formatted in the data)
    return value;
  };

  // Get the appropriate time range label
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'day': return 'Last 24 hours';
      case 'week': return 'Last 7 days';
      case 'month': return 'Last 30 days';
      default: return 'Submission data';
    }
  };

  // Get stats based on time range
  const getRecentStats = () => {
    switch (timeRange) {
      case 'day': return {
        label: 'Today',
        value: analytics?.last24Hours || 0
      };
      case 'week': return {
        label: 'This week',
        value: analytics?.lastWeek || 0
      };
      case 'month': return {
        label: 'This month',
        value: analytics?.lastMonth || 0
      };
      default: return {
        label: 'Recent',
        value: 0
      };
    }
  };

  // Calculate average per period
  const getAverageStats = () => {
    switch (timeRange) {
      case 'day': return {
        label: 'Hourly avg',
        value: analytics?.last24Hours 
          ? Math.round(analytics.last24Hours / 24) 
          : 0
      };
      case 'week': return {
        label: 'Daily avg',
        value: analytics?.lastWeek 
          ? Math.round(analytics.lastWeek / 7) 
          : 0
      };
      case 'month': return {
        label: 'Daily avg',
        value: analytics?.lastMonth 
          ? Math.round(analytics.lastMonth / 30) 
          : 0
      };
      default: return {
        label: 'Average',
        value: 0
      };
    }
  };

  const recentStats = getRecentStats();
  const averageStats = getAverageStats();

  return (
    <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-md overflow-hidden">
      <CardHeader className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-lg font-mono font-bold text-gray-900 dark:text-white tracking-tight uppercase">SUBMISSION ACTIVITY</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 mt-1 text-xs tracking-wide">
            {getTimeRangeLabel()}
          </CardDescription>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-1 flex">
            {[
              { value: 'day', label: 'Day' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' }
            ].map(range => (
              <button
                key={range.value}
                onClick={() => onTimeRangeChange(range.value as 'day' | 'week' | 'month')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  timeRange === range.value
                    ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 transition-colors"
            aria-label={isExpanded ? "Collapse chart" : "Expand chart"}
          >
            {isExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            )}
          </button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <div className="flex flex-col lg:flex-row">
          <CardContent className="p-4 sm:p-6 lg:w-2/3">
            {isLoading ? (
              <div className="h-48 sm:h-64 lg:h-80 max-h-[340px] bg-gray-50 dark:bg-zinc-800/50 rounded-lg flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-gray-200 dark:border-zinc-700 border-t-gray-500 dark:border-t-gray-300 rounded-full animate-spin mb-3"></div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-mono tracking-wide uppercase">Loading data...</p>
                </div>
              </div>
            ) : (
              <div ref={chartRef} className="h-48 sm:h-64 lg:h-80 max-h-[340px] w-full bg-white dark:bg-zinc-900 rounded-lg">
                <ChartContainer config={chartConfig}>
                  <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
                    <RechartsPrimitive.AreaChart
                      data={chartData}
                      margin={timeRange === 'week' 
                        ? { top: 20, right: 30, left: 10, bottom: 30 }
                        : timeRange === 'month'
                        ? { top: 20, right: 30, left: 10, bottom: 25 }
                        : { top: 20, right: 20, left: 0, bottom: 0 }
                      }
                    >
                      <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <RechartsPrimitive.XAxis 
                        dataKey="time" 
                        stroke={axisColor}
                        tick={{ 
                          fill: axisColor, 
                          fontFamily: 'monospace',
                          fontSize: 12,
                        }}
                        tickLine={{ stroke: gridColor }}
                        tickFormatter={formatXAxis}
                        interval={timeRange === 'week' ? 0 : 'preserveStart'}
                        angle={timeRange === 'month' ? -30 : 0}
                        textAnchor={timeRange === 'month' ? 'end' : 'middle'}
                        height={timeRange === 'week' || timeRange === 'month' ? 50 : 30}
                        minTickGap={timeRange === 'week' ? 30 : 10}
                        padding={{ left: 15, right: 15 }}
                      />
                      <RechartsPrimitive.YAxis 
                        stroke={axisColor}
                        tick={{ 
                          fill: axisColor, 
                          fontFamily: 'monospace',
                          fontSize: 12 
                        }}
                        tickLine={{ stroke: gridColor }}
                        allowDecimals={false}
                        width={45}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        wrapperStyle={{ 
                          color: isDarkMode ? '#f1f5f9' : 'inherit' 
                        }}
                      />
                      <RechartsPrimitive.Area
                        type="monotone"
                        dataKey="submissions"
                        name="Submissions"
                        stroke={submissionsStroke}
                        fill={submissionsFill}
                        strokeWidth={2}
                      />
                      <RechartsPrimitive.Area
                        type="monotone"
                        dataKey="uniqueEmails"
                        name="Unique Submitters"
                        stroke={emailsStroke}
                        fill={emailsFill}
                        strokeWidth={2}
                      />
                      <ChartLegend 
                        content={<ChartLegendContent />}
                      />
                    </RechartsPrimitive.AreaChart>
                  </RechartsPrimitive.ResponsiveContainer>
                </ChartContainer>
              </div>
            )}
          </CardContent>
          
          <div className="p-4 sm:p-6 lg:w-1/3 lg:border-l lg:border-gray-200 lg:dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
              <div className="bg-gray-50 dark:bg-zinc-800 px-4 py-4 rounded-lg border border-gray-100 dark:border-zinc-700 flex-1">
                <p className="text-gray-700 dark:text-gray-100 font-mono font-bold uppercase tracking-wide mb-4 text-xs">Activity Summary</p>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      {timeRange === 'day' 
                        ? 'Current hour' 
                        : timeRange === 'week' 
                          ? 'Today' 
                          : 'Current day'}
                    </span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white tabular-nums">
                      {latestDataPoint?.submissions?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Unique submitters</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white tabular-nums">
                      {latestDataPoint?.uniqueEmails?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{recentStats.label}</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white tabular-nums">
                      {recentStats.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-zinc-800 px-4 py-4 rounded-lg border border-gray-100 dark:border-zinc-700 flex-1">
                <p className="text-gray-700 dark:text-zinc-100 font-mono font-bold uppercase tracking-wide mb-4 text-xs">Form Stats</p>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{averageStats.label}</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white tabular-nums">
                      {averageStats.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Form age</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white tabular-nums">
                      {formCreatedAt ? formatAge(new Date(formCreatedAt)) : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Conversion rate</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white tabular-nums">
                      {analytics?.totalSubmissions && analytics?.uniqueSubmitters 
                        ? `${Math.round((analytics.uniqueSubmitters / analytics.totalSubmissions) * 100)}%` 
                        : "0%"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

// Helper function to format form age
function formatAge(date: Date): string {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 1) return "Today";
  if (diffInDays === 1) return "1 day";
  if (diffInDays < 30) return `${diffInDays} days`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths === 1) return "1 month";
  if (diffInMonths < 12) return `${diffInMonths} months`;
  
  const diffInYears = Math.floor(diffInMonths / 12);
  if (diffInYears === 1) return "1 year";
  return `${diffInYears} years`;
} 