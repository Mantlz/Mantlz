import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Info, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { PlanBadge } from "@/components/billing/plan-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

const formEmailSchema = z.object({
  enabled: z.boolean().default(false),
  developerNotificationsEnabled: z.boolean().default(false),
  developerEmail: z.string().email().optional().or(z.literal("")),
  maxNotificationsPerHour: z.number().min(1).max(100).default(10),
});

type FormEmailValues = z.infer<typeof formEmailSchema>;

interface FormEmailSettingsProps {
  formId: string;
}

export default function FormEmailSettings({ formId }: FormEmailSettingsProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  // Get the user's plan and API key
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user-resend-key"],
    queryFn: async () => {
      return await api.user.getResendApiKey.query();
    },
  });

  // Get form's current email settings
  const { data: emailSettings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ["form-email-settings", formId],
    queryFn: async () => {
      return await api.forms.getEmailSettings.query({ formId });
    },
  });

  const isPro = userData?.plan === "PRO";
  const hasResendKey = userData?.resendApiKey && userData.resendApiKey.length > 0;

  // Form for updating the email settings
  const form = useForm<FormEmailValues>({
    resolver: zodResolver(formEmailSchema),
    defaultValues: {
      enabled: emailSettings?.enabled || false,
      developerNotificationsEnabled: emailSettings?.developerNotificationsEnabled || false,
      developerEmail: emailSettings?.developerEmail || "",
      maxNotificationsPerHour: emailSettings?.maxNotificationsPerHour || 10,
    },
  });

  React.useEffect(() => {
    if (emailSettings) {
      form.reset({
        enabled: emailSettings.enabled,
        developerNotificationsEnabled: emailSettings.developerNotificationsEnabled,
        developerEmail: emailSettings.developerEmail || "",
        maxNotificationsPerHour: emailSettings.maxNotificationsPerHour || 10,
      });
    }
  }, [emailSettings, form]);

  // Update email settings
  const { mutate: updateEmailSettings, isPending } = useMutation({
    mutationFn: async (data: FormEmailValues) => {
      await api.forms.updateEmailSettings.mutate({
        formId,
        ...data,
      });
    },
    onSuccess: () => {
      toast.success("Email settings updated successfully");
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to update email settings");
      console.error(error);
    },
  });

  // Handle form submission
  const onSubmit = (data: FormEmailValues) => {
    updateEmailSettings(data);
  };

  const isLoading = isUserLoading || isSettingsLoading;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Developer Notifications
            <PlanBadge plan="PRO" />
          </CardTitle>
          <CardDescription>
            Receive email notifications when users submit this form
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isPro ? (
            <div className="rounded-md bg-muted p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-amber-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Pro Plan Required
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Developer notifications are only available on the Pro plan.
                    Upgrade to Pro to receive email notifications when users submit your forms.
                  </p>
                </div>
              </div>
            </div>
          ) : !hasResendKey ? (
            <div className="rounded-md bg-muted p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-amber-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Resend API Key Required
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You need to add your Resend API key in Email Settings 
                    before you can enable developer notifications.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="developerNotificationsEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Developer Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive email notifications when users submit this form
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!isPro || !hasResendKey}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch("developerNotificationsEnabled") && (
                      <>
                        <FormField
                          control={form.control}
                          name="developerEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notification Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="you@example.com"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormDescription>
                                Leave empty to use your account email: {user?.primaryEmailAddress?.emailAddress}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="maxNotificationsPerHour"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Notifications Per Hour</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  max={100}
                                  {...field}
                                  onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                Limit how many notifications you receive per hour (1-100)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    <div className="flex justify-end space-x-2">
                      <Button
                        type="submit"
                        disabled={isPending || !isPro || !hasResendKey}
                      >
                        {isPending ? (
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        ) : isSuccess ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : null}
                        Save Settings
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 