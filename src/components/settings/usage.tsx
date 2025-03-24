"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { client } from "@/lib/client";

// Type definitions for our usage data
interface UsageData {
  plan: string;
  limit: number;
  usedQuota: number;
  remainingQuota: number;
  totalForms: number;
  usagePercentage: number;
  history: Array<{
    month: string;
    year: number;
    count: number;
  }>;
}

// Interface for the submissions and plan data
interface PlanUsageData {
  formsUsed: number;
  formsLimit: number;
  submissionsUsed: number;
  submissionsLimit: number;
  resetDate: string;
  plan: string;
}

// Create custom hooks for API calls
const useUsageData = () => {
  return useQuery<UsageData>({
    queryKey: ["userUsage"],
    queryFn: async () => {
      try {
        const response = await client.usage.getUserUsage.$get();
        const data = await response.json();
        console.log("Received usage data:", data); // For debugging
        return data;
      } catch (err) {
        console.error("Error fetching usage data:", err);
        throw err;
      }
    }
  });
};

// Hook for getting plan-specific usage data
const usePlanUsage = () => {
  return useQuery<PlanUsageData>({
    queryKey: ["planUsage"],
    queryFn: async () => {
      try {
        const response = await client.usage.getUsage.$get();
        const data = await response.json();
        console.log("Received plan usage data:", data);
        
        // Convert Date to string if needed
        return {
          ...data,
          resetDate: data.resetDate ? data.resetDate.toString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
      } catch (err) {
        console.error("Error fetching plan usage data:", err);
        throw err;
      }
    }
  });
};

// Create hook for fetching total submissions
const useTotalSubmissions = () => {
  return useQuery({
    queryKey: ["totalSubmissions"],
    queryFn: async () => {
      try {
        const response = await client.usage.getTotalSubmissions.$get();
        const data = await response.json();
        console.log("Received submissions data:", data);
        return data;
      } catch (err) {
        console.error("Error fetching submissions data:", err);
        throw err;
      }
    }
  });
};

type PlanBadgeProps = {
  plan: string;
};

const PlanBadge: React.FC<PlanBadgeProps> = ({ plan }) => {
  const badgeStyles = {
    FREE: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
    STANDARD: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    PRO: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  }[plan] || "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";

  return (
    <Badge className={cn("ml-2 font-medium", badgeStyles)}>
      {plan}
    </Badge>
  );
};

export default function UsageSettings() {
  // Fetch user usage data
  const { data, isLoading, error, refetch } = useUsageData();
  
  // Fetch plan-specific usage data
  const { 
    data: planData, 
    isLoading: isPlanLoading, 
    error: planError 
  } = usePlanUsage();
  
  // Fetch total submissions data
  const { data: submissionsData, isLoading: isLoadingSubmissions } = useTotalSubmissions();

  // Add refresh loading state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Format reset date
  const formattedResetDate = planData?.resetDate 
    ? new Date(planData.resetDate).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      })
    : 'Next month';

  // Validate that the data is properly formatted
  const isValidData = data && 
    typeof data.plan === 'string' &&
    typeof data.limit === 'number' &&
    typeof data.usedQuota === 'number' &&
    typeof data.remainingQuota === 'number' &&
    typeof data.totalForms === 'number' &&
    typeof data.usagePercentage === 'number' &&
    Array.isArray(data.history);

  // Handle refresh with loading state
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setTimeout(() => setIsRefreshing(false), 600); // Ensure minimum loading time for visual feedback
    }
  };

  if (isLoading || isPlanLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <Loader2 className="h-6 w-6 text-zinc-400 animate-spin" />
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Loading usage information...
        </p>
      </div>
    );
  }

  if ((error || !data || !isValidData) && (planError || !planData)) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <p className="mt-2 text-sm text-zinc-800 dark:text-zinc-200">
          Could not load your usage information.
        </p>
        <Button variant="outline" className="mt-3" onClick={handleRefresh}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="w-full space-y-4">
        <header className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                Usage Information
              </h2>
              <PlanBadge plan={planData?.plan || data?.plan || 'FREE'} />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 text-xs"
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Monitor your form creation limits and usage statistics
            {planData && <span className="ml-1">• Resets on {formattedResetDate}</span>}
          </p>
          
          {((planData?.formsUsed ?? 0) >= (planData?.formsLimit ?? Infinity) * 0.8) && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-amber-800 dark:bg-amber-900/30 dark:border-amber-800/30 dark:text-amber-400 text-xs flex items-center">
              <AlertCircle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <span>You're approaching your form limit. Consider upgrading your plan for more forms.</span>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Forms usage card */}
          {planData && (
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm min-h-[250px]">
              <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Forms
                  </CardTitle>
                  <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs">
                    {planData.formsUsed.toLocaleString()}/{planData.formsLimit.toLocaleString()} forms • {Math.min(Math.round((planData.formsUsed / planData.formsLimit) * 100), 100)}%
                  </CardDescription>
                </div>
                <div className={cn(
                  "px-1.5 py-0.5 rounded text-xs font-medium",
                  (planData.formsUsed / planData.formsLimit) > 0.9 
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                    : (planData.formsUsed / planData.formsLimit) > 0.7 
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                )}>
                  {(planData.formsUsed / planData.formsLimit) > 0.9 
                    ? "Critical" 
                    : (planData.formsUsed / planData.formsLimit) > 0.7 
                      ? "High"
                      : "Good"}
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-4 pt-0">
                <Progress 
                  value={Math.min((planData.formsUsed / planData.formsLimit) * 100, 100)} 
                  className={cn(
                    "h-1.5 bg-zinc-100 dark:bg-zinc-800",
                    (planData.formsUsed / planData.formsLimit) > 0.9 ? "bg-red-500 dark:bg-red-600" : 
                    (planData.formsUsed / planData.formsLimit) > 0.7 ? "bg-amber-500 dark:bg-amber-600" :
                    "bg-green-500 dark:bg-green-600"
                  )}
                />
                <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                  <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-md">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">Remaining</p>
                    <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                      {Math.max(0, planData.formsLimit - planData.formsUsed).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-md">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">Total</p>
                    <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                      {planData.formsLimit.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Submissions usage card */}
          {planData && (
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm min-h-[250px]">
              <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    Monthly Submissions
                  </CardTitle>
                  <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs">
                    {planData.submissionsUsed.toLocaleString()}/{planData.submissionsLimit.toLocaleString()} submissions • {Math.min(Math.round((planData.submissionsUsed / planData.submissionsLimit) * 100), 100)}%
                  </CardDescription>
                </div>
                <div className={cn(
                  "px-1.5 py-0.5 rounded text-xs font-medium",
                  (planData.submissionsUsed / planData.submissionsLimit) > 0.9 
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                    : (planData.submissionsUsed / planData.submissionsLimit) > 0.7 
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                )}>
                  {(planData.submissionsUsed / planData.submissionsLimit) > 0.9 
                    ? "Critical" 
                    : (planData.submissionsUsed / planData.submissionsLimit) > 0.7 
                      ? "High"
                      : "Good"}
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-3 pt-0">
                <Progress 
                  value={Math.min((planData.submissionsUsed / planData.submissionsLimit) * 100, 100)} 
                  className={cn(
                    "h-1.5 bg-zinc-100 dark:bg-zinc-800",
                    (planData.submissionsUsed / planData.submissionsLimit) > 0.9 ? "bg-red-500 dark:bg-red-600" : 
                    (planData.submissionsUsed / planData.submissionsLimit) > 0.7 ? "bg-amber-500 dark:bg-amber-600" :
                    "bg-green-500 dark:bg-green-600"
                  )}
                />
                <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                  <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-md">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">Remaining</p>
                    <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                      {Math.max(0, planData.submissionsLimit - planData.submissionsUsed).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-md">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">Total</p>
                    <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                      {planData.submissionsLimit.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* All-time submissions card */}
        {submissionsData && (
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm min-h-[120px]">
            <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  All-time Submissions
                </CardTitle>
                <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs">
                  Total submissions received across all forms
                </CardDescription>
              </div>
              <div className="text-xl font-bold text-zinc-900 dark:text-white">
                {submissionsData?.totalSubmissions.toLocaleString() || "0"}
              </div>
            </CardHeader>
          </Card>
        )}
        
       
        
        
       
      </div>
    </div>
  );
} 