import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { client } from '@/lib/client';

import { FormHeader } from '../../../app/dashboard/test/FormHeader';
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

function FormDetails({ formId: propFormId }: FormDetailsProps = {}) {
  const router = useRouter();
  const params = useParams();
  
  // Get formId from either props or params
  const paramId = params?.id || '';
  const formId = propFormId || (typeof paramId === 'string' ? paramId : Array.isArray(paramId) ? paramId[0] : '');
  
  const [activeTab, setActiveTab] = useState<'responses' | 'settings' | 'integration'>('responses');

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

  // Fetch form analytics data
  const { 
    data: analytics, 
    isLoading: isLoadingAnalytics
  } = useQuery({
    queryKey: ["formAnalytics", formId],
    queryFn: async () => {
      try {
        if (!formId) {
          throw new Error('Form ID is required for analytics');
        }
        
        // Type assertion to work around missing type until next build
        const formsClient = client.forms as any;
        const response = await formsClient.getFormAnalytics.$get({
          formId: formId
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
  
  // Format time series data for the chart, ensuring we have data points
  const chartData = analytics?.timeSeriesData || 
    Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      submissions: 0,
      uniqueEmails: 0
    }));

  // Get the most recent data point for the tooltip
  const latestDataPoint = analytics?.timeSeriesData?.length 
    ? analytics.timeSeriesData[analytics.timeSeriesData.length - 1]
    : {
        time: "12:00", 
        submissions: 0, 
        uniqueEmails: 0
      };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-zinc-700 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading form data...</p>
        </div>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center bg-white dark:bg-zinc-900 rounded-xl border border-red-200 dark:border-red-800 shadow-sm p-6">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-16 h-16 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
          <h2 className="text-xl font-mono font-bold text-red-600 dark:text-red-400">Error Loading Form</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">{(error as Error)?.message || "An unknown error occurred"}</p>
        <button 
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium rounded-lg shadow-sm transition-colors"
          onClick={() => refetch()}
        >
          Try Again
        </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto p-4 sm:p-6">
      {/* Form Header */}
      {form && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
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
          <CardHeader className="p-5 bg-gradient-to-r from-zinc-200 to-white dark:from-zinc-950 dark:to-zinc-800 border-b border-gray-100 dark:border-zinc-800">
            <CardTitle className="text-zinc-800 dark:text-white text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {isLoadingAnalytics ? (
              <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            ) : (
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{analytics?.totalSubmissions?.toLocaleString() || "0"}</span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">responses</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="p-5 bg-gradient-to-r from-zinc-200 to-white dark:from-zinc-950 dark:to-zinc-800 border-b border-gray-100 dark:border-zinc-800">
            <CardTitle className="text-zinc-800 dark:text-white text-sm font-medium">Unique Submitters</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {isLoadingAnalytics ? (
              <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            ) : (
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{analytics?.uniqueSubmitters?.toLocaleString() || "0"}</span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">users</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="p-5 bg-gradient-to-r from-zinc-200 to-white dark:from-zinc-950 dark:to-zinc-800 border-b border-gray-100 dark:border-zinc-800">
            <CardTitle className="text-zinc-800 dark:text-white text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {isLoadingAnalytics ? (
              <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            ) : (
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{analytics?.last24Hours?.toLocaleString() || "0"}</span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">in 24h</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chart section */}
      <FormAnalyticsChart 
        chartData={chartData}
        latestDataPoint={latestDataPoint}
        analytics={analytics}
        isLoading={isLoadingAnalytics}
        formCreatedAt={form?.createdAt}
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
                "px-6 py-3 text-base font-medium rounded-lg transition-all duration-200",
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

        <div className="p-6">
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
              description={form.description}
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