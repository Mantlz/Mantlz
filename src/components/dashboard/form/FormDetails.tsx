import React, { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { client } from '@/lib/client';
import { format, subDays, subHours, startOfDay, endOfDay } from 'date-fns';
import { FormHeader } from './FormHeader';
import { FormSettings } from './FormSettings';
import { FormResponsesList } from './FormResponsesList';
import { SdkDocs } from './SdkDocs';
import { FormAnalyticsChart } from './FormAnalyticsChart';
import { toast } from 'sonner';
import { 
  Users, 
  FileSpreadsheet, 
  Activity, 
  Zap,
  Settings,
  Code,
  MessageSquare,
  BarChart3,
  Clock,
  Mail,
  Share2,
  Eye,
  Download,
  Trash2,
  Copy,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

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
interface FormData {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  submissionCount: number;
  emailSettings: {
    id: string;
    formId: string;
    enabled: boolean;
    fromEmail: string | null;
    subject: string | null;
    template: string | null;
    replyTo: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

interface TimeSeriesPoint {
  time: string;
  submissions: number;
  uniqueEmails: number;
  fullDate?: string;
}

// Add this interface before the FormDetails function
interface FormAnalytics {
  totalSubmissions: number;
  dailySubmissionRate: number;
  weekOverWeekGrowth: number;
  last24HoursSubmissions: number;
  engagementScore: number;
  peakSubmissionHour: number;
  completionRate: number;
  averageResponseTime: number;
  timeSeriesData: TimeSeriesPoint[];
}

function FormDetails({ formId: propFormId }: FormDetailsProps = {}) {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  
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
    refetch: refetchForm
  } = useQuery<FormData>({
    queryKey: ["formDetails", formId],
    queryFn: async () => {
      try {
        if (!formId) {
          throw new Error('Form ID is required');
        }
        
        const response = await client.forms.getFormById.$get({
          id: formId
        });
        const data = await response.json();
        return {
          ...data,
          emailSettings: data.emailSettings || {
            id: '',
            formId: formId,
            enabled: false,
            fromEmail: process.env.RESEND_FROM_EMAIL,
            subject: null,
            template: null,
            replyTo: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        } as FormData;
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
    refetch: refetchSubmissions,
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
        const data = await response.json();

        // Add mock location data for demonstration
        const mockLocations = [
          { lat: 40.7128, lng: -74.0060, city: "New York", country: "USA" },
          { lat: 51.5074, lng: -0.1278, city: "London", country: "UK" },
          { lat: 48.8566, lng: 2.3522, city: "Paris", country: "France" },
          { lat: 35.6762, lng: 139.6503, city: "Tokyo", country: "Japan" },
          { lat: -33.8688, lng: 151.2093, city: "Sydney", country: "Australia" }
        ];

        return {
          submissions: data.submissions.map((sub: any, index: number) => ({
            ...sub,
            submittedAt: sub.createdAt,
            // Assign a random location from the mock data
            location: mockLocations[Math.floor(Math.random() * mockLocations.length)]
          }))
        };
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
    isLoading: isLoadingAnalytics,
    refetch: refetchAnalytics
  } = useQuery<FormAnalytics>({
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
          dailySubmissionRate: 0,
          weekOverWeekGrowth: 0,
          last24HoursSubmissions: 0,
          engagementScore: 0,
          peakSubmissionHour: 0,
          completionRate: 0,
          averageResponseTime: 0,
          timeSeriesData: []
        };
      }
    },
    enabled: !!formId,
  });

  // Define delete submission mutation using v5 syntax
  const deleteSubmissionMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      try {
        const response = await client.forms.deleteSubmission.$post({
          submissionId
        });
        return response;
      } catch (error) {
        // If it's a 404 error, the submission was already deleted
        if (error instanceof Error && error.message.includes("404")) {
          console.log("Submission already deleted or not found");
          return { success: true }; // Treat as success - it's already gone
        }
        throw error; // Rethrow other errors
      }
    },
    onMutate: async (submissionId: string) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["formSubmissions", formId] });
      await queryClient.cancelQueries({ queryKey: ["formDetails", formId] });
      await queryClient.cancelQueries({ queryKey: ["formAnalytics", formId, timeRange] });
      
      // Get current data from queries
      const previousSubmissions = queryClient.getQueryData(["formSubmissions", formId]);
      const previousForm = queryClient.getQueryData<FormData>(["formDetails", formId]);
      const previousAnalytics = queryClient.getQueryData<FormAnalytics>(["formAnalytics", formId, timeRange]);
      
      // Find the submission to delete (for updating analytics)
      const submissionToDelete = submissions?.submissions?.find(sub => sub.id === submissionId);
      
      // Optimistically update submissions list
      if (submissions) {
        queryClient.setQueryData(["formSubmissions", formId], {
          submissions: submissions.submissions.filter(sub => sub.id !== submissionId)
        });
      }
      
      // Optimistically update form details (submission count)
      if (previousForm) {
        queryClient.setQueryData(["formDetails", formId], {
          ...previousForm,
          submissionCount: Math.max(0, previousForm.submissionCount - 1)
        });
      }
      
      // Optimistically update analytics data
      if (previousAnalytics && submissionToDelete) {
        const submissionDate = new Date(submissionToDelete.createdAt);
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const updatedAnalytics: FormAnalytics = {
          ...previousAnalytics,
          totalSubmissions: Math.max(0, previousAnalytics.totalSubmissions - 1),
        };
        
        if (submissionDate >= oneDayAgo) {
          updatedAnalytics.last24HoursSubmissions = Math.max(0, (updatedAnalytics.last24HoursSubmissions || 0) - 1);
        }
        
        if (submissionDate >= oneWeekAgo) {
          updatedAnalytics.weekOverWeekGrowth = Math.max(0, (updatedAnalytics.weekOverWeekGrowth || 0) - 1);
        }
        
        if (submissionDate >= oneMonthAgo) {
          updatedAnalytics.dailySubmissionRate = Math.max(0, (updatedAnalytics.dailySubmissionRate || 0) - 1);
        }
        
        // Update time series data if it exists
        if (updatedAnalytics.timeSeriesData && updatedAnalytics.timeSeriesData.length > 0) {
          const timePoint = getTimePointFromDate(submissionDate, timeRange);
          
          updatedAnalytics.timeSeriesData = updatedAnalytics.timeSeriesData.map((point: TimeSeriesPoint) => {
            if (point.time === timePoint) {
              return {
                ...point,
                submissions: Math.max(0, point.submissions - 1)
              };
            }
            return point;
          });
        }
        
        queryClient.setQueryData(["formAnalytics", formId, timeRange], updatedAnalytics);
      }
      
      // Return previous data for rollback
      return { previousSubmissions, previousForm, previousAnalytics };
    },
    onError: (error, submissionId, context) => {
      // Check if it's a 404 error (submission already deleted)
      if (error instanceof Error && error.message.includes("404")) {
        console.log("Submission already deleted or not found, skipping rollback");
        // Show a less alarming toast
        toast.info("This submission has already been deleted");
        // We still need to ensure our UI is up to date
        queryClient.invalidateQueries({ queryKey: ["formSubmissions", formId] });
        return;
      }
      
      console.error("Error deleting submission:", error);
      if (context?.previousSubmissions) {
        queryClient.setQueryData(["formSubmissions", formId], context.previousSubmissions);
      }
      if (context?.previousForm) {
        queryClient.setQueryData(["formDetails", formId], context.previousForm);
      }
      if (context?.previousAnalytics) {
        queryClient.setQueryData(["formAnalytics", formId, timeRange], context.previousAnalytics);
      }
      
      // Show error toast
      toast.error("Failed to delete submission", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["formSubmissions", formId] });
      queryClient.invalidateQueries({ queryKey: ["formDetails", formId] });
      queryClient.invalidateQueries({ queryKey: ["formAnalytics", formId, timeRange] });
      
      toast.success("Submission deleted successfully");
    }
  });
  
  // Clean handler that uses the mutation
  const handleSubmissionDelete = useCallback((submissionId: string) => {
    deleteSubmissionMutation.mutate(submissionId);
  }, [deleteSubmissionMutation]);
  
  // Helper function to get the time point string from a date based on time range
  const getTimePointFromDate = (date: Date, range: 'day' | 'week' | 'month'): string => {
    if (range === 'day') {
      return format(date, 'HH:00');
    } else if (range === 'week') {
      return format(date, 'EEE');
    } else { // month
      return format(date, 'd');
    }
  };

  const handleTabClick = (tab: 'responses' | 'settings' | 'integration') => {
    setActiveTab(tab);
  };
  
  const handleTimeRangeChange = useCallback((range: 'day' | 'week' | 'month') => {
    setTimeRange(range);
  }, []);
  
  // Generate appropriate sample data if real data is missing
  const getFormattedChartData = useCallback(() => {
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
    return analytics.timeSeriesData.map((item: TimeSeriesPoint) => {
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
  }, [analytics, timeRange]);
  
  // Format chart data - memoize based on analytics
  const chartData = React.useMemo(() => getFormattedChartData(), [getFormattedChartData]);

  // Get the most recent data point for the tooltip
  const latestDataPoint: TimeSeriesPoint = React.useMemo(() => {
    if (analytics?.timeSeriesData && analytics.timeSeriesData.length > 0) {
      // We know this is safe because we've checked length > 0
      return analytics.timeSeriesData[analytics.timeSeriesData.length - 1] as TimeSeriesPoint;
    }
    return {
      time: "12:00", 
      submissions: 0, 
      uniqueEmails: 0
    };
  }, [analytics]);

  // Custom tooltip to show full date information
  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    // Get full date from payload if it exists (for week/month view)
    const fullDate = payload[0]?.payload?.fullDate;
    const displayLabel = (timeRange === 'week' || timeRange === 'month') && fullDate ? fullDate : label;
    
    return (
      <div className="bg-zinc-100 dark:bg-zinc-800 p-3 border border-slate-200 dark:border-zinc-500 rounded-md shadow-lg">
        <p className="font-mono text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
          {displayLabel}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center">
              <div
                className="w-3 h-3 mr-2"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs font-medium text-slate-900 dark:text-slate-50">
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
      <div className="flex items-center justify-center min-h-[400px] w-full bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-md">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-slate-200 dark:border-zinc-800 border-t-slate-500 dark:border-t-zinc-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-zinc-400 font-medium text-sm">Loading form data...</p>
        </div>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-red-200 dark:border-red-800/50 shadow-md p-6">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-14 h-14 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-mono font-bold text-red-600 dark:text-red-400">Error Loading Form</h2>
          <p className="text-slate-700 dark:text-zinc-300 mb-2 text-sm">{(error as Error)?.message || "An unknown error occurred"}</p>
          <button 
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-sm font-medium rounded-lg shadow-md transition-colors"
            onClick={() => refetchForm()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full max-w-[1400px] mx-auto p-2 sm:p-4 lg:p-6">
      {/* Form Header */}
      {form && (

          <FormHeader 
            id={formId as string} 
            name={form.name} 
            createdAt={form.createdAt} 
            responsesCount={form.submissionCount} 
            emailSettings={form.emailSettings ? {
              enabled: form.emailSettings.enabled,
              fromEmail: form.emailSettings.fromEmail || undefined,
              subject: form.emailSettings.subject || undefined,
              template: form.emailSettings.template || undefined,
              replyTo: form.emailSettings.replyTo || undefined
            } : undefined}
            onRefresh={() => refetchForm()}
          />

      )}

      {/* Chart section */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
        <FormAnalyticsChart 
          chartData={chartData}
          latestDataPoint={latestDataPoint}
          analytics={analytics}
          isLoading={isLoadingAnalytics}
          formCreatedAt={form?.createdAt}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />
      </div>

      {/* Tabs section */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col bg-zinc-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-md overflow-hidden">
        <nav className="flex flex-wrap sm:flex-nowrap border-b border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-800/50 p-1">
          {[
            { id: 'responses', label: 'Responses', icon: MessageSquare },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'integration', label: 'Integration', icon: Code }
          ].map(tab => (
            <button
              key={tab.id}
              className={clsx(
                "flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2",
                activeTab === tab.id 
                  ? "bg-zinc-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-50 shadow-sm" 
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-50 hover:bg-slate-100/50 dark:hover:bg-zinc-800"
              )}
              onClick={() => handleTabClick(tab.id as any)}
            >
              <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 sm:p-4 lg:p-6">
          {activeTab === 'responses' && (
            <FormResponsesList 
              isLoading={isLoadingSubmissions}
              isError={isSubmissionsError}
              submissions={submissions} 
              onRetry={() => refetchSubmissions()}
              onSubmissionDelete={handleSubmissionDelete}
            />
          )}
          {activeTab === 'settings' && (
            <FormSettings 
              formId={formId as string}
              name={form?.name || ''}
              description={form?.description ?? undefined}
              emailSettings={form?.emailSettings as any}
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