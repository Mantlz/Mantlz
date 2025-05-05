"use client";

import React, { useState } from "react";
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

// Type definitions for our usage data
interface UsageData {
  plan: string;
  currentUsage: {
    submissions: number;
    forms: number;
    campaigns: number;
    emailStats: {
      sent: number;
      opened: number;
      clicked: number;
    };
  };
  limits: {
    maxForms: number;
    maxSubmissionsPerMonth: number;
    campaigns: {
      enabled: boolean;
      maxCampaignsPerMonth: number;
      maxRecipientsPerCampaign: number;
      features: {
        analytics: boolean;
        scheduling: boolean;
        templates: boolean;
        customDomain: boolean;
      };
    };
  };
  history: Array<{
    month: string;
    year: number;
    submissions: number;
    forms: number;
    campaigns: number;
    emailStats: {
      sent: number;
      opened: number;
      clicked: number;
    };
  }>;
}

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
    email: {
      sent: number;
      opened: number;
      clicked: number;
      openRate: number;
      clickRate: number;
    };
  };
  features: {
    campaigns: boolean;
    analytics: boolean;
    scheduling: boolean;
    templates: boolean;
    customDomain: boolean;
  };
  resetDate: string;
  plan: string;
}

// Interface for total submissions data
interface TotalSubmissionsData {
  totalSubmissions: number;
}

