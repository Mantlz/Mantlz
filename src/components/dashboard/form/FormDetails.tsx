import React, { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/client';
import { format } from 'date-fns';
import { FormHeader } from './FormHeader';
import { FormResponsesList } from './FormResponsesList';
import { FormAnalyticsChart } from './FormAnalyticsChart';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

interface FormDetailsProps {
  formId?: string;
}

interface FormData {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  submissionCount: number;
  emailSettings: {
    enabled: boolean;
    fromEmail?: string;
    subject?: string;
    template?: string;
    replyTo?: string;
  } | null;
}

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

interface TimeSeriesPoint {
  time: string;
  submissions: number;
  uniqueEmails: number;
  fullDate?: string;
}

interface NotificationLog {
  id: string;
  type: 'SUBMISSION_CONFIRMATION' | 'DEVELOPER_NOTIFICATION' | 'DIGEST';
  status: 'SENT' | 'FAILED' | 'SKIPPED';
  error: string | null;
  createdAt: string;
}

interface Submission {
  id: string;
  createdAt: Date;
  email: string | null;
  data: any;
  formId: string;
  form: {
    id: string;
    name: string;
  };
  notificationLogs: NotificationLog[];
  analytics: {
    browser: string;
    location: string;
  };
}

function FormDetails({ formId: propFormId }: FormDetailsProps = {}) {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  
  // Get formId from either props or params
  const paramId = params?.id || '';
  const formId = propFormId || (typeof paramId === 'string' ? paramId : Array.isArray(paramId) ? paramId[0] : '');
  
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
    enabled: !!formId
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
          <h2 className="text-lg font-bold text-red-600 dark:text-red-400">Error Loading Form</h2>
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
    <div className="space-y-6 sm:space-y-8">
      <FormHeader
        id={form.id}
        name={form.name}
        createdAt={form.createdAt}
        responsesCount={form.submissionCount}
        form={form}
        analytics={{
          last24HoursSubmissions: analytics?.last24HoursSubmissions || 0,
          completionRate: analytics?.completionRate || 0,
          averageResponseTime: analytics?.averageResponseTime || 0
        }}
        onRefresh={refetchForm}
        onDelete={async (id) => {
          await client.forms.delete.$post({ formId: id });
          router.push('/dashboard');
        }}
      />

      <FormAnalyticsChart
        chartData={analytics?.timeSeriesData || []}
        latestDataPoint={analytics?.timeSeriesData?.[analytics.timeSeriesData.length - 1] || { time: '', submissions: 0, uniqueEmails: 0 }}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        isLoading={isLoadingAnalytics}
        analytics={analytics}
      />

      <FormResponsesList
        submissions={{ submissions: submissions?.submissions || [] }}
        isLoading={isLoadingSubmissions}
        isError={isSubmissionsError}
        onRetry={refetchSubmissions}
        onSubmissionDelete={handleSubmissionDelete}
      />
    </div>
  );
}

export { FormDetails };