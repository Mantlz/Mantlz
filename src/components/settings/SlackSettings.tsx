"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plug, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { client } from "@/lib/client";
import { useSubscription } from "@/hooks/useSubscription";
import { Badge } from "@/components/ui/badge";
import { useLoading } from "@/contexts/LoadingContext";

interface SlackConfig {
  id: string;
  enabled: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  webhookUrl: string;
  channel: string | null;
}

export default function SlackSettings() {
  const { isPremium } = useSubscription();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [channel, setChannel] = useState("");
  const { setIsLoading, setLoadingMessage, renderSkeleton } = useLoading()


  // Fetch current Slack config
  const { 
    data: slackConfig, 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['slackConfig'],
    queryFn: async () => {
      const response = await client.slack.getConfig.$get()
      const data = await response.json()
      return data as SlackConfig
    },
    enabled: isPremium // Only fetch if user is premium
  });
  
  // Set global loading state
  useEffect(() => {
    if (isLoading) {
      setLoadingMessage('Loading Slack settings...');
    }
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading, setLoadingMessage]);

  // Initialize states from slackConfig
  useEffect(() => {
    if (slackConfig) {
      setIsEnabled(slackConfig.enabled);
      setWebhookUrl(slackConfig.webhookUrl);
      setChannel(slackConfig.channel || "");
    }
  }, [slackConfig]);

  // Update Slack config
  const updateConfigMutation = useMutation({
    mutationFn: async (config: {
      enabled: boolean
      webhookUrl: string
      channel?: string
    }) => {
      const response = await client.slack.updateConfig.$post(config)
      const data = await response.json()
      return data as SlackConfig
    },
    onSuccess: () => {
      refetch()
    }
  });

  // Test webhook
  const testWebhookMutation = useMutation({
    mutationFn: async (config: { webhookUrl: string, channel?: string }) => {
      await client.slack.testWebhook.$post(config)
      return true
    },
    onSuccess: () => {
      toast.success('Test message sent successfully')
    },
    onError: () => {
      toast.error('Failed to send test message')
    }
  });

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refetch()
    } finally {
      setTimeout(() => setIsRefreshing(false), 600)
    }
  }

  const handleTestWebhook = async () => {
    if (!webhookUrl) return
    setIsTesting(true)
    try {
      await testWebhookMutation.mutateAsync({
        webhookUrl,
        channel: channel || undefined
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleSave = async (checked: boolean) => {
    // Immediately update UI state for responsiveness
    setIsEnabled(checked);
    
    if (!slackConfig) return;

    // If enabling without a webhook URL, just update the enabled state
    if (checked && !slackConfig.webhookUrl) {
      return;
    }
    
    try {
      await updateConfigMutation.mutateAsync({
        enabled: checked,
        webhookUrl: slackConfig.webhookUrl || "",
        channel: slackConfig.channel || undefined
      });
      toast.success('Slack notifications ' + (checked ? 'enabled' : 'disabled'));
    } catch {
      // Revert state if update fails
      setIsEnabled(!checked);
      toast.error('Failed to update Slack notifications');
    }
  }

  const handleSaveConfig = async () => {
    try {
      await updateConfigMutation.mutateAsync({
        enabled: isEnabled,
        webhookUrl,
        channel: channel || undefined
      });
      toast.success('Slack settings updated successfully');
    } catch {
      toast.error('Failed to update Slack settings');
    }
  }

  // Remove the local loading UI code and replace with renderContent function
  const renderContent = () => {
    // Create a common header component that's always visible
    const headerContent = (
      <header className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg ">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              Slack Integration
            </h2>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing || !isPremium || isLoading}
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
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Configure Slack notifications for your Mantle account
        </p>
      </header>
    );

    if (isLoading) {
      return (
        <div className="w-full max-w-6xl mx-auto">
          <ScrollArea className="h-[550px] w-full scrollbar-hide">
            <div className="w-full space-y-4 pr-4">
              {headerContent}
              {renderSkeleton('card', 1)}
            </div>
          </ScrollArea>
        </div>
      );
    }

    const hasChanges = 
      webhookUrl !== slackConfig?.webhookUrl || 
      channel !== (slackConfig?.channel || "");

    return (
      <div className="w-full max-w-6xl mx-auto">
        <ScrollArea className="h-[550px] w-full scrollbar-hide">
          <div className="w-full space-y-4 pr-4">
            {headerContent}
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
              <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
                    <Plug className="h-4 w-4 mr-2 text-zinc-600" />
                    Slack Notifications
                  </CardTitle>
                  <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs">
                    Get notified in Slack when you receive new form submissions
                  </CardDescription>
                </div>
                <Badge className="bg-orange-100 text-orange-800 dark:bg-amber-700/30 dark:text-orange-200 w-fit">
                  STANDARD+
                </Badge>
              </CardHeader>
              
              <CardContent className="px-5 pb-4">
                {!isPremium ? (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 sm:p-4 dark:bg-amber-900/20 dark:border-amber-800/30">
                    <div className="flex gap-2 sm:gap-3">
                      <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                          Standard or Pro Plan Required
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          Upgrade to Standard or Pro to enable Slack notifications for form submissions.
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 px-2 py-1 text-xs border-amber-300 text-amber-700 bg-amber-50 cursor-pointer hover:bg-amber-100 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-900/30 dark:hover:bg-amber-800/30 mt-2"
                        >
                          Upgrade Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Alert className="bg-background dark:bg-background border-zinc-300 dark:border-zinc-900">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You&apos;ll need to create a Slack webhook URL in your workspace settings to enable notifications.
                      </AlertDescription>
                    </Alert>

                    <div className="mt-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Slack Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications for new form submissions
                          </p>
                        </div>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={handleSave}
                          aria-label="Toggle Slack notifications"
                          className="cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="webhookUrl">Webhook URL</Label>
                        <Input
                          id="webhookUrl"
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                          placeholder="https://hooks.slack.com/services/..."
                          disabled={!isEnabled}
                        />
                        <p className="text-sm text-muted-foreground">
                          You&apos;ll need to create a webhook URL in your Slack workspace settings
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="defaultChannel">Default Channel</Label>
                        <Input
                          id="defaultChannel"
                          value={channel}
                          onChange={(e) => setChannel(e.target.value)}
                          placeholder="#notifications"
                          disabled={!isEnabled}
                        />
                        <p className="text-sm text-muted-foreground">
                          Optional: Override the default channel set in your webhook
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          onClick={handleTestWebhook}
                          disabled={!isEnabled || !webhookUrl || isTesting}
                        >
                          {isTesting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Testing...
                            </>
                          ) : (
                            'Test Webhook'
                          )}
                        </Button>
                        {hasChanges && (
                          <Button
                            onClick={handleSaveConfig}
                            disabled={updateConfigMutation.isPending}
                          >
                            {updateConfigMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              'Save Changes'
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    );
  };

  // Return the renderContent result instead of conditional rendering
  return renderContent();
}