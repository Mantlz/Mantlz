import React, { useState } from 'react';
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

interface FormAnalyticsChartProps {
  chartData: Array<{
    time: string;
    submissions: number;
    uniqueEmails: number;
  }>;
  latestDataPoint: {
    time: string;
    submissions: number;
    uniqueEmails: number;
  };
  analytics?: {
    lastWeek?: number;
    lastMonth?: number;
    totalSubmissions?: number;
    uniqueSubmitters?: number;
  };
  isLoading: boolean;
  formCreatedAt?: Date;
}

export function FormAnalyticsChart({
  chartData,
  latestDataPoint,
  analytics,
  isLoading,
  formCreatedAt
}: FormAnalyticsChartProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isDarkMode = typeof window !== 'undefined' ? 
    document.documentElement.classList.contains('dark') : false;

  // Different color configs for light and dark mode
  const chartConfig = {
    submissions: { 
      color: isDarkMode ? "#ffffff" : "#000000" 
    },
    uniqueEmails: { 
      color: isDarkMode ? "#a1a1aa" : "#525252" 
    }
  };

  // Stroke and fill colors
  const submissionsStroke = isDarkMode ? "#ffffff" : "#000000";
  const submissionsFill = isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)";
  const emailsStroke = isDarkMode ? "#a1a1aa" : "#525252";
  const emailsFill = isDarkMode ? "rgba(161, 161, 170, 0.15)" : "rgba(82, 82, 82, 0.1)";

  // Grid and axis colors
  const gridColor = isDarkMode ? "#3f3f46" : "#e5e5e5";
  const axisColor = isDarkMode ? "#71717a" : "#a3a3a3";

  return (
    <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-md overflow-hidden">
      <CardHeader className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-lg font-mono font-bold text-gray-900 dark:text-white tracking-tight uppercase">SUBMISSION ACTIVITY</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 mt-1 text-xs tracking-wide">Hourly submission data over the last 24 hours</CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-300 flex items-center text-xs font-mono font-medium tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 mr-2 animate-pulse"></span>
            Live
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
              <div className="h-48 sm:h-64 lg:h-80 max-h-[340px] w-full bg-white dark:bg-zinc-900 rounded-lg">
                <ChartContainer config={chartConfig}>
                  <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
                    <RechartsPrimitive.AreaChart
                      data={chartData}
                      margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                    >
                      <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <RechartsPrimitive.XAxis 
                        dataKey="time" 
                        stroke={axisColor}
                        tick={{ fill: axisColor, fontFamily: 'monospace' }}
                        tickLine={{ stroke: gridColor }}
                      />
                      <RechartsPrimitive.YAxis 
                        stroke={axisColor}
                        tick={{ fill: axisColor, fontFamily: 'monospace' }}
                        tickLine={{ stroke: gridColor }}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                      />
                      <RechartsPrimitive.Area
                        type="monotone"
                        dataKey="submissions"
                        stroke={submissionsStroke}
                        fill={submissionsFill}
                        strokeWidth={2}
                      />
                      <RechartsPrimitive.Area
                        type="monotone"
                        dataKey="uniqueEmails"
                        stroke={emailsStroke}
                        fill={emailsFill}
                        strokeWidth={2}
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                    </RechartsPrimitive.AreaChart>
                  </RechartsPrimitive.ResponsiveContainer>
                </ChartContainer>
              </div>
            )}
          </CardContent>
          
          <div className="p-4 sm:p-6 lg:w-1/3 lg:border-l lg:border-gray-200 lg:dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
              <div className="bg-gray-50 dark:bg-zinc-800 px-4 py-4 rounded-lg border border-gray-100 dark:border-zinc-700 flex-1">
                <p className="text-gray-700 dark:text-gray-300 font-mono font-bold uppercase tracking-wide mb-4 text-xs">Activity Summary</p>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Submissions this hour</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white tabular-nums">
                      {latestDataPoint?.submissions?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Unique submitters</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white tabular-nums">
                      {latestDataPoint?.uniqueEmails?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Last 7 days</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white tabular-nums">
                      {analytics?.lastWeek?.toLocaleString() || "0"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-zinc-800 px-4 py-4 rounded-lg border border-gray-100 dark:border-zinc-700 flex-1">
                <p className="text-gray-700 dark:text-gray-300 font-mono font-bold uppercase tracking-wide mb-4 text-xs">Form Stats</p>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Average daily</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white tabular-nums">
                      {analytics?.lastMonth ? Math.round(analytics.lastMonth / 30) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Form age</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white tabular-nums">
                      {formCreatedAt ? formatAge(new Date(formCreatedAt)) : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Conversion rate</span>
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