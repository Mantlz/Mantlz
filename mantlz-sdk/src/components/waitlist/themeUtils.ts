import { WaitlistFormAppearance, WaitlistFormTheme } from './types';
import { cn } from '../../utils/cn';

// Default appearance for light theme
const defaultAppearance: WaitlistFormAppearance = {
  baseStyle: {
    container: 'bg-white text-zinc-900',
    form: 'space-y-2',
  },
  elements: {
    card: 'border border-zinc-100 shadow-sm rounded-xl',
    cardHeader: 'space-y-1 p-2 pb-1',
    cardTitle: 'text-2xl font-semibold tracking-tight',
    cardDescription: 'text-sm text-zinc-500',
    cardContent: 'p-2',
    formButtonPrimary: 'bg-zinc-600 hover:bg-zinc-700 active:bg-zinc-800 text-white shadow-sm hover:shadow transition-all duration-200',
    formButtonIcon: 'text-white ml-1',
    inputLabel: 'text-sm font-medium text-zinc-800',
    input: 'bg-white border-zinc-200 focus:border-blue-500/50 focus:ring-blue-500/30 shadow-sm',
    inputError: 'text-sm text-red-500 mt-1 font-medium',
    usersJoinedCounter: 'bg-zinc-50 text-blue-700 border border-blue-100',
  },
};

// Dark theme appearance
const darkAppearance: WaitlistFormAppearance = {
  baseStyle: {
    container: 'bg-zinc-950 text-zinc-50',
    form: 'space-y-2',
  },
  elements: {
    card: 'border border-zinc-800 rounded-xl shadow-md bg-zinc-900',
    cardHeader: 'space-y-2 p-2 pb-1',
    cardTitle: 'text-2xl font-semibold tracking-tight text-white',
    cardDescription: 'text-sm text-zinc-400',
    cardContent: 'p-2',
    formButtonPrimary: 'bg-zinc-600 hover:bg-zinc-500 active:bg-zinc-700 text-white shadow-sm hover:shadow transition-all duration-200',
    formButtonIcon: 'text-white ml-1',
    inputLabel: 'text-sm font-medium text-zinc-300',
    input: 'bg-zinc-800 border-zinc-700 focus:border-blue-500/50 focus:ring-blue-500/30 text-white placeholder:text-zinc-500 shadow-sm',
    inputError: 'text-sm text-red-400 mt-1 font-medium',
    usersJoinedCounter: 'bg-zinc-800 text-zinc-100 border border-zinc-700',
  },
};

// Purple theme appearance
const purpleAppearance: WaitlistFormAppearance = {
  baseStyle: {
    container: 'bg-gradient-to-br from-purple-900 to-indigo-900 text-purple-50',
    form: 'space-y-2',
  },
  elements: {
    card: 'border border-purple-700/30 shadow-lg rounded-xl backdrop-blur-sm bg-purple-900/80',
    cardHeader: 'space-y-2 p-2 pb-1',
    cardTitle: 'text-2xl font-semibold tracking-tight text-purple-100',
    cardDescription: 'text-sm text-purple-300',
    cardContent: 'p-2',
    formButtonPrimary: 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 active:from-orange-700 active:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-200',
    formButtonIcon: 'text-white ml-1',
    inputLabel: 'text-sm font-medium text-purple-200',
    input: 'bg-purple-800/80 border-purple-600/50 focus:border-orange-500/50 focus:ring-orange-500/30 text-white placeholder:text-purple-400 shadow-sm',
    inputError: 'text-sm text-orange-300 mt-1 font-medium',
    usersJoinedCounter: 'bg-purple-800/40 text-purple-100 border border-purple-600/30',
  },
};

// Neobrutalism theme appearance
const neobrutalistAppearance: WaitlistFormAppearance = {
  baseStyle: {
    container: 'bg-yellow-200 text-black',
    form: 'space-y-2',
  },
  elements: {
    card: 'border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-yellow-100',
    cardHeader: 'space-y-2 p-2 pb-1',
    cardTitle: 'text-2xl font-black uppercase tracking-wider',
    cardDescription: 'text-base font-medium text-black',
    cardContent: 'p-2',
    formButtonPrimary: 'bg-pink-500 hover:bg-pink-400 active:bg-pink-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-bold uppercase',
    formButtonIcon: 'text-white ml-1',
    inputLabel: 'text-sm font-black uppercase',
    input: 'bg-white border-2 border-black placeholder:text-gray-500 focus:ring-black focus:border-black',
    inputError: 'text-sm font-bold text-red-500 mt-1',
    usersJoinedCounter: 'bg-black text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
  },
};

// Get default appearance for a specific theme
export function getDefaultAppearance(theme: WaitlistFormTheme = 'default'): WaitlistFormAppearance {
  switch (theme) {
    case 'dark': return darkAppearance;
    case 'purple': return purpleAppearance;
    case 'neobrutalism': return neobrutalistAppearance;
    default: return defaultAppearance;
  }
}

// Process appearance with overrides
export function processAppearance(
  appearance: WaitlistFormAppearance | ((theme: WaitlistFormTheme) => WaitlistFormAppearance) | undefined,
  theme: WaitlistFormTheme = 'default'
): WaitlistFormAppearance {
  // Get the default appearance for the selected theme
  const defaultThemeAppearance = getDefaultAppearance(theme);
  
  // If no appearance provided, return the default theme appearance
  if (!appearance) return defaultThemeAppearance;
  
  // If appearance is a function, call it with the current theme
  const customAppearance = typeof appearance === 'function' 
    ? appearance(theme) 
    : appearance;
  
  // Merge custom appearance with default theme appearance
  return {
    baseStyle: {
      container: cn(defaultThemeAppearance.baseStyle?.container, customAppearance.baseStyle?.container),
      form: cn(defaultThemeAppearance.baseStyle?.form, customAppearance.baseStyle?.form),
      background: customAppearance.baseStyle?.background,
      border: customAppearance.baseStyle?.border,
    },
    elements: {
      card: cn(defaultThemeAppearance.elements?.card, customAppearance.elements?.card),
      cardHeader: cn(defaultThemeAppearance.elements?.cardHeader, customAppearance.elements?.cardHeader),
      cardTitle: cn(defaultThemeAppearance.elements?.cardTitle, customAppearance.elements?.cardTitle),
      cardDescription: cn(defaultThemeAppearance.elements?.cardDescription, customAppearance.elements?.cardDescription),
      cardContent: cn(defaultThemeAppearance.elements?.cardContent, customAppearance.elements?.cardContent),
      formButtonPrimary: cn(defaultThemeAppearance.elements?.formButtonPrimary, customAppearance.elements?.formButtonPrimary),
      formButtonIcon: cn(defaultThemeAppearance.elements?.formButtonIcon, customAppearance.elements?.formButtonIcon),
      inputLabel: cn(defaultThemeAppearance.elements?.inputLabel, customAppearance.elements?.inputLabel),
      input: cn(defaultThemeAppearance.elements?.input, customAppearance.elements?.input),
      inputError: cn(defaultThemeAppearance.elements?.inputError, customAppearance.elements?.inputError),
      background: customAppearance.elements?.background,
      border: customAppearance.elements?.border,
      submitButton: customAppearance.elements?.submitButton,
      buttonIcon: customAppearance.elements?.buttonIcon,
      formInput: customAppearance.elements?.formInput,
      usersJoinedCounter: cn(defaultThemeAppearance.elements?.usersJoinedCounter, customAppearance.elements?.usersJoinedCounter),
    },
  };
}
