'use client';

import React from 'react';
import { cn } from '../../utils/cn';
import { useMantlz } from '../../context/mantlzContext';
import { ApiKeyErrorCard } from '../ui/ApiKeyErrorCard';
import { FeedbackFormProps, FEEDBACK_THEMES, FeedbackFormTheme } from './types';
import { processAppearance } from './themeUtils';
import { processAppearance as processFlatAppearance } from '../shared/appearanceHandler';
import DynamicForm from '../shared/DynamicForm';

export type { FeedbackFormProps } from './types';
export { FEEDBACK_THEMES };

export function FeedbackForm({
  formId,
  className = '',
  variant = "default",
  theme = 'default',
  darkMode = false,
  appearance,
  baseTheme,
  //onSubmitSuccess,
  onSubmitError,
  //...rest // Capture other props we're not using
}: FeedbackFormProps) {
  const { client } = useMantlz();
  const [apiKeyError, setApiKeyError] = React.useState<boolean>(false);
  
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

  // Show API key error UI
  if (apiKeyError) {
    return <ApiKeyErrorCard 
      variant={variant} 
      className={className} 
      colorMode={darkMode ? "dark" : "light"} 
    />;
  }

  return (
    <DynamicForm 
      formId={formId} 
      colorMode={darkMode ? 'dark' : 'light'}
      //onSuccess={onSubmitSuccess}
      onError={onSubmitError}
      className={cn(
        "w-full max-w-md mx-auto", 
        darkMode ? 'dark' : '',
        styles.baseStyle?.container,
        styles.baseStyle?.background,
        styles.baseStyle?.border,
        styles.elements?.card,
        className
      )}
    />
  );
} 