'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { cn } from '../utils/cn';
import { useMantlz } from '../context/mantlzContext';

import { feedbackSchema, FeedbackFormProps } from './feedback/types';
import { StarIcon, SendIcon } from './feedback/icons';
import { useColorScheme } from './feedback/useColorScheme';
import { processAppearance } from './feedback/styleUtils';

export { FEEDBACK_THEMES } from './feedback/sharedTypes';
export type { FeedbackFormProps, FeedbackFormAppearance } from './feedback/types';

export function FeedbackForm({ 
  formId,
  onSubmitSuccess, 
  onSubmitError,
  className,
  appearance,
  theme,
  primaryColor,
  backgroundColor,
  borderRadius,
  fontSize,
  shadow,
  submitButtonText,
  feedbackPlaceholder,
  successMessage = "Thank you for your feedback!",
  darkMode,
}: FeedbackFormProps) {
  const { client } = useMantlz();
  const [hoveredRating, setHoveredRating] = React.useState<number | null>(null);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  
  // Reset status after 3 seconds
  React.useEffect((): (() => void) | undefined => {
    if (submitStatus !== 'idle') {
      const timer = setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [submitStatus]);
  
  // Get color scheme for appearance, with optional override
  const colorScheme = useColorScheme(darkMode);

  // Process all appearance settings
  const styles = React.useMemo(() => {
    // First process the simple appearance without text customizations
    // to avoid type errors with the existing processAppearance function
    const baseAppearance = processAppearance(
      appearance,
      colorScheme,
      {
        theme,
        primaryColor,
        backgroundColor,
        borderRadius,
        fontSize,
        shadow
      }
    );
    
    // Then manually add text customizations if needed
    if (submitButtonText || feedbackPlaceholder) {
      return {
        ...baseAppearance,
        typography: {
          ...baseAppearance.typography,
          ...(submitButtonText && { submitButtonText }),
          ...(feedbackPlaceholder && { feedbackPlaceholder }),
        }
      };
    }
    
    return baseAppearance;
  }, [
    appearance, 
    colorScheme, 
    theme, 
    primaryColor, 
    backgroundColor, 
    borderRadius, 
    fontSize, 
    shadow,
    submitButtonText,
    feedbackPlaceholder
  ]);

  const form = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 5,
      feedback: '',
      email: '',
    },
  });

  const currentRating = form.watch('rating');

  const handleRatingChange = (rating: number) => {
    form.setValue('rating', rating);
  };

  const onSubmit = async (data: typeof feedbackSchema._type) => {
    try {
      if (!client) {
        throw new Error('API key not configured properly');
      }
      
      const response = await client.submitForm('feedback', {
        formId,
        data
      });
      
      if (response.success) {
        // Reset form
        form.reset({
          rating: 5,
          feedback: '',
          email: '',
        });
        
        // Show toast instead of inline message
        toast.success(successMessage || "Thank you for your feedback!");
        
        if (onSubmitSuccess) {
          onSubmitSuccess(data);
        }
      } else {
        const errorMsg = errorMessage || 'Submission failed. Please try again.';
        toast.error(errorMsg);
        
        if (onSubmitError) {
          onSubmitError(new Error(errorMsg));
        } else {
          console.error('Form submission failed');
        }
      }
    } catch (error) {
      if (onSubmitError) {
        onSubmitError(error as Error);
      } else {
        console.error('Form submission error:', error);
        setSubmitStatus('error');
        setErrorMessage((error as Error).message || 'An unexpected error occurred');
      }
    }
  };

  return (
    <div className={cn(
      "w-full max-w-sm mx-auto rounded-xl p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm",
      styles.baseStyle?.container,
      className
    )}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-5", styles.baseStyle?.form)}>
        <div className={cn("flex justify-center", styles.elements?.ratingContainer)}>
          <div className={cn("bg-zinc-50 dark:bg-zinc-800 rounded-lg py-2 px-4 inline-flex", styles.elements?.ratingWrapper)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={cn(
                  "focus:outline-none px-1 transition-transform hover:scale-110 active:scale-95",
                  styles.elements?.starButton
                )}
                onClick={() => handleRatingChange(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(null)}
              >
                <StarIcon 
                  filled={hoveredRating !== null ? star <= hoveredRating : star <= currentRating}
                  className={cn(
                    "h-7 w-7 transition-all", 
                    styles.elements?.starIcon?.base,
                    (hoveredRating !== null ? star <= hoveredRating : star <= currentRating)
                      ? cn("text-yellow-400", styles.elements?.starIcon?.filled) 
                      : cn("text-zinc-300 dark:text-zinc-600", styles.elements?.starIcon?.empty)
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <div className={cn("relative", styles.elements?.email?.container)}>
          <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Email
          </label>
          <input
            id="email-input"
            type="email"
            {...form.register('email')}
            placeholder="your@email.com"
            required
            className={cn(
              "w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400 dark:focus:border-zinc-600",
              styles.elements?.email?.input
            )}
          />
          {form.formState.errors.email && (
            <p className={cn(
              "mt-1 text-sm text-red-500 dark:text-red-400",
              styles.typography?.errorText
            )} id="email-error" role="alert">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className={cn("relative", styles.elements?.textarea?.container)}>
          <label htmlFor="feedback-textarea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Feedback
          </label>
          <Textarea
            id="feedback-textarea"
            {...form.register('feedback')}
            placeholder={
              styles.typography?.feedbackPlaceholder || 
              feedbackPlaceholder || 
              "Tell us what you think..."
            }
            className={cn(
              "min-h-[120px] w-full resize-none rounded-lg bg-zinc-50 dark:bg-zinc-800 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-600",
              styles.elements?.textarea?.input
            )}
            variant={form.formState.errors.feedback ? "error" : "default"}
          />
          {form.formState.errors.feedback && (
            <p className={cn(
              "mt-1 text-sm text-red-500 dark:text-red-400",
              styles.typography?.errorText,
              styles.elements?.textarea?.error
            )}>
              {form.formState.errors.feedback.message}
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          className={cn(
            "w-full rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white font-medium transition-all", 
            styles.elements?.submitButton
          )}
          disabled={form.formState.isSubmitting}
        >
          <SendIcon className={cn("mr-2 h-4 w-4", styles.elements?.submitButtonIcon)} />
          <span className={cn(styles.elements?.submitButtonText)}>
            {styles.typography?.submitButtonText || 
             submitButtonText || 
             "Send Feedback"
            }
          </span>
        </Button>
      </form>
    </div>
  );
} 