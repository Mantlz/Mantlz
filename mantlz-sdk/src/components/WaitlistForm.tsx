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

export type WaitlistFormProps = {
  onSubmitSuccess?: (data: z.infer<typeof waitlistSchema>) => void;
  onSubmitError?: (error: Error) => void;
  className?: string;
  variant?: "default" | "glass";
  toastProvider?: any;
  enableToast?: boolean;
};

export function WaitlistForm({ 
  onSubmitSuccess, 
  onSubmitError,
  className,
  variant = "default",
  toastProvider,
  enableToast = true
}: WaitlistFormProps) {
  const { apiKey, client } = useMantlz();
  
  React.useEffect(() => {
    if (enableToast && toastProvider && client.configureNotifications) {
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
    try {
      const response = await client.submitForm('waitlist', {
        formId: 'waitlist-form',
        apiKey,
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

  return (
    <Card variant={variant} className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader>
        <CardTitle>Join the Waitlist</CardTitle>
        <CardDescription>
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
            Join Waitlist
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 