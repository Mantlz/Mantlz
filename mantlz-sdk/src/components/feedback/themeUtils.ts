import { FeedbackFormTheme, FeedbackFormAppearance, RatingType } from './types';
import { cn } from '../../utils/cn';

// Default appearance for light theme
const defaultAppearance: FeedbackFormAppearance = {
  baseStyle: {
    container: 'bg-white text-zinc-900',
    form: 'space-y-1',
  },
  elements: {
    card: 'border border-zinc-100 shadow-sm rounded-xl',
    cardHeader: 'space-y-1 p-3 pb-0',
    cardTitle: 'text-xl font-semibold tracking-tight',
    cardDescription: 'text-sm text-zinc-500',
    cardContent: 'p-3',
    formButtonPrimary: 'bg-zinc-600 hover:bg-zinc-700 active:bg-zinc-800 text-white shadow-sm hover:shadow transition-all duration-200',
    formButtonIcon: 'text-white ml-1',
    inputLabel: 'text-sm font-medium text-zinc-800 mb-0.5',
    ratingLabel: 'text-sm font-medium text-zinc-800 block mb-1',
    input: 'bg-white border-zinc-200 focus:border-blue-500/50 focus:ring-blue-500/30 shadow-sm',
    textarea: 'bg-white border-zinc-200 focus:border-blue-500/50 focus:ring-blue-500/30 shadow-sm min-h-[100px]',
    inputError: 'text-sm text-red-500 mt-0.5 font-medium',
    select: 'bg-white border-zinc-200 focus:border-blue-500/50 focus:ring-blue-500/30 shadow-sm',
    
    // Star rating related
    ratingContainer: 'flex gap-0.5 my-1',
    ratingStarActive: 'text-amber-400 cursor-pointer transition-all duration-150 hover:text-amber-500 hover:scale-110',
    ratingStarInactive: 'text-zinc-300 cursor-pointer transition-all duration-150 hover:text-amber-300 hover:scale-110',
    
    // Emoji rating related
    emojiContainer: 'flex gap-1.5 my-1 justify-center sm:justify-start',
    emojiButton: 'p-1.5 rounded-lg transition-all duration-200',
    emojiButtonActive: 'bg-zinc-100 ring-2 ring-blue-400 scale-110',
    emojiButtonInactive: 'hover:bg-zinc-100',
    
    // Radio rating related
    radioContainer: 'flex flex-wrap gap-1.5 my-1',
    radioButtonActive: 'bg-zinc-100 border-blue-500 text-blue-800 ring-2 ring-blue-400 transition-all duration-200',
    radioButtonInactive: 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50 transition-all duration-200',
    radioButton: 'px-3 py-1.5 rounded-lg border font-medium text-sm cursor-pointer',
  },
};

// Dark theme appearance
const darkAppearance: FeedbackFormAppearance = {
  baseStyle: {
    container: 'bg-zinc-950 text-zinc-50',
    form: 'space-y-1',
  },
  elements: {
    card: 'border border-zinc-800 rounded-xl shadow-md bg-zinc-900',
    cardHeader: 'space-y-1 p-3 pb-0',
    cardTitle: 'text-xl font-semibold tracking-tight text-white',
    cardDescription: 'text-sm text-zinc-400',
    cardContent: 'p-3',
    formButtonPrimary: 'bg-zinc-600 hover:bg-zinc-500 active:bg-zinc-700 text-white shadow-sm hover:shadow transition-all duration-200',
    formButtonIcon: 'text-white ml-1',
    inputLabel: 'text-sm font-medium text-zinc-300 mb-0.5',
    ratingLabel: 'text-sm font-medium text-zinc-300 block mb-1',
    input: 'bg-zinc-800 border-zinc-700 focus:border-blue-500/50 focus:ring-blue-500/30 text-white placeholder:text-zinc-500 shadow-sm',
    textarea: 'bg-zinc-800 border-zinc-700 focus:border-blue-500/50 focus:ring-blue-500/30 text-white placeholder:text-zinc-500 shadow-sm min-h-[100px]',
    inputError: 'text-sm text-red-400 mt-0.5 font-medium',
    select: 'bg-zinc-800 border-zinc-700 focus:border-blue-500/50 focus:ring-blue-500/30 text-white placeholder:text-zinc-500 shadow-sm',
    
    // Star rating related
    ratingContainer: 'flex gap-0.5 my-1',
    ratingStarActive: 'text-amber-400 cursor-pointer transition-all duration-150 hover:text-amber-300 hover:scale-110',
    ratingStarInactive: 'text-zinc-600 cursor-pointer transition-all duration-150 hover:text-amber-500 hover:scale-110',
    
    // Emoji rating related
    emojiContainer: 'flex gap-1.5 my-1 justify-center sm:justify-start',
    emojiButton: 'p-1.5 rounded-lg transition-all duration-200',
    emojiButtonActive: 'bg-zinc-900/60 ring-2 ring-blue-500 scale-110',
    emojiButtonInactive: 'hover:bg-zinc-800',
    
    // Radio rating related
    radioContainer: 'flex flex-wrap gap-1.5 my-1',
    radioButtonActive: 'bg-zinc-900/60 border-blue-600 text-blue-200 ring-2 ring-blue-500 transition-all duration-200',
    radioButtonInactive: 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-all duration-200',
    radioButton: 'px-3 py-1.5 rounded-lg border font-medium text-sm cursor-pointer',
  },
};

