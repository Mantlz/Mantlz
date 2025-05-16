import { BaseTheme, SimpleAppearance } from './types';
import { getBaseTheme } from './baseThemes';

/**
 * Detect if a value is a SimpleAppearance object
 */
function isSimpleAppearance(obj: any): obj is SimpleAppearance {
  return obj && typeof obj === 'object' && !Array.isArray(obj) &&
    Object.keys(obj).some(key => 
      ['container', 'input', 'textarea', 'button', 'label', 'background', 'border'].includes(key)
    );
}

/**
 * Process appearance settings to generate the final styles
 * 
 * @param appearance - The appearance object or function provided by the user
 * @param theme - The selected theme
 * @param colorMode - The current color mode (light or dark)
 * @returns The processed styles for the component
 */
export function processStyles(
  appearance: SimpleAppearance | ((theme: BaseTheme) => SimpleAppearance) | any,
  theme: BaseTheme = 'default',
  colorMode: 'light' | 'dark' = 'light'
) {
  // Get base theme styles
  const baseThemeStyles = getBaseTheme(theme, colorMode);
  
  // If no appearance, just return the base theme
  if (!appearance) {
    return baseThemeStyles;
  }
  
  // If appearance is a function, call it with the theme
  const appearanceObj = typeof appearance === 'function'
    ? appearance(theme)
    : appearance;
  
  // If simple appearance, normalize it first
  if (isSimpleAppearance(appearanceObj)) {
    // Simple flat appearance - merge with base theme first
    const mergedStyles = { ...baseThemeStyles, ...appearanceObj };
    return mergedStyles;
  }
  
  // Otherwise, it's already the complex appearance format
  // Handle it separately according to the component's needs
  return appearanceObj;
}

/**
 * Detect user's preferred color scheme
 */
export function useColorScheme(override?: boolean): 'light' | 'dark' {
  if (override !== undefined) {
    return override ? 'dark' : 'light';
  }
  
  // Browser environment
  if (typeof window !== 'undefined' && window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  
  return 'light';
} 