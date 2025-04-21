'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { useMantlz } from '../../context/mantlzContext';
import { ApiKeyErrorCard } from '../ui/ApiKeyErrorCard';
import { WaitlistFormProps, WAITLIST_THEMES, WaitlistFormTheme } from './types';
import { processAppearance as processThemeAppearance } from './themeUtils';
import { processAppearance as processFlatAppearance } from '../shared/appearanceHandler';
import DynamicForm from '../shared/DynamicForm';

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
  theme = 'default',
  appearance,
  showUsersJoined = false,
  usersJoinedLabel = 'Joined',
  usersJoinedCount: initialUsersJoinedCount = 0,
  darkMode = false,
  baseTheme,
  onSuccess,
  onError,
  //...rest // Capture other props we're not using
}: WaitlistFormProps) {
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

  // Use Card component for the container with users joined feature
  return (
    <div className={cn("w-full max-w-md mx-auto flex flex-col items-end", className)}>
      {/* Add style tag for keyframes */}
      <style dangerouslySetInnerHTML={{ __html: fadeInKeyframes }} />
      
      {/* Users Joined Counter (Premium Feature) - Moved and repositioned */}
      {showUsersJoined && canShowUsersJoined && usersJoinedCount > 0 && (
        <div className={cn(
          "mb-2", 
          "inline-flex items-center justify-center px-3 py-1 rounded-md shadow-sm text-xs font-medium",
          "transition-all duration-300 ease-in-out",
          "hover:shadow-md",
          fadeInAnimation,
          styles.elements?.usersJoinedCounter ||
          (darkMode ? 'bg-zinc-700 text-zinc-100 border border-zinc-600' : 
                     'bg-gray-100 text-gray-700 border border-gray-200')
        )}>
          <span className="font-bold mr-1">{usersJoinedCount}</span> {usersJoinedLabel}
        </div>
      )}
      
      {/* DynamicForm renders the main card */}
      <DynamicForm 
        formId={formId} 
        colorMode={darkMode ? 'dark' : 'light'}
        onSuccess={onSuccess}
        onError={onError}
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