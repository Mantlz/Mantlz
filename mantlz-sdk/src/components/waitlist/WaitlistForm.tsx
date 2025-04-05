'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../utils/cn';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useMantlz } from '../../context/mantlzContext';
import { toast } from '../../utils/toast';
import { ApiKeyErrorCard } from '../ui/ApiKeyErrorCard';
import { waitlistSchema, WaitlistFormProps, WAITLIST_THEMES } from './types';
import { processAppearance } from './themeUtils';
import { z } from 'zod';

export type { WaitlistFormProps } from './types';
export { WAITLIST_THEMES };

export function WaitlistForm({ 
  formId,
  className = '',
  variant = "default",
  title = 'Join the Waitlist',
  description = 'Be the first to know when we launch. Get early access and exclusive updates.',
  nameLabel = 'Name',
  namePlaceholder = 'Enter your name',
  emailLabel = 'Email',
  emailPlaceholder = 'you@example.com',
  redirectUrl,
  theme = 'default',
  appearance,
  customSubmitText = 'Join Waitlist'
}: WaitlistFormProps) {
  const { client } = useMantlz();
  const [apiKeyError, setApiKeyError] = React.useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  
  React.useEffect(() => {
    if (!client) {
      setApiKeyError(true);
    }
  }, [client]);
  
  // Process appearance with the selected theme
  const styles = React.useMemo(() => {
    const processedStyles = processAppearance(appearance, theme);
    
    // Process aliases for more flexible styling
    if (processedStyles.elements) {
      // Button aliases
      if (processedStyles.elements.submitButton && !processedStyles.elements.formButtonPrimary) {
        processedStyles.elements.formButtonPrimary = processedStyles.elements.submitButton;
      }
      
      // Button icon aliases
      if (processedStyles.elements.buttonIcon && !processedStyles.elements.formButtonIcon) {
        processedStyles.elements.formButtonIcon = processedStyles.elements.buttonIcon;
      }
      
      // Input aliases
      if (processedStyles.elements.formInput && !processedStyles.elements.input) {
        processedStyles.elements.input = processedStyles.elements.formInput;
      }
      
      // Apply direct background/border styles to container
      if (processedStyles.elements.background && !processedStyles.baseStyle?.background) {
        if (!processedStyles.baseStyle) processedStyles.baseStyle = {};
        processedStyles.baseStyle.background = processedStyles.elements.background;
      }
      
      if (processedStyles.elements.border && !processedStyles.baseStyle?.border) {
        if (!processedStyles.baseStyle) processedStyles.baseStyle = {};
        processedStyles.baseStyle.border = processedStyles.elements.border;
      }
    }
    
    return processedStyles;
  }, [appearance, theme]);
  
  const form = useForm({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: '',
      name: '',
      referralSource: ''
    },
  });

  const onSubmit = async (data: z.infer<typeof waitlistSchema>) => {
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
      // Add empty referralSource since it's in the schema but not in the form UI
      const formData = {
        ...data,
        referralSource: ''
      };
      
      const response = await client.submitForm('waitlist', {
        formId,
        data: formData,
        redirectUrl
      });
      
      if (response.success) {
        form.reset();
        
        if (redirectUrl) {
          // Longer delay to ensure loading state is visible
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1500);
        } else {
          // Reset redirecting state if there's no redirect URL
          setIsRedirecting(false);
          // Success toast removed as requested
        }
      } else {
        setIsRedirecting(false);
        // Error is already handled by the client with toast
      }
    } catch (error) {
      setIsRedirecting(false);
      // All errors are handled by the client
    }
  };

  // Show API key error UI
  if (apiKeyError) {
    return <ApiKeyErrorCard 
      variant={variant} 
      className={className} 
      colorMode="light" 
    />;
  }

  return (
    <Card 
      variant={variant} 
      className={cn(
        "w-full max-w-md mx-auto", 
        styles.baseStyle?.container,
        styles.baseStyle?.background,
        styles.baseStyle?.border,
        styles.elements?.card,
        className
      )}
    >
      <CardHeader className={cn(styles.elements?.cardHeader)}>
        <CardTitle className={cn(styles.elements?.cardTitle)}>{title}</CardTitle>
        <CardDescription className={cn(styles.elements?.cardDescription)}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className={cn(styles.elements?.cardContent)}>
        {isRedirecting ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-5">
            <div className="relative">
              {/* Main spinner */}
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              
              {/* Seed animation effect */}
              <div className="absolute -inset-4">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="absolute w-2 h-2 rounded-full bg-primary/60 animate-ping" 
                       style={{ animationDelay: "0ms", animationDuration: "2s" }} />
                </div>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="absolute w-2 h-2 rounded-full bg-primary/60 animate-ping" 
                       style={{ animationDelay: "300ms", animationDuration: "2s", transform: "translateX(10px) translateY(10px)" }} />
                </div>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="absolute w-2 h-2 rounded-full bg-primary/60 animate-ping" 
                       style={{ animationDelay: "600ms", animationDuration: "2s", transform: "translateX(-12px) translateY(5px)" }} />
                </div>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="absolute w-2 h-2 rounded-full bg-primary/60 animate-ping" 
                       style={{ animationDelay: "900ms", animationDuration: "2s", transform: "translateX(8px) translateY(-10px)" }} />
                </div>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="absolute w-2 h-2 rounded-full bg-primary/60 animate-ping" 
                       style={{ animationDelay: "1200ms", animationDuration: "2s", transform: "translateX(-8px) translateY(-8px)" }} />
                </div>
              </div>
            </div>
            <p className="text-center font-medium text-gray-700 dark:text-gray-300">
              Seeding your information...
            </p>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Please wait, you will be redirected shortly
            </p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", styles.baseStyle?.form)}>
            <div className="space-y-2">
              <label className={cn("text-sm font-medium", styles.elements?.inputLabel)}>
                {nameLabel}
              </label>
              <Input
                {...form.register('name')}
                placeholder={namePlaceholder}
                variant={form.formState.errors.name ? "error" : "default"}
                className={cn(styles.elements?.input)}
              />
              {form.formState.errors.name && (
                <p className={cn("text-sm", styles.elements?.inputError)}>
                  {form.formState.errors.name.message}
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
              />
              {form.formState.errors.email && (
                <p className={cn("text-sm", styles.elements?.inputError)}>
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className={cn("w-full", styles.elements?.formButtonPrimary)}
              disabled={form.formState.isSubmitting || isRedirecting}
            >
              {isRedirecting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Seeding...</span>
                </div>
              ) : (
                <>
                  {customSubmitText}
                  <ArrowRight className={cn("ml-2 h-4 w-4", styles.elements?.formButtonIcon)} />
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
} 