'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { cn } from '../../utils/cn';
import { Send, Loader2 } from 'lucide-react';
import { useMantlz } from '../../context/mantlzContext';
import { toast } from '../../utils/toast';
import { ApiKeyErrorCard } from '../ui/ApiKeyErrorCard';
import { contactSchema, ContactFormProps, CONTACT_THEMES, ContactFormTheme } from './types';
import { processAppearance as processThemeAppearance } from './themeUtils';
import { processAppearance as processFlatAppearance } from '../shared/appearanceHandler';
import { z } from 'zod';

export type { ContactFormProps } from './types';
export { CONTACT_THEMES };

export function ContactForm({ 
  formId,
  className = '',
  variant = "default",
  title = 'Contact Us',
  description = 'Fill out the form below and we\'ll get back to you as soon as possible.',
  nameLabel = 'Name',
  namePlaceholder = 'Enter your name',
  emailLabel = 'Email',
  emailPlaceholder = 'you@example.com',
  subjectLabel = 'Subject',
  subjectPlaceholder = 'What is your message about?',
  messageLabel = 'Message',
  messagePlaceholder = 'Please provide details about your inquiry',
  redirectUrl,
  theme = 'default',
  appearance,
  customSubmitText = 'Send Message',
  baseTheme,
}: ContactFormProps) {
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
    // First check if appearance is using the flatter format
    // or has baseTheme directly in ContactFormProps
    const themeToUse = (baseTheme || theme) as ContactFormTheme;
    
    const flatAppearance = typeof appearance === 'function'
      ? appearance(themeToUse)
      : {
          ...(appearance || {}),
          baseTheme: baseTheme || (appearance as any)?.baseTheme || theme
        };
    
    // Process the flat appearance first
    const normalizedAppearance = processFlatAppearance(flatAppearance, themeToUse);
    
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
      
      // Textarea aliases
      if (processedStyles.elements.formTextarea && !processedStyles.elements.textarea) {
        processedStyles.elements.textarea = processedStyles.elements.formTextarea;
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
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof contactSchema>) => {
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
      const response = await client.submitForm('contact', {
        formId,
        data,
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
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="relative">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <div className="absolute inset-0 animate-ping opacity-30 rounded-full bg-primary/20"></div>
            </div>
            <p className="text-center font-medium text-gray-700 dark:text-gray-300">
              Submitting your message...
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

            <div className="space-y-2">
              <label className={cn("text-sm font-medium", styles.elements?.inputLabel)}>
                {subjectLabel}
              </label>
              <Input
                {...form.register('subject')}
                placeholder={subjectPlaceholder}
                variant={form.formState.errors.subject ? "error" : "default"}
                className={cn(styles.elements?.input)}
              />
              {form.formState.errors.subject && (
                <p className={cn("text-sm", styles.elements?.inputError)}>
                  {form.formState.errors.subject.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className={cn("text-sm font-medium", styles.elements?.inputLabel)}>
                {messageLabel}
              </label>
              <Textarea
                {...form.register('message')}
                placeholder={messagePlaceholder}
                variant={form.formState.errors.message ? "error" : "default"}
                className={cn(styles.elements?.textarea)}
              />
              {form.formState.errors.message && (
                <p className={cn("text-sm", styles.elements?.inputError)}>
                  {form.formState.errors.message.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={form.formState.isSubmitting || isRedirecting}
              className={cn(styles.elements?.formButtonPrimary)}
            >
              {isRedirecting ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full" />
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className={cn("mr-2 h-4 w-4", styles.elements?.formButtonIcon)} />
                  <span>{customSubmitText}</span>
                </div>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
} 