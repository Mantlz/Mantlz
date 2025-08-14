"use client"

import React, { useState, useEffect } from "react";
import { Bell, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { client } from "@/lib/client";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSubscription } from "@/hooks/useSubscription";
import { useLoading } from "@/contexts/LoadingContext";
import { getQuotaByPlan } from "@/config/usage";

interface AdvancedSettings {
  maxNotificationsPerHour: number;
  developerNotificationsEnabled: boolean;
}

export function AdvancedSettings() {
  const queryClient = useQueryClient();
  const { userPlan } = useSubscription();
  const isProUser = userPlan === 'PRO';
  const isStandardUser = userPlan === 'STANDARD';
  const isFreeUser = userPlan === 'FREE';
  
  // Get plan-specific notification limits
  const planQuota = getQuotaByPlan(userPlan || 'FREE');
  const maxAllowedNotifications = planQuota.maxNotificationsPerHour;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [settings, setSettings] = useState<AdvancedSettings>({
    maxNotificationsPerHour: 10,
    developerNotificationsEnabled: false,
  });

  // Get the global loading state
  const { setIsLoading, setLoadingMessage, renderSkeleton } = useLoading();

  // Get settings
  const { data: settingsData, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["global-settings"],
    queryFn: async () => {
      const response = await client.forms.getGlobalSettings.$get();
      if (!response.ok) throw new Error('Failed to fetch settings');
      return await response.json();
    },
  });

  // Update settings mutation
  const { mutate: updateSettings, isPending: isUpdating } = useMutation({
    mutationFn: async (newSettings: AdvancedSettings) => {
      const response = await client.forms.updateGlobalSettings.$post({
        maxNotificationsPerHour: newSettings.maxNotificationsPerHour,
        developerNotificationsEnabled: newSettings.developerNotificationsEnabled,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You need to upgrade to PRO to modify notification settings');
        }
        const errorMessage = typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string' 
          ? data.message 
          : 'Failed to update settings';
        throw new Error(errorMessage);
      }
      
      return data;
    },
    onSuccess: () => {
      toast.success('Settings updated successfully');
      queryClient.invalidateQueries({ queryKey: ["global-settings"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update settings');
    },
  });

  // Initialize settings when data is loaded
  React.useEffect(() => {
    if (settingsData) {
      setSettings({
        maxNotificationsPerHour: settingsData.maxNotificationsPerHour ?? 10,
        developerNotificationsEnabled: settingsData.developerNotificationsEnabled ?? false,
      });
    }
  }, [settingsData]);

  // Sync with global loading state
  useEffect(() => {
    setIsLoading(isLoadingSettings);
    if (isLoadingSettings) {
      setLoadingMessage('Loading advanced settings...');
    }
  }, [isLoadingSettings, setIsLoading, setLoadingMessage]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["global-settings"] });
      toast.success('Settings refreshed successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        //toast.error(error.message);
      } else {
        toast.error('Failed to refresh settings');
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSettingChange = (value: string) => {
    if (isFreeUser) {
      toast.error('Free plan users cannot receive notifications. Upgrade to Standard or Pro.');
      return;
    }
    if (!isProUser && !isStandardUser) {
      toast.error('You need to upgrade to Standard or Pro to modify notification settings');
      return;
    }
    
    // Convert to number and ensure it's valid
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;
    
    // Ensure the value is within bounds based on plan
    const minValue = isFreeUser ? 0 : 1;
    const boundedValue = Math.min(Math.max(numValue, minValue), maxAllowedNotifications);
    setSettings(prev => ({ ...prev, maxNotificationsPerHour: boundedValue }));
  };

  // Create a renderContent function to handle conditional rendering
  const renderContent = () => {
    // Create a common header component that's always visible
    const headerContent = (
      <header className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              Advanced Settings
            </h2>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing || isLoadingSettings}
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
          Configure advanced notification settings
        </p>
      </header>
    );

    if (isLoadingSettings) {
      return (
        <div className="w-full max-w-5xl mx-auto">
          <ScrollArea className="h-[550px] w-full">
            <div className="w-full space-y-6 pr-4">
              {headerContent}
              {renderSkeleton('card', 1)}
            </div>
          </ScrollArea>
        </div>
      );
    }

    return (
      <div className="w-full max-w-5xl mx-auto">
        <ScrollArea className="h-[550px] w-full">
          <div className="w-full space-y-6 pr-4">
            {headerContent}

            <Card className="border-zinc-200 dark:border-zinc-800  shadow-none">
              <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
                    <Bell className="h-4 w-4 mr-2 text-zinc-500" />
                    Notification Frequency
                  </CardTitle>
                  <CardDescription className="text-zinc-500 dark:text-zinc-400 text-xs">
                    Set the maximum number of notifications you want to receive per hour
                  </CardDescription>
                </div>
                <Badge className={`w-fit ${
                  isProUser 
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-700/30 dark:text-purple-200" 
                    : isStandardUser 
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-700/30 dark:text-blue-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-200"
                }`}>
                  {userPlan || 'FREE'}
                </Badge>
              </CardHeader>
              
              <CardContent className="px-5 pb-4">
                {isFreeUser ? (
                   <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 sm:p-4 dark:bg-amber-900/20 dark:border-amber-800/30">
                     <div className="flex gap-2 sm:gap-3">
                       <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                       <div className="space-y-1">
                         <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                           Standard or Pro Plan Required
                         </p>
                         <p className="text-xs text-amber-500 dark:text-amber-500">
                           Free plan users do not receive notifications. Upgrade to Standard (100/hour) or Pro (200/hour) to enable notifications.
                         </p>
                         <Button 
                           size="sm" 
                           variant="outline" 
                           className="h-7 px-2 py-1 text-xs border-amber-300 text-amber-500 bg-amber-50 cursor-pointer hover:bg-amber-100 dark:border-amber-700 dark:text-amber-500 dark:bg-amber-900/30 dark:hover:bg-amber-800/30 mt-2"
                         >
                           Upgrade Plan
                         </Button>
                       </div>
                     </div>
                   </div>
                 ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3  px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-2 border border-zinc-200 dark:border-zinc-800">
                          <Bell className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Maximum Notifications per Hour
                          </span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            Current: {settings.maxNotificationsPerHour} | Plan limit: {maxAllowedNotifications}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={isFreeUser ? 0 : 1}
                          max={maxAllowedNotifications}
                          value={String(settings.maxNotificationsPerHour)}
                          onChange={(e) => handleSettingChange(e.target.value)}
                          className="h-9 w-24 border-zinc-200 dark:border-zinc-800"
                          disabled={isFreeUser}
                        />
                        <Button
                          onClick={() => updateSettings(settings)}
                          disabled={isUpdating}
                          size="sm"
                          className="bg-amber-500 text-black dark:text-white dark:border-background border text-sm  ring ring-inset ring-white/20 transition-[filter] duration-200 hover:brightness-125 active:brightness-95"
                        >
                          {isUpdating ? (
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          ) : null}
                          {isUpdating ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    );
  };
  return renderContent();
}