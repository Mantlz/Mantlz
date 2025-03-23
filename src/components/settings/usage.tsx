"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
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

const useResetQuota = (
  onSuccess: () => void, 
  onError: () => void, 
  onSettled: () => void
) => {
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await client.usage.resetMonthlyQuota.$post({});
        const data = await response.json();
        console.log("Reset quota response:", data); // For debugging
        return data;
      } catch (err) {
        console.error("Error resetting quota:", err);
        throw err;
      }
    },
    onSuccess,
    onError,
    onSettled,
  });
};

type PlanBadgeProps = {
  plan: string;
};

const PlanBadge: React.FC<PlanBadgeProps> = ({ plan }) => {
  const badgeStyles = {
    FREE: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
    INDIE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    HACKER: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  }[plan] || "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";

  return (
    <Badge className={cn("ml-2 font-medium", badgeStyles)}>
      {plan}
    </Badge>
  );
};

type MonthlyUsageChartProps = {
  history: Array<{ month: string; year: number; count: number }>;
};

const MonthlyUsageChart: React.FC<MonthlyUsageChartProps> = ({ history }) => {
  // Handle empty history
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-4 text-zinc-500 dark:text-zinc-400">
        <p>No usage history available.</p>
      </div>
    );
  }

  // Find the maximum count to scale the chart properly
  const maxCount = Math.max(...history.map(item => item.count || 0), 1);
  
  return (
    <div className="mt-4 space-y-1">
      <div className="text-sm font-medium mb-2 text-zinc-800 dark:text-zinc-200">
        Usage History (Last 6 Months)
      </div>
      <div className="space-y-3">
        {history.map((item, index) => (
          <div key={`${item.month}-${item.year}`} className="space-y-1">
            <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <span>{item.month} {item.year}</span>
              <span>{item.count?.toLocaleString() || 0} forms</span>
            </div>
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-zinc-400 dark:bg-zinc-600 rounded-full"
                style={{ width: `${((item.count || 0) / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function UsageSettings() {
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<boolean | null>(null);

  // Fetch user usage data
  const { data, isLoading, error, refetch } = useUsageData();

  // Reset monthly quota mutation
  const resetQuotaMutation = useResetQuota(
    () => {
      setResetSuccess(true);
      refetch(); // Refresh the usage data
      setTimeout(() => setResetSuccess(null), 3000);
    },
    () => {
      setResetSuccess(false);
      setTimeout(() => setResetSuccess(null), 3000);
    },
    () => {
      setIsResetting(false);
    }
  );

  const handleResetQuota = () => {
    setIsResetting(true);
    setResetSuccess(null);
    resetQuotaMutation.mutate();
  };

  // Validate that the data is properly formatted
  const isValidData = data && 
    typeof data.plan === 'string' &&
    typeof data.limit === 'number' &&
    typeof data.usedQuota === 'number' &&
    typeof data.remainingQuota === 'number' &&
    typeof data.totalForms === 'number' &&
    typeof data.usagePercentage === 'number' &&
    Array.isArray(data.history);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-zinc-400 animate-spin" />
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Loading usage information...
        </p>
      </div>
    );
  }

  if (error || !data || !isValidData) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="mt-2 text-sm text-zinc-800 dark:text-zinc-200">
          Could not load your usage information.
        </p>
        {!isValidData && data && (
          <p className="mt-1 text-xs text-red-500">
            The data received is not in the expected format.
          </p>
        )}
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => refetch()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <header className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Usage Information
          </h2>
          <PlanBadge plan={data.plan} />
        </div>
        <div className="w-16 h-0.5 bg-zinc-300 dark:bg-zinc-700 my-2"></div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Monitor your form creation limits and usage statistics
        </p>
      </header>

      <div className="space-y-6">
        {/* Current monthly usage card */}
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-white text-base">
              Current Monthly Usage
            </CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">
              Your usage for the current month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  {data.usedQuota.toLocaleString()} / {data.limit.toLocaleString()} forms
                </span>
                <span className="font-medium text-zinc-900 dark:text-white">
                  {Math.min(Math.round(data.usagePercentage), 100)}%
                </span>
              </div>
              <Progress 
                value={Math.min(data.usagePercentage, 100)} 
                className={cn(
                  "h-2 bg-zinc-100 dark:bg-zinc-800",
                  data.usagePercentage > 90 ? "bg-red-500 dark:bg-red-600" : "bg-zinc-500 dark:bg-zinc-400"
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-md">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Used</p>
                <p className="text-2xl font-semibold text-zinc-900 dark:text-white mt-1">
                  {data.usedQuota.toLocaleString()}
                </p>
              </div>
              <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-md">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Remaining</p>
                <p className="text-2xl font-semibold text-zinc-900 dark:text-white mt-1">
                  {data.remainingQuota.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Total forms created: <span className="font-medium">{data.totalForms.toLocaleString()}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="text-zinc-600 dark:text-zinc-400"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Refresh
            </Button>
          </CardFooter>
        </Card>

        {/* Usage history chart */}
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-white text-base">
              Usage History
            </CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">
              Your form creation history over the past months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyUsageChart history={data.history} />
          </CardContent>
        </Card>

        {/* Admin actions */}
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-white text-base">
              Reset Monthly Usage
            </CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">
              This will reset your usage count for the current month only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={handleResetQuota}
                disabled={isResetting}
                className="border-zinc-300 dark:border-zinc-700"
              >
                {isResetting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Monthly Count"
                )}
              </Button>
              
              {resetSuccess === true && (
                <div className="ml-4 flex items-center text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  <span className="text-sm">Reset successful</span>
                </div>
              )}
              
              {resetSuccess === false && (
                <div className="ml-4 flex items-center text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Failed to reset</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="text-xs text-zinc-500 dark:text-zinc-500">
            Note: This action is typically for administrators and testing purposes.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 