import React, { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { client } from '@/lib/client';
import { format, subDays, subHours, startOfDay, endOfDay } from 'date-fns';
import { FormHeader } from './FormHeader';
import { FormSettings } from './FormSettings';
import { FormResponsesList } from './FormResponsesList';
import { SdkDocs } from './SdkDocs';
import { FormAnalyticsChart } from './FormAnalyticsChart';

// Import existing UI components
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent
} from '@/components/ui/card';

// Accept formId as a prop
interface FormDetailsProps {
  formId?: string;
}

// Add this interface before the getFormattedChartData function
interface TimeSeriesDataItem {
  time: string;
  submissions: number;
  uniqueEmails: number;
  fullDate?: string;
}

function FormDetails({ formId: propFormId }: FormDetailsProps = {}) {
  const router = useRouter();
  const params = useParams();
  
  // Get formId from either props or params
  const paramId = params?.id || '';
  const formId = propFormId || (typeof paramId === 'string' ? paramId : Array.isArray(paramId) ? paramId[0] : '');
  
  const [activeTab, setActiveTab] = useState<'responses' | 'settings' | 'integration'>('responses');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');

  // Fetch form details
  const { 
    data: form, 
    isLoading, 
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["formDetails", formId],
    queryFn: async () => {
      try {
        if (!formId) {
          throw new Error('Form ID is required');
        }
        
        const response = await client.forms.getFormById.$get({
          id: formId
        });
        return response.json();
      } catch (err) {
        console.error("Error fetching form details:", err);
        throw err;
      }
    },
    enabled: !!formId,
  });

  // Fetch form submissions
  const { 
    data: submissions, 
    isLoading: isLoadingSubmissions, 
    isError: isSubmissionsError,
    refetch: refetchSubmissions
  } = useQuery({
    queryKey: ["formSubmissions", formId],
    queryFn: async () => {
      try {
        if (!formId) {
          throw new Error('Form ID is required for submissions');
        }
        
        const response = await client.forms.getFormSubmissions.$get({
          formId: formId
        });
        return response.json();
      } catch (err) {
        console.error("Error fetching form submissions:", err);
        throw err;
      }
    },
    enabled: !!formId && activeTab === "responses"
  });

  // Fetch form analytics data with time range
  const { 
    data: analytics, 
    isLoading: isLoadingAnalytics
  } = useQuery({
    queryKey: ["formAnalytics", formId, timeRange],
    queryFn: async () => {
      try {
        if (!formId) {
          throw new Error('Form ID is required for analytics');
        }
        
        // Type assertion to work around missing type until next build
        const formsClient = client.forms as any;
        const response = await formsClient.getFormAnalytics.$get({
          formId: formId,
          timeRange: timeRange
        });
        return response.json();
      } catch (err) {
        console.error("Error fetching form analytics:", err);
        // Return default data structure to avoid breaking the UI
        return {
          totalSubmissions: 0,
          uniqueSubmitters: 0,
          last24Hours: 0,
          lastWeek: 0,
          lastMonth: 0,
          timeSeriesData: []
        };
      }
    },
    enabled: !!formId,
  });

  const handleTabClick = (tab: 'responses' | 'settings' | 'integration') => {
    setActiveTab(tab);
  };
  
  const handleTimeRangeChange = useCallback((range: 'day' | 'week' | 'month') => {
    setTimeRange(range);
  }, []);
  
  // Generate appropriate sample data if real data is missing
  const getFormattedChartData = () => {
    if (!analytics?.timeSeriesData || analytics.timeSeriesData.length === 0) {
      // Generate placeholder data based on the selected time range
      if (timeRange === 'day') {
        return Array.from({ length: 24 }, (_, i) => {
          const hour = i.toString().padStart(2, '0');
          return {
            time: `${hour}:00`,
            submissions: 0,
            uniqueEmails: 0
          };
        });
      } else if (timeRange === 'week') {
        // For week view, use day names only - much clearer spacing
        return Array.from({ length: 7 }, (_, i) => {
          const date = subDays(startOfDay(new Date()), 6 - i);
          return {
            // Just show the day name (Mon, Tue, etc.)
            time: format(date, 'EEE'), // Three-letter day name
            // Include the full date for tooltip
            fullDate: format(date, 'MMM d'),
            submissions: 0,
            uniqueEmails: 0
          };
        });
      } else { // month
        return Array.from({ length: 30 }, (_, i) => {
          const date = subDays(startOfDay(new Date()), 29 - i);
          return {
            // For month view, just show day of month to save space
            time: format(date, 'd'),
            // Include month info for tooltip
            fullDate: format(date, 'MMM d'),
            submissions: 0,
            uniqueEmails: 0
          };
        });
      }
    }
    
    // If we have real data, format it appropriately based on timeRange
    return analytics.timeSeriesData.map((item: TimeSeriesDataItem) => {
      if (timeRange === 'week') {
        // Try to parse the date and format it as day name
        try {
          const date = new Date(item.time);
          return {
            ...item,
            time: format(date, 'EEE'),
            fullDate: format(date, 'MMM d')
          };
        } catch (e) {
          return item;
        }
      } else if (timeRange === 'month') {
        // Try to parse the date and format it as day of month
        try {
          const date = new Date(item.time);
          return {
            ...item,
            time: format(date, 'd'),
            fullDate: format(date, 'MMM d')
          };
        } catch (e) {
          return item;
        }
      }
      return item;
    });
  };
  
  // Format chart data
  const chartData = getFormattedChartData();

  // Get the most recent data point for the tooltip
  const latestDataPoint = analytics?.timeSeriesData?.length 
    ? analytics.timeSeriesData[analytics.timeSeriesData.length - 1]
    : {
        time: "12:00", 
        submissions: 0, 
        uniqueEmails: 0
      };

  // Custom tooltip to show full date information
  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    // Get full date from payload if it exists (for week/month view)
    const fullDate = payload[0]?.payload?.fullDate;
    const displayLabel = (timeRange === 'week' || timeRange === 'month') && fullDate ? fullDate : label;
    
    return (
      <div className="bg-white dark:bg-zinc-800 p-3 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg">
        <p className="font-mono text-xs font-medium text-gray-600 dark:text-gray-100 mb-2">
          {displayLabel}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center">
              <div
                className="w-3 h-3 mr-2"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-gray-200 dark:border-zinc-700 border-t-gray-500 dark:border-t-gray-300 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">Loading form data...</p>
        </div>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center bg-white dark:bg-zinc-900 rounded-xl border border-red-200 dark:border-red-800 shadow-sm p-6">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-14 h-14 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-mono font-bold text-red-600 dark:text-red-400">Error Loading Form</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2 text-sm">{(error as Error)?.message || "An unknown error occurred"}</p>
          <button 
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
            onClick={() => refetch()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto p-4 sm:p-6">
      {/* Form Header */}
      {form && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 sm:p-6 shadow-sm">
          <FormHeader 
            id={formId as string} 
            name={form.name} 
            createdAt={form.createdAt} 
            responsesCount={submissions?.submissions?.length || 0} 
          />
        </div>
      )}

      {/* Dashboard stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="p-4 bg-gradient-to-r from-zinc-100 to-white dark:from-zinc-900 dark:to-zinc-800 border-b border-gray-100 dark:border-zinc-800">
            <CardTitle className="text-zinc-800 dark:text-white text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {isLoadingAnalytics ? (
              <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            ) : (
              <div className="flex items-baseline">
                <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white tabular-nums">{analytics?.totalSubmissions?.toLocaleString() || "0"}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">responses</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="p-4 bg-gradient-to-r from-zinc-100 to-white dark:from-zinc-900 dark:to-zinc-800 border-b border-gray-100 dark:border-zinc-800">
            <CardTitle className="text-zinc-800 dark:text-white text-sm font-medium">Unique Submitters</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {isLoadingAnalytics ? (
              <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            ) : (
              <div className="flex items-baseline">
                <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white tabular-nums">{analytics?.uniqueSubmitters?.toLocaleString() || "0"}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">users</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="p-4 bg-gradient-to-r from-zinc-100 to-white dark:from-zinc-900 dark:to-zinc-800 border-b border-gray-100 dark:border-zinc-800">
            <CardTitle className="text-zinc-800 dark:text-white text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {isLoadingAnalytics ? (
              <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            ) : (
              <div className="flex items-baseline">
                <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white tabular-nums">{analytics?.last24Hours?.toLocaleString() || "0"}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">in 24h</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chart section with time range control */}
      <FormAnalyticsChart 
        chartData={chartData}
        latestDataPoint={latestDataPoint}
        analytics={analytics}
        isLoading={isLoadingAnalytics}
        formCreatedAt={form?.createdAt}
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
      />

      {/* Tabs section */}
      <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <nav className="flex border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 p-1">
          {[
            { id: 'responses', label: 'Responses' },
            { id: 'settings', label: 'Settings' },
            { id: 'integration', label: 'Integration' }
          ].map(tab => (
            <button
              key={tab.id}
              className={clsx(
                "px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 shadow-sm" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-zinc-800"
              )}
              onClick={() => handleTabClick(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 sm:p-6">
          {activeTab === 'responses' && (
            <FormResponsesList 
              isLoading={isLoadingSubmissions}
              isError={isSubmissionsError}
              submissions={submissions} 
              onRetry={() => refetchSubmissions()}
            />
          )}
          {activeTab === 'settings' && (
            <FormSettings 
              name={form.name}
              description={form.description ?? undefined}
              onUpdate={(data) => console.log('Update form:', data)}
            />
          )}
          {activeTab === 'integration' && (
            <SdkDocs 
              formId={formId as string}
              formType="Form"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export { FormDetails };