// Purple theme appearance
const purpleAppearance: FeedbackFormAppearance = {
  baseStyle: {
    container: 'bg-gradient-to-br from-purple-900 to-indigo-900 text-purple-50',
    form: 'space-y-1',
  },
  elements: {
    card: 'border border-purple-700/30 shadow-lg rounded-xl backdrop-blur-sm bg-purple-900/80',
    cardHeader: 'space-y-1 p-3 pb-0',
    cardTitle: 'text-2xl font-semibold tracking-tight text-purple-100',
    cardDescription: 'text-sm text-purple-300',
    cardContent: 'p-3',
    formButtonPrimary: 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 active:from-orange-700 active:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-200',
    formButtonIcon: 'text-white ml-1',
    inputLabel: 'text-sm font-medium text-purple-200',
    ratingLabel: 'text-sm font-medium text-purple-200 block mb-1',
    input: 'bg-purple-800/80 border-purple-600/50 focus:border-orange-500/50 focus:ring-orange-500/30 text-white placeholder:text-purple-400 shadow-sm',
    textarea: 'bg-purple-800/80 border-purple-600/50 focus:border-orange-500/50 focus:ring-orange-500/30 text-white placeholder:text-purple-400 shadow-sm min-h-[100px]',
    inputError: 'text-sm text-orange-300 mt-0.5 font-medium',
    select: 'bg-purple-800/80 border-purple-600/50 focus:border-orange-500/50 focus:ring-orange-500/30 text-white placeholder:text-purple-400 shadow-sm',
    
    // Star rating related
    ratingContainer: 'flex gap-0.5 my-1',
    ratingStarActive: 'text-amber-400 cursor-pointer transition-all duration-150 hover:text-amber-300 hover:scale-110',
    ratingStarInactive: 'text-purple-700 cursor-pointer transition-all duration-150 hover:text-amber-500 hover:scale-110',
    
    // Emoji rating related
    emojiContainer: 'flex gap-1.5 my-1 justify-center sm:justify-start',
    emojiButton: 'p-1.5 rounded-lg transition-all duration-200',
    emojiButtonActive: 'bg-purple-800/60 ring-2 ring-orange-500 scale-110',
    emojiButtonInactive: 'hover:bg-purple-800/40',
    
    // Radio rating related
    radioContainer: 'flex flex-wrap gap-1.5 my-1',
    radioButtonActive: 'bg-purple-800/60 border-orange-500 text-orange-200 ring-2 ring-orange-500 transition-all duration-200',
    radioButtonInactive: 'bg-purple-800/40 border-purple-600/50 text-purple-200 hover:bg-purple-800/60 transition-all duration-200',
    radioButton: 'px-3 py-1.5 rounded-lg border font-medium text-sm cursor-pointer',
  },
};

