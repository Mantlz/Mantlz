import React from 'react';

export function useColorScheme(darkModeOverride?: boolean): 'light' | 'dark' {
  const [colorScheme, setColorScheme] = React.useState<'light' | 'dark'>(
    darkModeOverride === true ? 'dark' : darkModeOverride === false ? 'light' : 'light'
  );
  
  React.useEffect((): (() => void) | undefined => {
    // If darkMode is explicitly set, don't detect from system
    if (darkModeOverride !== undefined) {
      setColorScheme(darkModeOverride ? 'dark' : 'light');
      return undefined;
    }
    
    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      // Initial color scheme
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches ||
                       document.documentElement.classList.contains('dark');
      setColorScheme(isDarkMode ? 'dark' : 'light');
      
      // Create media query to detect preference changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Handler for preference changes
      const handleChange = (e: MediaQueryListEvent) => {
        setColorScheme(e.matches ? 'dark' : 'light');
      };
      
      // Add event listener
      mediaQuery.addEventListener('change', handleChange);
      
      // Cleanup
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    return undefined;
  }, [darkModeOverride]);
  
  return colorScheme;
} 