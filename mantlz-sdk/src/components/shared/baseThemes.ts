import { BaseTheme } from './types';

/**
 * Pre-built themes for all form components
 * Each theme contains styling for both light and dark mode
 */

// Default theme styles (clean white design)
const defaultTheme = {
  light: {
    container: 'bg-white rounded-lg shadow-sm',
    form: 'space-y-4',
    input: 'bg-zinc-50 border border-zinc-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900',
    textarea: 'bg-zinc-50 border border-zinc-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 min-h-[120px]',
    button: 'bg-zinc-600 hover:bg-zinc-700 text-white font-medium rounded-lg shadow-sm',
    label: 'text-gray-700 text-sm font-medium',
    title: 'text-xl font-bold text-gray-900',
    description: 'text-gray-500 text-sm',
    errorText: 'text-red-500 text-sm',
    starIconFilled: 'text-yellow-400',
    starIconEmpty: 'text-gray-300'
  },
  dark: {
    container: 'bg-zinc-800  rounded-lg shadow-md',
    form: 'space-y-4',
    input: 'bg-zinc-700 border border-zinc-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder:text-gray-400',
    textarea: 'bg-zinc-700 border border-zinc-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder:text-gray-400 min-h-[120px]',
    button: 'bg-zinc-600 hover:bg-zinc-700 text-white font-medium rounded-lg shadow-sm',
    label: 'text-gray-300 text-sm font-medium',
    title: 'text-xl font-bold text-white',
    description: 'text-gray-400 text-sm',
    errorText: 'text-red-400 text-sm',
    starIconFilled: 'text-yellow-500',
    starIconEmpty: 'text-gray-600'
  }
};

// Dark theme styles (dark mode focused)
const darkTheme = {
  light: {
    container: 'bg-zinc-900  rounded-lg shadow-lg',
    form: 'space-y-4',
    input: 'bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white placeholder:text-gray-400',
    textarea: 'bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white placeholder:text-gray-400 min-h-[120px]',
    button: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm',
    label: 'text-gray-300 text-sm font-medium',
    title: 'text-xl font-bold text-white',
    description: 'text-gray-400 text-sm',
    errorText: 'text-red-400 text-sm',
    starIconFilled: 'text-indigo-400',
    starIconEmpty: 'text-gray-700'
  },
  dark: {
    container: 'bg-zinc-900 rounded-lg shadow-lg',
    form: 'space-y-4',
    input: 'bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white placeholder:text-gray-400',
    textarea: 'bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white placeholder:text-gray-400 min-h-[120px]',
    button: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm',
    label: 'text-gray-300 text-sm font-medium',
    title: 'text-xl font-bold text-white',
    description: 'text-gray-400 text-sm',
    errorText: 'text-red-400 text-sm',
    starIconFilled: 'text-indigo-400',
    starIconEmpty: 'text-gray-700'
  }
};

// Purple theme styles
const purpleTheme = {
  light: {
    container: 'bg-white  rounded-lg shadow-sm',
    form: 'space-y-4',
    input: 'bg-purple-50 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-900',
    textarea: 'bg-purple-50 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-900 min-h-[120px]',
    button: 'bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm',
    label: 'text-purple-700 text-sm font-medium',
    title: 'text-xl font-bold text-purple-900',
    description: 'text-purple-500 text-sm',
    errorText: 'text-red-500 text-sm',
    starIconFilled: 'text-purple-500',
    starIconEmpty: 'text-purple-200'
  },
  dark: {
    container: 'bg-zinc-800  rounded-lg shadow-md',
    form: 'space-y-4',
    input: 'bg-zinc-700 border border-purple-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white placeholder:text-gray-400',
    textarea: 'bg-zinc-700 border border-purple-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white placeholder:text-gray-400 min-h-[120px]',
    button: 'bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm',
    label: 'text-purple-300 text-sm font-medium',
    title: 'text-xl font-bold text-purple-300',
    description: 'text-purple-400 text-sm',
    errorText: 'text-red-400 text-sm',
    starIconFilled: 'text-purple-400',
    starIconEmpty: 'text-purple-900'
  }
};

// Neobrutalism theme styles (fun, cartoon-like UI)
const neobrutalism = {
  light: {
    container: 'bg-yellow-100  rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    form: 'space-y-4',
    input: 'bg-white border-4 border-black rounded-none focus:ring-0 focus:border-black text-black font-mono',
    textarea: 'bg-white border-4 border-black rounded-none focus:ring-0 focus:border-black text-black font-mono min-h-[120px]',
    button: 'bg-zinc-500 hover:bg-zinc-400 text-black font-bold rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all',
    label: 'text-black text-lg font-bold uppercase',
    title: 'text-2xl font-black text-black uppercase',
    description: 'text-black text-base font-medium',
    errorText: 'text-red-600 text-base font-bold',
    starIconFilled: 'text-yellow-500',
    starIconEmpty: 'text-black'
  },
  dark: {
    container: 'bg-black border-4 border-white rounded-none shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]',
    form: 'space-y-4',
    input: 'bg-zinc-800 border-4 border-white rounded-none focus:ring-0 focus:border-white text-white font-mono',
    textarea: 'bg-zinc-800 border-4 border-white rounded-none focus:ring-0 focus:border-white text-white font-mono min-h-[120px]',
    button: 'bg-zinc-500 hover:bg-zinc-400 text-white font-bold rounded-none border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all',
    label: 'text-white text-lg font-bold uppercase',
    title: 'text-2xl font-black text-white uppercase',
    description: 'text-white text-base font-medium',
    errorText: 'text-red-400 text-base font-bold',
    starIconFilled: 'text-yellow-500',
    starIconEmpty: 'text-white'
  }
};

// Store all themes in a map for easy access
const themeMap = {
  default: defaultTheme,
  dark: darkTheme,
  purple: purpleTheme,
  neobrutalism: neobrutalism
};

/**
 * Get a theme's styles based on the theme name and color mode
 */
export function getBaseTheme(theme: BaseTheme, colorMode: 'light' | 'dark') {
  return themeMap[theme][colorMode];
}

// Export theme constants 
export const BASE_THEMES = {
  DEFAULT: 'default' as BaseTheme,
  DARK: 'dark' as BaseTheme,
  PURPLE: 'purple' as BaseTheme,
  NEOBRUTALISM: 'neobrutalism' as BaseTheme
}; 