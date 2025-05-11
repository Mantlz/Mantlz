'use client';

import React from 'react';
import { cn } from '../../utils/cn';
import { useMantlz } from '../../context/mantlzContext';
import { ApiKeyErrorCard } from '../ui/ApiKeyErrorCard';
import { ContactFormProps, CONTACT_THEMES, ContactFormTheme } from './types';
import { processAppearance as processThemeAppearance } from './themeUtils';
import { processAppearance as processFlatAppearance } from '../shared/appearanceHandler';
import DynamicForm from '../shared/DynamicForm';

export type { ContactFormProps } from './types';
export { CONTACT_THEMES };

export function ContactForm({ 
  formId,
  className = '',
  variant = "default",
  theme = 'default',
  appearance,
  darkMode = false,
  baseTheme,
  onSuccess,
  onError,
  //...rest // Capture other props we're not using
}: ContactFormProps) {
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
    return processThemeAppearance(normalizedAppearance, theme);
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
      onSuccess={onSuccess}
      onError={onError}
      className={cn(
        "w-full max-w-md mx-auto",
        styles.baseStyle?.container,
        styles.baseStyle?.background,
        styles.baseStyle?.border,
        styles.elements?.card,
        className
      )}
    />
  );
} 