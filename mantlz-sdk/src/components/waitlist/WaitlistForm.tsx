'use client';

import React, { useState, useEffect } from 'react';
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
import { waitlistSchema, WaitlistFormProps, WAITLIST_THEMES, WaitlistFormTheme } from './types';
import { processAppearance as processThemeAppearance } from './themeUtils';
import { processAppearance as processFlatAppearance } from '../shared/appearanceHandler';
import { z } from 'zod';

// Custom fadeIn animation styles
const fadeInAnimation = "opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]";
const fadeInKeyframes = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export type { WaitlistFormProps } from './types';
export { WAITLIST_THEMES };

export function WaitlistForm({ 
  formId,
  className = '',
  variant = "default",
  title = '',
  description = '',
  nameLabel = 'Name',
  namePlaceholder = 'Enter your name',
  emailLabel = 'Email',
  emailPlaceholder = 'contact@mantlz.com',
  redirectUrl,
  theme = 'default',
  appearance,
  customSubmitText = 'Join Waitlist',
  showUsersJoined = false,
  usersJoinedLabel = 'Joined',
  usersJoinedCount: initialUsersJoinedCount = 0,
  darkMode = false,
  baseTheme,
}: WaitlistFormProps) {
  const [redirecting, setRedirecting] = useState(false);
  const [usersJoinedCount, setUsersJoinedCount] = useState(initialUsersJoinedCount);
  const [canShowUsersJoined, setCanShowUsersJoined] = useState(false);
  const { client } = useMantlz();
  const [apiKeyError, setApiKeyError] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    if (!client) {
      setApiKeyError(true);
    }
    return undefined;
  }, [client]);
  
  // Fetch users joined count from API if showUsersJoined is true
  useEffect(() => {
    if (showUsersJoined && client && formId) {
      // Set a loading state if needed
      const fetchUsersCount = async () => {
        try {
          // Fetch the count from the API
          const count = await client.getUsersJoinedCount(formId);
          if (count > 0) {
            setUsersJoinedCount(count);
            setCanShowUsersJoined(true);
          }
        } catch (error) {
          console.error('Failed to fetch users joined count:', error);
          // Keep initial count on error
        }
      };
      
      // Fetch immediately on mount
      fetchUsersCount();
      
      // Then set up an interval to refresh periodically
      const intervalId = setInterval(fetchUsersCount, 60000); // Refresh every minute
      
      // Clean up the interval on unmount
      return () => clearInterval(intervalId);
    }
    return undefined; // Return for when conditions aren't met
  }, [showUsersJoined, formId, client]);
  
  // Process appearance with the selected theme
  const styles = React.useMemo(() => {
    // First check if appearance is using the flatter format
    // or has baseTheme directly in WaitlistFormProps
    const themeToUse = (baseTheme || theme) as WaitlistFormTheme;
    
    // Handle different appearance types and convert to a consistent format
    let normalizedAppearance;
    
    if (typeof appearance === 'function') {
      normalizedAppearance = processFlatAppearance(appearance(themeToUse), themeToUse);
    } else {
      normalizedAppearance = processFlatAppearance({
        ...(appearance || {}),
        baseTheme: baseTheme || (appearance as any)?.baseTheme || theme
      }, themeToUse);
    }
    
    // Then process with theme styling
    const processedStyles = processThemeAppearance(normalizedAppearance, theme);
    
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
  }, [appearance, theme, baseTheme]);
  
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
    setRedirecting(true);
    
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
          setRedirecting(false);
          // Success toast removed as requested
        }
      } else {
        setRedirecting(false);
        // Error is already handled by the client with toast
      }
    } catch (error) {
      setRedirecting(false);
      // All errors are handled by the client
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

  // Use Card component for the container
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
      {/* Add style tag for keyframes */}
      <style dangerouslySetInnerHTML={{ __html: fadeInKeyframes }} />
      
      <CardHeader className={cn(styles.elements?.cardHeader)}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={cn(styles.elements?.cardTitle)}>{title}</CardTitle>
            <CardDescription className={cn(styles.elements?.cardDescription)}>
              {description}
            </CardDescription>
          </div>
          
          {/* Users Joined Counter (Premium Feature) - Fixed truncation issue */}
          {showUsersJoined && canShowUsersJoined && usersJoinedCount > 0 && (
            <div className={cn(
              "inline-flex items-center justify-center px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium",
              "transition-all duration-300 ease-in-out",
              "hover:shadow-md transform hover:-translate-y-0.5",
              "relative whitespace-nowrap min-w-[90px] w-auto",
              fadeInAnimation,
              styles.elements?.usersJoinedCounter ||
              (darkMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 
               'bg-blue-50 text-blue-700 border border-blue-100')
            )}>
              <span className="font-bold text-base">{usersJoinedCount.toLocaleString()}</span>
              <span className="ml-1.5 mr-0.5 opacity-100 font-medium">{usersJoinedLabel}</span>
              <span className="absolute inset-0 bg-white dark:bg-black opacity-0 hover:opacity-10 transition-opacity duration-300 ease-in-out"></span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className={cn(styles.elements?.cardContent)}>
        {redirecting ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              Please wait, you will be redirected shortly
            </p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", styles.baseStyle?.form)}>
            {/* Only include name field if the nameLabel is provided */}
            {nameLabel && (
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
                  <p className={cn("text-sm text-destructive", styles.elements?.inputError)}>
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
            )}

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
                <p className={cn("text-sm text-destructive", styles.elements?.inputError)}>
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className={cn("w-full mt-2 cursor-pointer", styles.elements?.formButtonPrimary)}
              disabled={form.formState.isSubmitting || redirecting}
            >
              {redirecting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Processing...</span>
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