import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AtSign, Check, Info, RefreshCw, Loader2, AlertCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";

// Form schema for Resend API key
const resendKeySchema = z.object({
  resendApiKey: z
    .string()
    .min(1, "API key is required")
    .regex(/^re_/, "Must be a valid Resend API key starting with 're_'"),
  developerNotificationsEnabled: z.boolean().default(false),
});

type ResendKeyFormValues = z.infer<typeof resendKeySchema>;

export default function EmailSettings() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeveloperNotificationsEnabled, setIsDeveloperNotificationsEnabled] = useState(false);

  // Get the user's current Resend API key and plan
  const { data: userData, isLoading, refetch } = useQuery({
    queryKey: ["user-resend-key"],
    queryFn: async () => {
      const response = await client.user.getResendApiKey.$get();
      return await response.json();
    },
  });

  // Initialize developer notifications state from userData
  useEffect(() => {
    if (userData?.developerNotificationsEnabled !== undefined) {
      setIsDeveloperNotificationsEnabled(userData.developerNotificationsEnabled);
    }
  }, [userData?.developerNotificationsEnabled]);

  // Handle developer notifications toggle
  const handleDeveloperNotificationsToggle = async (checked: boolean) => {
    // Immediately update UI state for responsiveness
    setIsDeveloperNotificationsEnabled(checked);
    
    try {
      const response = await client.user.updateResendApiKey.$post({
        resendApiKey: userData?.resendApiKey || "",
        developerNotificationsEnabled: checked,
      });
      
      if (response.ok) {
        toast.success('Developer notifications ' + (checked ? 'enabled' : 'disabled'));
        refetch(); // Refresh data to ensure UI is in sync
      } else {
        throw new Error('Failed to update developer notifications');
      }
    } catch (error) {
      // Revert state if update fails
      setIsDeveloperNotificationsEnabled(!checked);
      console.error('Failed to update developer notifications:', error);
      toast.error('Failed to update developer notifications');
    }
  };

  // Check if user is on the PRO plan
  const isPro = userData?.plan === "PRO";

  // Form for updating the Resend API key
  const form = useForm<ResendKeyFormValues>({
    resolver: zodResolver(resendKeySchema),
    defaultValues: {
      resendApiKey: "",
      developerNotificationsEnabled: userData?.developerNotificationsEnabled || false,
    },
  });

  // Update the Resend API key
  const { mutate: updateResendKey, isPending } = useMutation({
    mutationFn: async (data: ResendKeyFormValues) => {
      if (!isPro) {
        throw new Error("This feature is only available to PRO users");
      }
      
      const response = await client.user.updateResendApiKey.$post({
        resendApiKey: data.resendApiKey,
        developerNotificationsEnabled: data.developerNotificationsEnabled,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Email settings updated successfully");
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to update email settings");
      console.error(error);
    },
  });

  // Handle form submission
  const onSubmit = (data: ResendKeyFormValues) => {
    updateResendKey(data);
  };

  // Handle refresh with loading state
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  // Check if user has set an API key
  const hasApiKey = userData?.resendApiKey && userData.resendApiKey.length > 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <Loader2 className="h-6 w-6 text-zinc-400 animate-spin" />
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Loading email settings...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="w-full space-y-4">
        <header className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                Email Settings
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
            Configure email notifications for form submissions
          </p>
        </header>

        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
                <AtSign className="h-4 w-4 mr-2 text-zinc-500" />
                Developer Notifications
              </CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs">
                Receive email notifications when users submit your forms
              </CardDescription>
            </div>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200 w-fit">
              PRO
            </Badge>
          </CardHeader>
          
          <CardContent className="px-5 pb-4">
            {!isPro ? (
              <div className="rounded-md bg-amber-50 border border-amber-200 p-3 sm:p-4 dark:bg-amber-900/20 dark:border-amber-800/30">
                <div className="flex gap-2 sm:gap-3">
                  <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                      Pro Plan Required
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      Upgrade to Pro to receive email notifications for form submissions.
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
                  <FormField
                    control={form.control}
                    name="developerNotificationsEnabled"
                    render={() => (
                      <FormItem className="flex flex-col sm:flex-row sm:items-center gap-3 bg-zinc-100 dark:bg-zinc-950 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="bg-white dark:bg-zinc-900 rounded-lg p-2 border border-zinc-200 dark:border-zinc-800">
                            <Mail className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              Developer Notifications
                            </span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              {isDeveloperNotificationsEnabled ? (
                                <span className="text-emerald-600 dark:text-emerald-500 font-medium">
                                  Enabled
                                </span>
                              ) : (
                                <span className="text-zinc-500 dark:text-zinc-400">
                                  Disabled
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={isDeveloperNotificationsEnabled}
                            onCheckedChange={handleDeveloperNotificationsToggle}
                            disabled={!hasApiKey}
                            className="data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-600"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="rounded-md bg-blue-50 border border-blue-200 p-3 sm:p-4 dark:bg-blue-900/20 dark:border-blue-800/30">
                    <div className="flex gap-2 sm:gap-3">
                      <Info className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
                          Resend API Key Required
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                          Add your Resend API key to enable email notifications.{" "}
                          <a
                            href="https://resend.com/signup"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-300 underline underline-offset-4"
                          >
                            Get API key
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="resendApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-zinc-700 dark:text-zinc-300">Resend API Key</FormLabel>
                        <FormControl>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <Input
                              type="password"
                              placeholder={hasApiKey ? "••••••••••••••••••••••••••" : "re_123abc..."}
                              className="h-9 border-zinc-200 dark:border-zinc-800"
                              {...field}
                            />
                            <Button
                              type="submit"
                              disabled={isPending}
                              size="sm"
                              className="h-9 w-full sm:w-auto"
                            >
                              {isPending ? (
                                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                              ) : isSuccess ? (
                                <Check className="h-4 w-4 mr-2" />
                              ) : null}
                              {isPending ? "Saving..." : isSuccess ? "Saved" : "Save"}
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          {hasApiKey ? (
                            <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                              <Check className="h-3.5 w-3.5" /> Resend API key is set
                            </span>
                          ) : (
                            "Enter your Resend API key starting with 're_'"
                          )}
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            )}
          </CardContent>
        
        </Card>
      </div>
    </div>
  );
} 