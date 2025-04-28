"use client"

import React, { useState } from "react";
import { Bell, Loader2, RefreshCw, AlertCircle, Code } from "lucide-react";
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

interface AdvancedSettings {
  maxNotificationsPerHour: number;
  developerNotificationsEnabled: boolean;
}

export function AdvancedSettings() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [settings, setSettings] = useState<AdvancedSettings>({
    maxNotificationsPerHour: 10,
    developerNotificationsEnabled: false,
  });

  // Get user's plan
  const { data: userData, isLoading: isLoadingPlan } = useQuery({
    queryKey: ["user-plan"],
    queryFn: async () => {
      const response = await client.user.getUserPlan.$get();
      if (!response.ok) throw new Error('Failed to fetch user plan');
      return await response.json();
    },
  });

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
      const response = await client.forms.updateGlobalSettings.$post(newSettings);
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You need to upgrade to PRO to modify notification settings');
        }
        throw new Error('Failed to update settings');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Settings updated successfully');
      queryClient.invalidateQueries({ queryKey: ["global-settings"] });
    },
    onError: (error) => {
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

  const handleSettingChange = (value: string) => {
    if (!userData || userData.plan !== 'PRO') {
      toast.error('You need to upgrade to PRO to modify notification settings');
      return;
    }
    
    // Convert to number and ensure it's valid
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;
    
    // Ensure the value is within bounds
    const boundedValue = Math.min(Math.max(numValue, 1), 100);
    setSettings(prev => ({ ...prev, maxNotificationsPerHour: boundedValue }));
  };

  // Update the handleRefresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["global-settings"] });
      await queryClient.invalidateQueries({ queryKey: ["user-plan"] });
    } finally {
      setTimeout(() => setIsRefreshing(false), 600); // Add minimum loading time for visual feedback
    }
  };

  const isProUser = userData?.plan === 'PRO';
  const isLoading = isLoadingPlan || isLoadingSettings;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <Loader2 className="h-6 w-6 text-zinc-400 animate-spin" />
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Loading advanced settings...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ScrollArea className="h-[550px]">
        <div className="w-full space-y-4 p-4">
          <header className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
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
              Configure advanced notification settings
            </p>
          </header>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-zinc-500" />
                  Notification Frequency
                </CardTitle>
                <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs">
                  Set the maximum number of notifications you want to receive per hour
                </CardDescription>
              </div>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200 w-fit">
                PRO
              </Badge>
            </CardHeader>
            
            <CardContent className="px-5 pb-4">
              {!isProUser ? (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 sm:p-4 dark:bg-amber-900/20 dark:border-amber-800/30">
                  <div className="flex gap-2 sm:gap-3">
                    <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                        Pro Plan Required
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        Upgrade to Pro to customize your notification frequency.
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 px-2 py-1 text-xs border-amber-300 text-amber-700 bg-amber-50 cursor-pointer hover:bg-amber-100 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-900/30 dark:hover:bg-amber-800/30 mt-2"
                      >
                        Upgrade to Pro
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-zinc-100 dark:bg-zinc-950 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-white dark:bg-zinc-900 rounded-lg p-2 border border-zinc-200 dark:border-zinc-800">
                        <Bell className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          Maximum Notifications per Hour
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          Current limit: {settings.maxNotificationsPerHour}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        value={String(settings.maxNotificationsPerHour)}
                        onChange={(e) => handleSettingChange(e.target.value)}
                        className="h-9 w-24 border-zinc-200 dark:border-zinc-800"
                      />
                      <Button
                        onClick={() => updateSettings(settings)}
                        disabled={isUpdating}
                        size="sm"
                        className="h-9"
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

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="pb-2 pt-3 px-4 flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-zinc-900 dark:text-white text-xs flex items-center">
                  <Code className="h-4 w-4 mr-1.5 text-zinc-500" />
                  Debug Mode
                </CardTitle>
                <CardDescription className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                  Test and debug your form submissions
                </CardDescription>
              </div>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200 text-[10px] px-1.5 py-0.5">
                PRO
              </Badge>
            </CardHeader>
            
            <CardContent className="px-4 pb-3">
              <div className="rounded-lg bg-zinc-50 border border-blue-200 p-2 dark:bg-zinc-900/20 dark:border-blue-800/30">
                <div className="flex gap-2">
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-medium text-blue-800 dark:text-blue-300">
                      Coming Soon
                    </p>
                    <p className="text-[10px] text-blue-700 dark:text-blue-400">
                      We&apos;re working on bringing you powerful debugging tools. Stay tuned!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
} 