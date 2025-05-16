import { BaseFormTheme, FormAppearance } from './types';

// Default styles for each theme
const defaultThemeStyles: Record<BaseFormTheme, FormAppearance> = {
  default: {
    baseStyle: {
      container: 'w-full',
      background: 'bg-white dark:bg-zinc-900',
      border: 'border border-zinc-200 dark:border-zinc-800',
      text: 'text-zinc-900 dark:text-white'
    },
    elements: {
      card: 'rounded-lg shadow-sm',
      input: 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700',
      button: 'bg-primary hover:bg-primary/90',
      label: 'text-zinc-700 dark:text-zinc-300',
      error: 'text-red-500'
    }
  },
  minimal: {
    baseStyle: {
      container: 'w-full',
      background: 'bg-transparent',
      border: 'border-none',
      text: 'text-zinc-900 dark:text-white'
    },
    elements: {
      card: 'shadow-none',
      input: 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700',
      button: 'bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200',
      label: 'text-zinc-700 dark:text-zinc-300',
      error: 'text-red-500'
    }
  },
  modern: {
    baseStyle: {
      container: 'w-full',
      background: 'bg-white dark:bg-zinc-900',
      border: 'border-2 border-black dark:border-white',
      text: 'text-zinc-900 dark:text-white'
    },
    elements: {
      card: 'rounded-xl shadow-lg',
      input: 'bg-zinc-50 dark:bg-zinc-800 border-2 border-black dark:border-white',
      button: 'bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200',
      label: 'font-medium text-black dark:text-white',
      error: 'text-red-500 font-medium'
    }
  },
  classic: {
    baseStyle: {
      container: 'w-full',
      background: 'bg-white dark:bg-zinc-900',
      border: 'border border-zinc-300 dark:border-zinc-700',
      text: 'text-zinc-900 dark:text-white'
    },
    elements: {
      card: 'rounded-md shadow',
      input: 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      label: 'text-zinc-700 dark:text-zinc-300',
      error: 'text-red-600'
    }
  }
};

export function processAppearance(
  appearance: FormAppearance | ((theme: BaseFormTheme) => FormAppearance) | undefined,
  theme: BaseFormTheme = 'default'
): FormAppearance {
  // Get the default theme styles
  const defaultStyles = defaultThemeStyles[theme] || defaultThemeStyles.default;
  
  // If no appearance is provided, return default theme styles
  if (!appearance) {
    return defaultStyles;
  }
  
  // If appearance is a function, call it with the theme
  const customStyles = typeof appearance === 'function' 
    ? appearance(theme)
    : appearance;
  
  // Merge custom styles with default theme styles
  return {
    baseStyle: {
      ...defaultStyles.baseStyle,
      ...customStyles.baseStyle,
    },
    elements: {
      ...defaultStyles.elements,
      ...customStyles.elements,
    },
    baseTheme: customStyles.baseTheme || theme,
  };
} 