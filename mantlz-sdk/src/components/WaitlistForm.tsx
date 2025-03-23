'use client';

import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cn } from '../utils/cn';
import { ArrowRight } from 'lucide-react';
import { useMantlz } from '../context/mantlzContext';

const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  name: z.string().min(2, 'Name is required'),
  referralSource: z.string().optional(),
});

export interface WaitlistFormProps {
  formId: string;
  theme?: 'light' | 'dark';
  customSubmitText?: string;
  onSubmitSuccess?: (data: any) => void;
  onSubmitError?: (error: any) => void;
  className?: string;
  variant?: "default" | "glass";
  toastProvider?: any;
  enableToast?: boolean;
}

export function WaitlistForm({ 
  formId,
  theme = 'light',
  customSubmitText = 'Join Waitlist',
  onSubmitSuccess,
  onSubmitError,
  className = '',
  variant = "default",
  toastProvider,
  enableToast = true
}: WaitlistFormProps) {
  const { client } = useMantlz();
  const [apiKeyError, setApiKeyError] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    if (!client) {
      setApiKeyError(true);
    }
  }, [client]);
  
  React.useEffect(() => {
    if (enableToast && toastProvider && client && client.configureNotifications) {
      client.configureNotifications(true, toastProvider);
    }
  }, [client, enableToast, toastProvider]);
  
  const form = useForm({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: '',
      name: '',
      referralSource: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof waitlistSchema>) => {
    if (!client) {
      onSubmitError?.(new Error('API key not configured properly'));
      return;
    }
    
    try {
      const response = await client.submitForm('waitlist', {
        formId,
        data
      });
      
      if (response.success) {
        onSubmitSuccess?.(data);
      } else {
        onSubmitError?.(new Error('Submission failed'));
      }
    } catch (error) {
      onSubmitError?.(error as Error);
    }
  };

  // Show API key error UI
  if (apiKeyError) {
    return (
      <Card variant={variant} className={cn("w-full max-w-md mx-auto bg-red-50 border-red-200", className)}>
        <CardHeader>
          <CardTitle className="text-red-700">Configuration Error</CardTitle>
          <CardDescription className="text-red-600">
            MANTLZ_KEY is not set
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">
            Please add your MANTLZ_KEY to your environment variables:
          </p>
          <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm overflow-x-auto">
            MANTLZ_KEY=mk_xxxxxxxxxxxxxxxxxxxx
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant={variant} className={cn("w-full max-w-md mx-auto", 
      theme === 'dark' ? "bg-zinc-900 text-white" : "bg-white text-zinc-900",
      className
    )}>
      <CardHeader>
        <CardTitle>Join the Waitlist</CardTitle>
        <CardDescription className={theme === 'dark' ? "text-zinc-300" : "text-zinc-600"}>
          Be the first to know when we launch. Get early access and exclusive updates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Name
            </label>
            <Input
              {...form.register('name')}
              placeholder="Enter your name"
              variant={form.formState.errors.name ? "error" : "default"}
              className="bg-white dark:bg-zinc-900"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Email
            </label>
            <Input
              {...form.register('email')}
              placeholder="you@example.com"
              type="email"
              variant={form.formState.errors.email ? "error" : "default"}
              className="bg-white dark:bg-zinc-900"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              How did you hear about us?
            </label>
            <Input
              {...form.register('referralSource')}
              placeholder="Optional"
              className="bg-white dark:bg-zinc-900"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {customSubmitText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 