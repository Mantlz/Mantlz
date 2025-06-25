import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial theme preference
    const checkDarkMode = () => {
      // Check for system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Check for stored preference
      const storedTheme = localStorage.getItem('theme');
      
      // Check for data-theme attribute on html or body
      const htmlTheme = document.documentElement.getAttribute('data-theme');
      const bodyTheme = document.body.getAttribute('data-theme');
      
      // Check for class-based dark mode
      const hasDarkClass = document.documentElement.classList.contains('dark') || 
                          document.body.classList.contains('dark');
      
      // Priority: stored preference > html/body attributes > class > system preference
      if (storedTheme) {
        setIsDarkMode(storedTheme === 'dark');
      } else if (htmlTheme) {
        setIsDarkMode(htmlTheme === 'dark');
      } else if (bodyTheme) {
        setIsDarkMode(bodyTheme === 'dark');
      } else if (hasDarkClass) {
        setIsDarkMode(true);
      } else {
        setIsDarkMode(systemPrefersDark);
      }
    };

    // Initial check
    checkDarkMode();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => checkDarkMode();
    mediaQuery.addEventListener('change', handleChange);

    // Listen for storage changes (theme switching in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        checkDarkMode();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Listen for attribute changes on document
    const observer = new MutationObserver(() => {
      checkDarkMode();
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('storage', handleStorageChange);
      observer.disconnect();
    };
  }, []);

  return isDarkMode;
};