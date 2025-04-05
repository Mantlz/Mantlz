import { FeedbackFormTheme, FeedbackFormAppearance } from './types';
import { cn } from '../../utils/cn';

// Default appearance for light theme
const defaultAppearance: FeedbackFormAppearance = {
  baseStyle: {
    container: 'bg-white text-zinc-900',
    form: 'space-y-4',
  },
  elements: {
    card: 'border border-zinc-200 shadow-sm',
    cardHeader: 'space-y-1.5 p-6 pb-0',
    cardTitle: 'text-2xl font-semibold tracking-tight',
    cardDescription: 'text-sm text-zinc-500',
    cardContent: 'p-6',
    formButtonPrimary: 'bg-zinc-900 hover:bg-zinc-800 text-white',
    formButtonIcon: 'text-white',
    inputLabel: 'text-sm font-medium text-zinc-900',
    input: 'bg-white border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400',
    inputError: 'text-sm text-red-500',
    textarea: 'bg-white border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400',
    ratingWrapper: 'flex items-center justify-center space-x-2 py-4',
    starButton: 'p-1 rounded-md transition-all hover:scale-110',
    starIcon: {
      filled: 'text-yellow-400',
      empty: 'text-zinc-300'
    }
  },
  typography: {
    submitButtonText: 'Submit Feedback',
    feedbackPlaceholder: 'Tell us what you think...',
  }
};

// Dark theme appearance
const darkAppearance: FeedbackFormAppearance = {
  baseStyle: {
    container: 'bg-zinc-900 text-zinc-50',
    form: 'space-y-4',
  },
  elements: {
    card: 'border border-zinc-800 shadow-md',
    cardHeader: 'space-y-1.5 p-6 pb-0',
    cardTitle: 'text-2xl font-semibold tracking-tight text-white',
    cardDescription: 'text-sm text-zinc-400',
    cardContent: 'p-6',
    formButtonPrimary: 'bg-zinc-50 hover:bg-zinc-200 text-zinc-900',
    formButtonIcon: 'text-zinc-900',
    inputLabel: 'text-sm font-medium text-zinc-300',
    input: 'bg-zinc-800 border-zinc-700 focus:border-zinc-600 focus:ring-zinc-600 text-white placeholder:text-zinc-500',
    inputError: 'text-sm text-red-400',
    textarea: 'bg-zinc-800 border-zinc-700 focus:border-zinc-600 focus:ring-zinc-600 text-white placeholder:text-zinc-500',
    ratingWrapper: 'flex items-center justify-center space-x-2 py-4',
    starButton: 'p-1 rounded-md transition-all hover:scale-110',
    starIcon: {
      filled: 'text-yellow-400',
      empty: 'text-zinc-600'
    }
  },
  typography: {
    submitButtonText: 'Submit Feedback',
    feedbackPlaceholder: 'Tell us what you think...',
  }
};

// Purple theme appearance
const purpleAppearance: FeedbackFormAppearance = {
  baseStyle: {
    container: 'bg-purple-900 text-purple-50',
    form: 'space-y-4',
  },
  elements: {
    card: 'border border-purple-800 shadow-lg',
    cardHeader: 'space-y-1.5 p-6 pb-0',
    cardTitle: 'text-2xl font-semibold tracking-tight text-purple-100',
    cardDescription: 'text-sm text-purple-300',
    cardContent: 'p-6',
    formButtonPrimary: 'bg-orange-500 hover:bg-orange-400 text-white',
    formButtonIcon: 'text-white',
    inputLabel: 'text-sm font-medium text-purple-200',
    input: 'bg-purple-800 border-purple-700 focus:border-purple-600 focus:ring-orange-500 text-white placeholder:text-purple-400',
    inputError: 'text-sm text-orange-300',
    textarea: 'bg-purple-800 border-purple-700 focus:border-purple-600 focus:ring-orange-500 text-white placeholder:text-purple-400',
    ratingWrapper: 'flex items-center justify-center space-x-2 py-4',
    starButton: 'p-1 rounded-md transition-all hover:scale-110',
    starIcon: {
      filled: 'text-orange-400',
      empty: 'text-purple-700'
    }
  },
  typography: {
    submitButtonText: 'Submit Feedback',
    feedbackPlaceholder: 'Tell us what you think...',
  }
};

// Neobrutalism theme appearance
const neobrutalistAppearance: FeedbackFormAppearance = {
  baseStyle: {
    container: 'bg-yellow-200 text-black',
    form: 'space-y-6',
  },
  elements: {
    card: 'border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    cardHeader: 'space-y-1.5 p-6 pb-0',
    cardTitle: 'text-2xl font-black uppercase tracking-wider',
    cardDescription: 'text-base font-medium text-black',
    cardContent: 'p-6',
    formButtonPrimary: 'bg-pink-500 hover:bg-pink-400 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all font-bold uppercase',
    formButtonIcon: 'text-white',
    inputLabel: 'text-sm font-black uppercase',
    input: 'bg-white border-2 border-black placeholder:text-gray-500',
    inputError: 'text-sm font-bold text-red-500',
    textarea: 'bg-white border-2 border-black placeholder:text-gray-500',
    ratingWrapper: 'flex items-center justify-center space-x-3 py-6',
    starButton: 'p-1 rounded-md transition-all hover:scale-110 hover:-rotate-6',
    starIcon: {
      filled: 'text-yellow-500',
      empty: 'text-black'
    }
  },
  typography: {
    submitButtonText: 'SEND FEEDBACK!',
    feedbackPlaceholder: 'TELL US YOUR THOUGHTS...',
  }
};

// Get default appearance for a specific theme
export function getDefaultAppearance(theme: FeedbackFormTheme = 'default'): FeedbackFormAppearance {
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
  
  // Deep merge for starIcon nested property
  const mergedStarIcon = {
    ...(defaultThemeAppearance.elements?.starIcon || {}),
    ...(customAppearance.elements?.starIcon || {})
  };
  
  // Merge typography settings
  const mergedTypography = {
    ...(defaultThemeAppearance.typography || {}),
    ...(customAppearance.typography || {})
  };
  
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
      submitButton: cn(defaultThemeAppearance.elements?.submitButton, customAppearance.elements?.submitButton),
      formButtonIcon: cn(defaultThemeAppearance.elements?.formButtonIcon, customAppearance.elements?.formButtonIcon),
      inputLabel: cn(defaultThemeAppearance.elements?.inputLabel, customAppearance.elements?.inputLabel),
      input: cn(defaultThemeAppearance.elements?.input, customAppearance.elements?.input),
      inputError: cn(defaultThemeAppearance.elements?.inputError, customAppearance.elements?.inputError),
      textarea: cn(defaultThemeAppearance.elements?.textarea, customAppearance.elements?.textarea),
      ratingWrapper: cn(defaultThemeAppearance.elements?.ratingWrapper, customAppearance.elements?.ratingWrapper),
      starButton: cn(defaultThemeAppearance.elements?.starButton, customAppearance.elements?.starButton),
      starIcon: Object.keys(mergedStarIcon).length > 0 ? mergedStarIcon : undefined,
    },
    typography: Object.keys(mergedTypography).length > 0 ? mergedTypography : undefined,
  };
} 