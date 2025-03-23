'use client';

import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '../utils/cn';
import { MessageSquare, Star } from 'lucide-react';
import { useMantlz } from '../context/mantlzContext';


const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().min(10, 'Please provide more detailed feedback'),
  email: z.string().email().optional(),
});

export type FeedbackFormProps = {
  formId: string;
  onSubmitSuccess?: (data: z.infer<typeof feedbackSchema>) => void;
  onSubmitError?: (error: Error) => void;
  className?: string;
  variant?: "default" | "glass";
};

export function FeedbackForm({ 
  formId,
  onSubmitSuccess, 
  onSubmitError,
  className,
  variant = "default"
}: FeedbackFormProps) {
  const { client } = useMantlz();
  
  const form = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 5,
      feedback: '',
      email: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof feedbackSchema>) => {
    try {
      if (!client) {
        throw new Error('API key not configured properly');
      }
      
      const response = await client.submitForm('feedback', {
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

  return (
    <Card variant={variant} className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader>
        <CardTitle>Share Your Feedback</CardTitle>
        <CardDescription>
          Help us improve by sharing your thoughts and suggestions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Rating
            </label>
            <Select
              onValueChange={(value: string) => form.setValue('rating', parseInt(value))}
              defaultValue={form.getValues('rating').toString()}
            >
              <SelectTrigger className="bg-white dark:bg-zinc-900">
                <SelectValue>
                  <div className="flex items-center">
                    <Star className="mr-2 h-4 w-4 text-yellow-400" />
                    <span>{form.getValues('rating')} Stars</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    <div className="flex items-center">
                      <Star className="mr-2 h-4 w-4 text-yellow-400" />
                      <span>{num} {num === 1 ? 'Star' : 'Stars'}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Your Feedback
            </label>
            <Textarea
              {...form.register('feedback')}
              placeholder="Tell us what you think..."
              className="min-h-[120px] bg-white dark:bg-zinc-900"
              variant={form.formState.errors.feedback ? "error" : "default"}
            />
            {form.formState.errors.feedback && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {form.formState.errors.feedback.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Email (Optional)
            </label>
            <Input
              {...form.register('email')}
              placeholder="you@example.com"
              type="email"
              className="bg-white dark:bg-zinc-900"
              variant={form.formState.errors.email ? "error" : "default"}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Submit Feedback
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 