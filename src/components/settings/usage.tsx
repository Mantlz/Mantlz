"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { client } from "@/lib/client";
import { useSubscription } from "@/hooks/useSubscription";
import { useLoading } from "@/contexts/LoadingContext";

// Type definitions for our usage data

// Interface for the submissions and plan data
interface PlanUsageData {
  usage: {
    forms: {
      used: number;
      limit: number;
      percentage: number;
    };
    submissions: {
      used: number;
      limit: number;
      percentage: number;
    };
    campaigns: {
      used: number;
      limit: number;
      percentage: number;
    };
  };
  features: {
    campaigns: boolean;
  };
  resetDate: Date;
  plan: string;
}


// Hook for getting plan-specific usage data
const usePlanUsage = () => {
  return useQuery<PlanUsageData>({
    queryKey: ["planUsage"],
    queryFn: async () => {
      try {
        const response = await client.usage.getUsage.$get();
        const data = await response.json();
        return {
          ...data,
          resetDate: new Date(data.resetDate)
        };
      } catch (err) {
        console.error("Error fetching plan usage data:", err);
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
    FREE: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-500",
    STANDARD: "bg-zinc-100 text-blue-800 dark:bg-zinc-900 dark:text-blue-200",
    PRO: "bg-orange-100 text-orange-800 dark:bg-amber-700 dark:text-orange-200",
  }[plan] || "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-500";

  return (
    <Badge className={cn("ml-2 font-medium", badgeStyles)}>
      {plan}
    </Badge>
  );
};

export default function UsageSettings() {
  // Fetch plan-specific usage data
  const { 
    data: planData, 
    isLoading: isPlanLoading, 
    error: planError,
    refetch: refetchPlan
  } = usePlanUsage();
  
  // Use the subscription hook to get the user's plan
  const { userPlan, isLoading: isSubscriptionLoading } = useSubscription();
  
  // Add refresh loading state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use the global loading context
  const { setIsLoading, setLoadingMessage, renderSkeleton } = useLoading();

  // Set global loading state
  useEffect(() => {
    const loading = isPlanLoading || isSubscriptionLoading;
    if (loading) {
      setLoadingMessage('Loading usage information...');
    }
    setIsLoading(loading);
  }, [isPlanLoading, isSubscriptionLoading, setIsLoading, setLoadingMessage]);

  // Format reset date
  const formattedResetDate = planData?.resetDate 
    ? new Date(planData.resetDate).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      })
    : 'Next month';

  // Validate that the data is properly formatted
  // const isValidData = data && 
  //   typeof data.plan === 'string' &&
  //   typeof data.currentUsage === 'object' &&
  //   typeof data.limits === 'object';

  // Handle refresh with loading state
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchPlan();
    } finally {
      setTimeout(() => setIsRefreshing(false), 600); // Ensure minimum loading time for visual feedback
    }
  };

  // Debug logging to help identify issues
  // useEffect(() => {
  //   console.log('=== USAGE COMPONENT DEBUG ===');
  //   console.log('isLoading:', isLoading);
  //   console.log('isPlanLoading:', isPlanLoading);
  //   console.log('isSubscriptionLoading:', isSubscriptionLoading);
  //   console.log('error:', error);
  //   console.log('planError:', planError);
  //   console.log('data (getUserUsage):', data);
  //   console.log('planData (getUsage):', planData);
  //   console.log('userPlan from subscription:', userPlan);
  //   console.log('isValidData:', isValidData);
  //   console.log('==============================');
  // }, [isLoading, isPlanLoading, isSubscriptionLoading, error, planError, data, planData, userPlan, isValidData]);

  // Create a renderContent function to handle conditional rendering
  const renderContent = () => {
    // Create a common header component that's always visible
    const headerContent = (
      <header className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              Usage Overview
            </h2>
            <PlanBadge plan={userPlan || planData?.plan || 'FREE'} />
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
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Monitor your form creation limits and usage statistics
          {planData && <span className="ml-1">• Resets on {formattedResetDate}</span>}
        </p>
        
        {(planData?.usage.forms.percentage ?? 0) >= 80 && (
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 dark:bg-amber-900/30 dark:border-amber-800/30 dark:text-amber-400 text-xs flex items-center">
            <AlertCircle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span>You&apos;re approaching your form limit. Consider upgrading your plan for more forms.</span>
          </div>
        )}
      </header>
    );

    // If loading, show skeleton with header
    if (isPlanLoading || isSubscriptionLoading) {
      console.log('🔄 Rendering loading state');
      return (
        <div className="w-full mx-auto">
          <ScrollArea className="h-[550px] w-full">
            <div className="w-full space-y-4 pr-4">
              {headerContent}
              {renderSkeleton('custom', 3)}
            </div>
          </ScrollArea>
        </div>
      );
    }

    // If error, show error message with header
    if (planError || !planData) {
      console.log('❌ Rendering error state - planError:', planError, 'planData:', planData);
      return (
        <div className="w-full mx-auto">
          <ScrollArea className="h-[550px] w-full">
            <div className="w-full space-y-4 pr-4">
              {headerContent}
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <p className="mt-2 text-sm text-zinc-800 dark:text-zinc-500">
                  Could not load your usage information.
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {planError ? `Error: ${planError.message}` : 'No usage data available'}
                </p>
                <Button variant="outline" className="mt-3" onClick={handleRefresh}>
                  Try Again
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      );
    }

    // Otherwise, show the actual content with header
    // console.log('✅ Rendering usage cards with planData:', planData);
    return (
      <div className="w-full mx-auto">
        <ScrollArea className="h-[550px] w-full">
          <div className="w-full space-y-4 pr-4">
            {headerContent}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Forms usage card */}
              {planData && (
                <Card className="border-zinc-200 dark:border-zinc-800  shadow-none">
                
                  <CardHeader className="pb-2 space-y-0">
                    <CardTitle className="text-sm flex items-center text-zinc-900 dark:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Forms
                    </CardTitle>
                    <div className="flex items-center justify-between">
                      <CardDescription className="text-zinc-500 dark:text-zinc-400 text-xs">
                        {planData.usage.forms.used.toLocaleString()}/{planData.usage.forms.limit.toLocaleString()} forms
                      </CardDescription>
                      <div className={cn(
                        "px-1.5 py-0.5 rounded text-xs font-medium",
                        planData.usage.forms.percentage > 90
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                          : planData.usage.forms.percentage > 70
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      )}>
                        {planData.usage.forms.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <Progress 
                      value={planData.usage.forms.percentage} 
                      className={cn(
                        "h-1.5 mb-3",
                        planData.usage.forms.percentage > 90 ? "bg-red-500 dark:bg-red-600" : 
                        planData.usage.forms.percentage > 70 ? "bg-amber-500 dark:bg-amber-600" :
                        "bg-green-500 dark:bg-green-600"
                      )}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-center">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Remaining</p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                          {Math.max(0, planData.usage.forms.limit - planData.usage.forms.used).toLocaleString()}
                        </p>
                      </div>
                      <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-center">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Total</p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                          {planData.usage.forms.limit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submissions usage card */}
              {planData && (
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
                
                  <CardHeader className="pb-2 space-y-0">
                    <CardTitle className="text-sm flex items-center text-zinc-900 dark:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                      Submissions
                    </CardTitle>
                    <div className="flex items-center justify-between">
                      <CardDescription className="text-zinc-500 dark:text-zinc-400 text-xs">
                        {planData.usage.submissions.used.toLocaleString()}/{planData.usage.submissions.limit.toLocaleString()} submissions
                      </CardDescription>
                      <div className={cn(
                        "px-1.5 py-0.5 rounded text-xs font-medium",
                        planData.usage.submissions.percentage > 90
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                          : planData.usage.submissions.percentage > 70
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      )}>
                        {planData.usage.submissions.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <Progress 
                      value={planData.usage.submissions.percentage} 
                      className={cn(
                        "h-1.5 mb-3",
                        planData.usage.submissions.percentage > 90 ? "bg-red-500 dark:bg-red-600" : 
                        planData.usage.submissions.percentage > 70 ? "bg-amber-500 dark:bg-amber-600" :
                        "bg-green-500 dark:bg-green-600"
                      )}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-center">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Remaining</p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                          {Math.max(0, planData.usage.submissions.limit - planData.usage.submissions.used).toLocaleString()}
                        </p>
                      </div>
                      <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-center">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Total</p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                          {planData.usage.submissions.limit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Campaigns usage card */}
              {planData && planData.features.campaigns && (
                <Card className="border-zinc-200 dark:border-zinc-800  shadow-none">
            
                  <CardHeader className="pb-2 space-y-0">
                    <CardTitle className="text-sm flex items-center text-zinc-900 dark:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Campaigns
                    </CardTitle>
                    <div className="flex items-center justify-between">
                      <CardDescription className="text-zinc-500 dark:text-zinc-400 text-xs">
                        {planData.usage.campaigns.used.toLocaleString()}/{planData.usage.campaigns.limit.toLocaleString()} campaigns
                      </CardDescription>
                      <div className={cn(
                        "px-1.5 py-0.5 rounded text-xs font-medium",
                        planData.usage.campaigns.percentage > 90
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                          : planData.usage.campaigns.percentage > 70
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      )}>
                        {planData.usage.campaigns.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <Progress 
                      value={planData.usage.campaigns.percentage} 
                      className={cn(
                        "h-1.5 mb-3",
                        planData.usage.campaigns.percentage > 90 ? "bg-red-500 dark:bg-red-600" : 
                        planData.usage.campaigns.percentage > 70 ? "bg-amber-500 dark:bg-amber-600" :
                        "bg-green-500 dark:bg-green-600"
                      )}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-center">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Remaining</p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                          {Math.max(0, planData.usage.campaigns.limit - planData.usage.campaigns.used).toLocaleString()}
                        </p>
                      </div>
                      <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-center">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Total</p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                          {planData.usage.campaigns.limit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  };

  // Return the renderContent result
  return renderContent();
}