// Create custom hooks for API calls
const useUsageData = () => {
  return useQuery<UsageData>({
    queryKey: ["userUsage"],
    queryFn: async () => {
      try {
        const response = await client.usage.getUserUsage.$get();
        return response.json();
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
        return {
          ...data,
          resetDate: data.resetDate ? new Date(data.resetDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
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
  return useQuery<TotalSubmissionsData>({
    queryKey: ["totalSubmissions"],
    queryFn: async () => {
      try {
        const response = await client.usage.getTotalSubmissions.$get();
        return response.json();
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
    STANDARD: "bg-zinc-100 text-blue-800 dark:bg-zinc-900 dark:text-blue-200",
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
  const { data: submissionsData } = useTotalSubmissions();

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
    typeof data.currentUsage === 'object' &&
    typeof data.limits === 'object' &&
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
    <div className="w-full max-w-5xl mx-auto">
      <ScrollArea className="h-[550px] w-full">
        <div className="w-full space-y-6 p-1">
          <header className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                  Usage Information
                </h2>
                <PlanBadge plan={planData?.plan || 'FREE'} />
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
            
            {(planData?.usage.forms.percentage ?? 0) >= 80 && (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 dark:bg-amber-900/30 dark:border-amber-800/30 dark:text-amber-400 text-xs flex items-center">
                <AlertCircle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                <span>You&apos;re approaching your form limit. Consider upgrading your plan for more forms.</span>
              </div>
            )}
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Forms usage card */}
            {planData && (
              <Card className={cn(
                "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm w-full",
                planData.plan === "FREE" ? "min-h-[200px]" : "min-h-[250px]"
              )}>
                <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Forms
                    </CardTitle>
                    <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs">
                      {planData.usage.forms.used.toLocaleString()}/{planData.usage.forms.limit.toLocaleString()} forms • {planData.usage.forms.percentage.toFixed(1)}%
                    </CardDescription>
                  </div>
                  <div className={cn(
                    "px-1.5 py-0.5 rounded text-xs font-medium",
                    planData.usage.forms.percentage > 90
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                      : planData.usage.forms.percentage > 70
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  )}>
                    {planData.usage.forms.percentage > 90
                      ? "Critical" 
                      : planData.usage.forms.percentage > 70
                        ? "High"
                        : "Good"}
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4 pt-0">
                  <Progress 
                    value={planData.usage.forms.percentage} 
                    className={cn(
                      "h-1.5 bg-zinc-100 dark:bg-zinc-800",
                      planData.usage.forms.percentage > 90 ? "bg-red-500 dark:bg-red-600" : 
                      planData.usage.forms.percentage > 70 ? "bg-amber-500 dark:bg-amber-600" :
                      "bg-green-500 dark:bg-green-600"
                    )}
                  />
                  <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                    <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">Remaining</p>
                      <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {Math.max(0, planData.usage.forms.limit - planData.usage.forms.used).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">Total</p>
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
              <Card className={cn(
                "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm w-full",
                planData.plan === "FREE" ? "min-h-[200px]" : "min-h-[250px]"
              )}>
                <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                      Monthly Submissions
                    </CardTitle>
                    <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs">
                      {planData.usage.submissions.used.toLocaleString()}/{planData.usage.submissions.limit.toLocaleString()} submissions • {planData.usage.submissions.percentage.toFixed(1)}%
                    </CardDescription>
                  </div>
                  <div className={cn(
                    "px-1.5 py-0.5 rounded text-xs font-medium",
                    planData.usage.submissions.percentage > 90
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                      : planData.usage.submissions.percentage > 70
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  )}>
                    {planData.usage.submissions.percentage > 90
                      ? "Critical" 
                      : planData.usage.submissions.percentage > 70
                        ? "High"
                        : "Good"}
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-3 pt-0">
                  <Progress 
                    value={planData.usage.submissions.percentage} 
                    className={cn(
                      "h-1.5 bg-zinc-100 dark:bg-zinc-800",
                      planData.usage.submissions.percentage > 90 ? "bg-red-500 dark:bg-red-600" : 
                      planData.usage.submissions.percentage > 70 ? "bg-amber-500 dark:bg-amber-600" :
                      "bg-green-500 dark:bg-green-600"
                    )}
                  />
                  <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                    <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">Remaining</p>
                      <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {Math.max(0, planData.usage.submissions.limit - planData.usage.submissions.used).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">Total</p>
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
              <Card className={cn(
                "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm w-full",
                planData.plan === "FREE" ? "min-h-[200px]" : "min-h-[250px]"
              )}>
                <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Campaigns
                    </CardTitle>
                    <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs">
                      {planData.usage.campaigns.used.toLocaleString()}/{planData.usage.campaigns.limit.toLocaleString()} campaigns • {planData.usage.campaigns.percentage.toFixed(1)}%
                    </CardDescription>
                  </div>
                  <div className={cn(
                    "px-1.5 py-0.5 rounded text-xs font-medium",
                    planData.usage.campaigns.percentage > 90
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                      : planData.usage.campaigns.percentage > 70
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  )}>
                    {planData.usage.campaigns.percentage > 90
                      ? "Critical" 
                      : planData.usage.campaigns.percentage > 70
                        ? "High"
                        : "Good"}
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-3 pt-0">
                  <Progress 
                    value={planData.usage.campaigns.percentage} 
                    className={cn(
                      "h-1.5 bg-zinc-100 dark:bg-zinc-800",
                      planData.usage.campaigns.percentage > 90 ? "bg-red-500 dark:bg-red-600" : 
                      planData.usage.campaigns.percentage > 70 ? "bg-amber-500 dark:bg-amber-600" :
                      "bg-green-500 dark:bg-green-600"
                    )}
                  />
                  <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                    <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">Remaining</p>
                      <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {Math.max(0, planData.usage.campaigns.limit - planData.usage.campaigns.used).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">Total</p>
                      <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {planData.usage.campaigns.limit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Features Overview Card */}
          {planData && (
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm w-full">
              <CardHeader className="pb-3 pt-4 px-5">
                <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Available Features
                </CardTitle>
                <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs">
                  Features included in your {planData.plan} plan
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-3 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      planData.features.campaigns ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600"
                    )} />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Campaigns</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      planData.features.analytics ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600"
                    )} />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      planData.features.scheduling ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600"
                    )} />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Scheduling</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      planData.features.templates ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600"
                    )} />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Templates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      planData.features.customDomain ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600"
                    )} />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Custom Domain</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* All-time submissions card */}
          {submissionsData && (
            <Card className={cn(
              "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm w-full",
              planData?.plan === "FREE" ? "min-h-[100px]" : "min-h-[120px]"
            )}>
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
      </ScrollArea>
    </div>
  );
} 