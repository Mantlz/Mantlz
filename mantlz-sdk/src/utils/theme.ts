// src/utils/theme-utils.ts

/**
 * Theme structure type for providing type safety and autocompletion
 */
export interface ThemeOptions {
    card: {
      default: {
        container: string;
        header: string;
        title: string;
        description: string;
        content: string;
        footer: string;
      };
      glass: {
        container: string;
        header: string;
        title: string;
        description: string;
        content: string;
        footer: string;
      };
      error: {
        container: string;
        header: string;
        title: string;
        description: string;
        content: string;
        footer: string;
      };
      success: {
        container: string;
        header: string;
        title: string;
        description: string;
        content: string;
        footer: string;
      };
    };
    button?: {
      // You can expand this with button variants as needed
      primary?: string;
      secondary?: string;
      outline?: string;
      ghost?: string;
      link?: string;
    };
    input?: {
      // Input field theming
      default?: string;
      error?: string;
      disabled?: string;
    };
    // Add more component theme options as needed
  }
  
  /**
   * Creates a theme configuration object with type safety
   * @param options Theme options to configure
   * @returns A typed theme object
   */
  export function createTheme(options: ThemeOptions): ThemeOptions {
    return options;
  }
  
  /**
   * Merges two themes, with the second theme overriding properties from the first
   * @param baseTheme The base theme to extend
   * @param overrideTheme Theme properties that should override the base theme
   * @returns A new merged theme
   */
  export function extendTheme(baseTheme: ThemeOptions, overrideTheme: ThemeOptions): ThemeOptions {
    return deepMerge(baseTheme, overrideTheme);
  }
  
  /**
   * Helper for deep merging two objects
   */
  function deepMerge(target: any, source: any): any {
    const output = { ...target };
    
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    
    return output;
  }
  
  /**
   * Helper to check if a value is an object
   */
  function isObject(item: any): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }
  
  /**
   * Creates a context-aware theme that can adapt based on context values
   * @param lightTheme The light mode theme
   * @param darkTheme The dark mode theme
   * @returns A function that returns the appropriate theme based on mode
   */
  export function createResponsiveTheme(lightTheme: ThemeOptions, darkTheme: ThemeOptions) {
    return (mode: 'light' | 'dark') => {
      return mode === 'light' ? lightTheme : darkTheme;
    };
  }
  
  /**
   * Utility to get a deeply nested theme property with a fallback
   * @param theme The theme object
   * @param path Path to the property (e.g., 'card.default.container')
   * @param fallback Fallback value if the property doesn't exist
   * @returns The theme property or fallback
   */
  export function getThemeValue(theme: ThemeOptions, path: string, fallback?: string): string | undefined {
    const parts = path.split('.');
    let current: any = theme;
    
    for (const part of parts) {
      if (current === undefined || current === null) {
        return fallback;
      }
      current = current[part];
    }
    
    return current !== undefined ? current : fallback;
  }