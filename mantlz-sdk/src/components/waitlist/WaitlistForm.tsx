'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '../../utils/cn';
import { useMantlz } from '../../context/mantlzContext';
import { ApiKeyErrorCard } from '../ui/ApiKeyErrorCard';
import { WaitlistFormProps, WAITLIST_THEMES, WaitlistFormTheme } from './types';
import { processAppearance as processThemeAppearance } from './themeUtils';
import { processAppearance as processFlatAppearance } from '../shared/appearanceHandler';
import DynamicForm from '../shared/DynamicForm';

export type { WaitlistFormProps } from './types';
export { WAITLIST_THEMES };

export function WaitlistForm({ 
  formId,
  className = '',
  variant = "default",
  theme = 'default',
  appearance,
  showUsersJoined = false,
  usersJoinedLabel = 'people have already joined the waitlist',
  usersJoinedCount: initialUsersJoinedCount = 0,
  darkMode = false,
  baseTheme,
  onSuccess,
  onError,
}: WaitlistFormProps) {
  const [usersJoinedCount, setUsersJoinedCount] = useState(initialUsersJoinedCount);
  const [canShowUsersJoined, setCanShowUsersJoined] = useState(false);
  const { client } = useMantlz();
  const [apiKeyError, setApiKeyError] = useState(false);
  
  // Check if client is available
  useEffect(() => {
    setApiKeyError(!client);
  }, [client]);
  
  // Fetch and update users joined count
  useEffect(() => {
    if (!showUsersJoined || !client || !formId) return;
    
    const fetchUsersCount = async () => {
      try {
        const count = await client.getUsersJoinedCount(formId);
        if (count > 0) {
          setUsersJoinedCount(count);
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
  
  // Process appearance styles
  const styles = useMemo(() => {
    const themeToUse = (baseTheme || theme) as WaitlistFormTheme;
    let normalizedAppearance;
    
    if (typeof appearance === 'function') {
      normalizedAppearance = processFlatAppearance(appearance(themeToUse), themeToUse);
    } else {
      normalizedAppearance = processFlatAppearance({
        ...(appearance || {}),
        baseTheme: baseTheme || (appearance as any)?.baseTheme || theme
      }, themeToUse);
    }
    
    return processThemeAppearance(normalizedAppearance, theme);
  }, [appearance, theme, baseTheme]);

  if (apiKeyError) {
    return (
      <ApiKeyErrorCard 
        variant={variant} 
        className={className} 
        colorMode={darkMode ? "dark" : "light"} 
      />
    );
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <DynamicForm 
        formId={formId} 
        colorMode={darkMode ? 'dark' : 'light'}
        onSuccess={onSuccess}
        onError={onError}
        showUsersJoined={showUsersJoined && canShowUsersJoined}
        usersJoinedCount={usersJoinedCount}
        usersJoinedLabel={usersJoinedLabel}
        className={cn(
          styles.baseStyle?.container,
          styles.baseStyle?.background,
          styles.baseStyle?.border,
          styles.elements?.card
        )}
      />
    </div>
  );
}
