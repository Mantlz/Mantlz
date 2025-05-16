'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../utils/cn';
import { useMantlz } from '../../context/mantlzContext';
import { ApiKeyErrorCard } from '../ui/ApiKeyErrorCard';
// import { toast } from '../../utils/toast';
import { MantlzProps } from './types';
import { StarRating } from './components/StarRating';
import { FormField } from './components/FormField';
import { useFormLogic } from './hooks/useFormLogic';
import { getThemeClasses } from './themes';

// Animation styles
const fadeInAnimation = "opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]";
const fadeInKeyframes = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export default function Mantlz({
  formId,
  className,
  showUsersJoined = false,
  usersJoinedCount: initialUsersJoinedCount = 0,
  usersJoinedLabel = 'people have joined',
  redirectUrl,
  theme = 'default',
}: MantlzProps) {
  const { client, apiKey } = useMantlz();
  const [starRating, setStarRating] = useState(0);
  const [usersJoined, setUsersJoined] = useState(initialUsersJoinedCount);
  const [canShowUsersJoined, setCanShowUsersJoined] = useState(false);

  if (!formId) {
    return (
      <Card className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
        <CardHeader>
          <CardTitle className="text-red-500">Form Error</CardTitle>
          <CardDescription>Form ID is required</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Get theme classes
  const themeClasses = getThemeClasses(theme);

  // Use form logic hook
  const {
    formData,
    loading,
    submitting,
    submitted,
    fields,
    formMethods,
    onSubmit,
    isMounted,
  } = useFormLogic(formId, client, apiKey, redirectUrl);

  // Fetch users joined count
  React.useEffect(() => {
    if (!showUsersJoined || !client || !formId) return;
    
    const fetchUsersCount = async () => {
      try {
        const count = await client.getUsersJoinedCount(formId);
        if (count > 0) {
          setUsersJoined(count);
          setCanShowUsersJoined(true);
        }
      } catch (error) {
        console.error('Failed to fetch users joined count:', error);
      }
    };
    
    fetchUsersCount();
    const intervalId = setInterval(fetchUsersCount, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, [showUsersJoined, formId, client]);

  // Render loading state
  if (!isMounted || loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render API key error
  if (!apiKey) {
    return <ApiKeyErrorCard />;
  }

  // Render form error
  if (!formData || fields.length === 0) {
    return (
      <Card className={cn(themeClasses.bg, themeClasses.border, className)}>
        <CardHeader>
          <CardTitle className={themeClasses.text}>Form Error</CardTitle>
          <CardDescription className={themeClasses.description}>
            {loading ? 'Loading form...' : 'Form configuration is missing or empty.'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Render success message after submission
  if (submitted) {
    return (
      <Card className={cn("mantlz-form", themeClasses.bg, themeClasses.border, className)}>
        <CardHeader>
          <CardTitle className={themeClasses.text}>Thank You!</CardTitle>
          <CardDescription className={themeClasses.description}>
            Your submission has been received.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Main form render
  return (
    <Card className={cn(
      "mantlz-form",
      themeClasses.bg,
      themeClasses.border,
      className
    )}>
      <style dangerouslySetInnerHTML={{ __html: fadeInKeyframes }} />
      
      <CardHeader>
        <CardTitle className={themeClasses.text}>{formData?.title || formData?.name}</CardTitle>
        {formData?.description && (
          <CardDescription className={themeClasses.description}>
            {formData.description}
          </CardDescription>
        )}
        
        {showUsersJoined && canShowUsersJoined && usersJoined > 0 && (
          <div className={cn(
            "inline-flex items-center justify-center mt-2 font-medium",
            "transition-all duration-300 ease-in-out",
            fadeInAnimation,
          )}>
            <span className="font-bold mr-1">{usersJoined}</span> {usersJoinedLabel}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-2">
          {fields.map((field) => (
            <FormField
              key={field.id}
              field={field}
              formMethods={formMethods}
              themeClasses={themeClasses}
            />
          ))}
          
          {formData.formType === 'feedback' && (
            <div>
              <label className={cn('block text-sm font-medium mb-1', themeClasses.label)}>
                Rating<span className="text-red-500">*</span>
              </label>
              <StarRating 
                rating={starRating} 
                setRating={setStarRating}
              />
              {formMethods.formState.errors.rating && (
                <p className={cn("text-sm mt-1", themeClasses.error)}>
                  {formMethods.formState.errors.rating?.message as string}
                </p>
              )}
            </div>
          )}
          
          <Button
            type="submit"
            className={cn("w-full", themeClasses.button)}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