// Neobrutalism theme appearance
const neobrutalistAppearance: FeedbackFormAppearance = {
  baseStyle: {
    container: 'bg-yellow-200 text-black',
    form: 'space-y-6',
  },
  elements: {
    card: 'border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-yellow-100',
    cardHeader: 'space-y-2 p-6 pb-1',
    cardTitle: 'text-2xl font-black uppercase tracking-wider',
    cardDescription: 'text-base font-medium text-black',
    cardContent: 'p-6',
    formButtonPrimary: 'bg-pink-500 hover:bg-pink-400 active:bg-pink-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-bold uppercase',
    formButtonIcon: 'text-white ml-1',
    inputLabel: 'text-sm font-black uppercase',
    ratingLabel: 'text-sm font-black uppercase block mb-2',
    input: 'bg-white border-2 border-black placeholder:text-gray-500 focus:ring-black focus:border-black',
    textarea: 'bg-white border-2 border-black placeholder:text-gray-500 focus:ring-black focus:border-black',
    inputError: 'text-sm font-bold text-red-500 mt-1',
    select: 'bg-white border-2 border-black placeholder:text-gray-500 focus:ring-black focus:border-black',
    
    // Star rating related
    ratingContainer: 'flex gap-1 my-1',
    ratingStarActive: 'text-amber-500 cursor-pointer transition-transform duration-150 hover:text-amber-600 hover:scale-110',
    ratingStarInactive: 'text-gray-400 cursor-pointer transition-transform duration-150 hover:text-amber-400 hover:scale-110',
    
    // Emoji rating related
    emojiContainer: 'flex gap-3 my-2 justify-center sm:justify-start',
    emojiButton: 'p-2 rounded-lg transition-all duration-200 border-2 border-black',
    emojiButtonActive: 'bg-pink-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-110',
    emojiButtonInactive: 'bg-white hover:bg-yellow-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
    
    // Radio rating related
    radioContainer: 'flex flex-wrap gap-3 my-2',
    radioButtonActive: 'bg-pink-400 border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 font-black',
    radioButtonInactive: 'bg-white border-2 border-black text-black hover:bg-yellow-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200',
    radioButton: 'px-4 py-2 rounded-lg font-bold text-sm cursor-pointer',
  },
};

// Get default appearance for a specific theme
export function getDefaultAppearance(theme: FeedbackFormTheme = 'default', ratingType: RatingType = 'star'): FeedbackFormAppearance {
  switch (theme) {
    case 'dark':
      return darkAppearance;
    case 'purple':
      return purpleAppearance;
    case 'neobrutalism':
      return neobrutalistAppearance;
    default:
      return defaultAppearance;
  }
}

// Process appearance with overrides
export function processAppearance(
  appearance: FeedbackFormAppearance | ((theme: FeedbackFormTheme) => FeedbackFormAppearance) | undefined,
  theme: FeedbackFormTheme = 'default'
): FeedbackFormAppearance {
  // Get the default appearance for the selected theme
  const defaultThemeAppearance = getDefaultAppearance(theme);
  
  // If no appearance provided, return the default theme appearance
  if (!appearance) {
    return defaultThemeAppearance;
  }
  
  // If appearance is a function, call it with the current theme
  const customAppearance = typeof appearance === 'function' 
    ? appearance(theme) 
    : appearance;
  
  // Special handling for neobrutalism theme in dark mode
  if (theme === 'neobrutalism' && document.documentElement.classList.contains('dark')) {
    return {
      ...defaultThemeAppearance,
      elements: {
        ...defaultThemeAppearance.elements,
        card: 'border-3 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] bg-yellow-100',
        formButtonPrimary: 'bg-pink-500 hover:bg-pink-400 active:bg-pink-600 text-white border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-bold uppercase',
        input: 'bg-white border-2 border-white placeholder:text-gray-500 focus:ring-white focus:border-white',
        textarea: 'bg-white border-2 border-white placeholder:text-gray-500 focus:ring-white focus:border-white',
        select: 'bg-white border-2 border-white focus:ring-white focus:border-white',
        inputError: 'text-sm font-bold text-red-500 mt-1',
      }
    };
  }
  
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
      textarea: cn(defaultThemeAppearance.elements?.textarea, customAppearance.elements?.textarea),
      select: cn(defaultThemeAppearance.elements?.select, customAppearance.elements?.select),
      inputError: cn(defaultThemeAppearance.elements?.inputError, customAppearance.elements?.inputError),
      background: customAppearance.elements?.background,
      border: customAppearance.elements?.border,
      submitButton: customAppearance.elements?.submitButton,
      buttonIcon: customAppearance.elements?.buttonIcon,
      formInput: customAppearance.elements?.formInput,
    },
  };
} 