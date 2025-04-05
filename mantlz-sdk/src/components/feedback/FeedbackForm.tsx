'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { cn } from '../../utils/cn';
import { Star, Loader2 } from 'lucide-react';
import { useMantlz } from '../../context/mantlzContext';
import { toast } from '../../utils/toast';
import { ApiKeyErrorCard } from '../ui/ApiKeyErrorCard';
import { feedbackSchema, FeedbackFormProps, FEEDBACK_THEMES, FeedbackFormTheme } from './types';
import { processAppearance } from './themeUtils';
import { processAppearance as processFlatAppearance } from '../shared/appearanceHandler';
import { z } from 'zod';

export type { FeedbackFormProps } from './types';
export { FEEDBACK_THEMES };

export function FeedbackForm({
  formId,
  className = '',
  variant = "default",
  title = 'Your Feedback',
  description = 'We\'d love to hear what you think about our service',
  ratingLabel = 'How would you rate your experience?',
  emailLabel = 'Email Address',
  emailPlaceholder = 'you@example.com',
  messageLabel = 'Your Message',
  messagePlaceholder = 'Tell us what you think...',
  redirectUrl,
  theme = 'default',
  darkMode = false,
  appearance,
  submitButtonText,
  baseTheme,
  onSubmitSuccess,
  onSubmitError,
}: FeedbackFormProps) {
  const { client } = useMantlz();
  const [apiKeyError, setApiKeyError] = useState<boolean>(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  
  React.useEffect(() => {
    if (!client) {
      setApiKeyError(true);
    }
  }, [client]);
  
  // Process appearance with the selected theme
  const styles = React.useMemo(() => {
    // First check if appearance is using the flatter format
    // or has baseTheme directly in FeedbackFormProps
    const themeToUse = (baseTheme || theme) as FeedbackFormTheme;
    
    const flatAppearance = typeof appearance === 'function'
      ? appearance(themeToUse)
      : {
          ...(appearance || {}),
          baseTheme: baseTheme || (appearance as any)?.baseTheme || theme
        };
    
    // Process the flat appearance first
    const normalizedAppearance = processFlatAppearance(flatAppearance, themeToUse);
    
    // Then process with theme styling
    return processAppearance(normalizedAppearance, themeToUse);
  }, [appearance, theme, baseTheme]);
  
  const form = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof feedbackSchema>) => {
    if (!client) {
      // We still need this one toast for the case when there's no client
      toast.error('Configuration Error', {
        description: 'API key not configured properly',
        duration: 3000
      });
      return;
    }
    
    // Set redirecting state immediately when form is submitted
    setIsRedirecting(true);
    
    try {
      const response = await client.submitForm('feedback', {
        formId,
        data,
        redirectUrl
      });
      
      if (response.success) {
        form.reset();
        
        if (onSubmitSuccess) {
          onSubmitSuccess(data);
        }
        
        if (redirectUrl) {
          // Longer delay to ensure loading state is visible
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1500);
        } else {
          // Reset redirecting state if there's no redirect URL
          setIsRedirecting(false);
        }
      } else {
        setIsRedirecting(false);
        // Error is already handled by the client with toast
        
        if (onSubmitError) {
          onSubmitError(new Error('Form submission failed'));
        }
      }
    } catch (error) {
      setIsRedirecting(false);
      // All errors are handled by the client
      
      if (onSubmitError) {
        onSubmitError(error);
      }
    }
  };

  // Show API key error UI
  if (apiKeyError) {
    return <ApiKeyErrorCard 
      variant={variant} 
      className={className} 
      colorMode={darkMode ? "dark" : "light"} 
    />;
  }
  
  // Render the star rating component
  const StarRating = () => {
    const watchedRating = form.watch("rating");
    
    return (
      <div className={cn(
        styles.elements?.ratingContainer || "flex gap-1 my-1"
      )}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            className={cn(
              (watchedRating >= rating || (hoveredRating !== null && hoveredRating >= rating)) 
                ? (styles.elements?.ratingStarActive || "text-amber-400 cursor-pointer transition-all duration-150 hover:text-amber-500 hover:scale-110")
                : (styles.elements?.ratingStarInactive || "text-zinc-300 cursor-pointer transition-all duration-150 hover:text-amber-300 hover:scale-110")
            )}
            onMouseEnter={() => setHoveredRating(rating)}
            onMouseLeave={() => setHoveredRating(null)}
            onClick={() => form.setValue("rating", rating)}
          >
            <Star 
              className="h-8 w-8"
              fill={(watchedRating >= rating || (hoveredRating !== null && hoveredRating >= rating)) ? "currentColor" : "none"}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card 
      variant={variant} 
      className={cn(
        "w-full max-w-md mx-auto", 
        darkMode ? 'dark' : '',
        styles.baseStyle?.container,
        styles.baseStyle?.background,
        styles.baseStyle?.border,
        styles.elements?.card,
        className
      )}
      colorMode={darkMode ? "dark" : "light"}
    >
      <CardHeader className={cn(styles.elements?.cardHeader)}>
        <CardTitle className={cn(styles.elements?.cardTitle)}>{title}</CardTitle>
        <CardDescription className={cn(styles.elements?.cardDescription)}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className={cn(styles.elements?.cardContent)}>
        {isRedirecting ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="relative">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <div className="absolute inset-0 animate-ping opacity-30 rounded-full bg-primary/20"></div>
            </div>
            <p className="text-center font-medium text-gray-700 dark:text-gray-300">
              Submitting your feedback...
            </p>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Please wait, you will be redirected shortly
            </p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", styles.baseStyle?.form)}>
            <div className="space-y-2">
              <label className={cn("text-sm font-medium", styles.elements?.inputLabel)}>
                {ratingLabel}
              </label>
              <input
                type="hidden"
                {...form.register('rating', { valueAsNumber: true })}
              />
              <StarRating />
              {form.formState.errors.rating && (
                <p className={cn("text-sm", styles.elements?.inputError)}>
                  {form.formState.errors.rating.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className={cn("text-sm font-medium", styles.elements?.inputLabel)}>
                {emailLabel}
              </label>
              <Input
                {...form.register('email')}
                placeholder={emailPlaceholder}
                type="email"
                variant={form.formState.errors.email ? "error" : "default"}
                className={cn(styles.elements?.input)}
                colorMode={darkMode ? "dark" : "light"}
              />
              {form.formState.errors.email && (
                <p className={cn("text-sm", styles.elements?.inputError)}>
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className={cn("text-sm font-medium", styles.elements?.inputLabel)}>
                {messageLabel}
              </label>
              <Textarea
                {...form.register('message')}
                placeholder={messagePlaceholder || styles.typography?.feedbackPlaceholder}
                variant={form.formState.errors.message ? "error" : "default"}
                className={cn(styles.elements?.textarea)}
                colorMode={darkMode ? "dark" : "light"}
              />
              {form.formState.errors.message && (
                <p className={cn("text-sm", styles.elements?.inputError)}>
                  {form.formState.errors.message.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className={cn(
                "w-full",
                styles.elements?.submitButton || styles.elements?.formButtonPrimary
              )}
              disabled={form.formState.isSubmitting}
              colorMode={darkMode ? "dark" : "light"}
            >
              {form.formState.isSubmitting 
                ? "Submitting..." 
                : submitButtonText || styles.typography?.submitButtonText || "Submit Feedback"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
} 