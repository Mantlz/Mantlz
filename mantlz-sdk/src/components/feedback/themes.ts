import { FeedbackFormAppearance } from './types';
import { FeedbackTheme } from './sharedTypes';

// Process appearance prop with correct theme
export function getPresetTheme(themeName: FeedbackTheme, colorMode: 'light' | 'dark'): FeedbackFormAppearance {
  switch (themeName) {
    case 'minimal':
      return {
        baseStyle: {
          container: `bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-4 shadow-sm`,
          form: 'space-y-4',
        },
        elements: {
          ratingWrapper: 'bg-gray-50 dark:bg-zinc-800/50 rounded-md p-3',
          starIcon: {
            filled: 'text-amber-500 dark:text-amber-400',
            empty: colorMode === 'dark' ? 'text-zinc-700' : 'text-gray-300',
          },
          textarea: {
            input: colorMode === 'dark'
              ? 'bg-zinc-800 border border-zinc-700 focus:border-zinc-600 rounded-md resize-none text-white placeholder:text-zinc-500'
              : 'bg-white border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 rounded-md resize-none text-gray-900 placeholder:text-gray-400',
          },
          submitButton: colorMode === 'dark'
            ? `bg-zinc-800 hover:bg-zinc-700 text-white rounded-md py-2.5`
            : `bg-gray-900 hover:bg-gray-800 text-white rounded-md py-2.5`,
          email: {
            input: colorMode === 'dark'
              ? 'bg-zinc-800 border border-zinc-700 focus:border-zinc-600 rounded-md text-white placeholder:text-zinc-500'
              : 'bg-white border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 rounded-md text-gray-900 placeholder:text-gray-400',
          },
        },
        typography: {
          title: colorMode === 'dark' ? 'text-white font-medium' : 'text-gray-900 font-medium',
          description: colorMode === 'dark' ? 'text-gray-300' : 'text-gray-600',
          feedbackPlaceholder: "Tell us what you think...",
        },
      };
    case 'rounded':
      return {
        baseStyle: {
          container: `bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-md`,
          form: 'space-y-5',
        },
        elements: {
          ratingWrapper: 'bg-gray-50 dark:bg-zinc-800 rounded-full p-3',
          starIcon: {
            filled: 'text-amber-500 dark:text-amber-400',
            empty: colorMode === 'dark' ? 'text-zinc-600' : 'text-gray-200',
          },
          textarea: {
            input: colorMode === 'dark'
              ? 'bg-zinc-800 border border-zinc-700 focus:border-zinc-600 rounded-xl resize-none text-white placeholder:text-zinc-500'
              : 'bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 rounded-xl resize-none text-gray-900 placeholder:text-gray-400',
          },
          submitButton: colorMode === 'dark'
            ? `bg-zinc-800 hover:bg-zinc-700 text-white rounded-full py-3`
            : `bg-indigo-600 hover:bg-indigo-700 text-white rounded-full py-3`,
          email: {
            input: colorMode === 'dark'
              ? 'bg-zinc-800 border border-zinc-700 focus:border-zinc-600 rounded-xl text-white placeholder:text-zinc-500'
              : 'bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400',
          },
        },
        typography: {
          title: colorMode === 'dark' ? 'text-white font-medium' : 'text-gray-800 font-medium',
          description: colorMode === 'dark' ? 'text-gray-300' : 'text-gray-500',
          feedbackPlaceholder: "Share your thoughts...",
        },
      };
    case 'glass':
      return {
        baseStyle: {
          container: colorMode === 'dark'
            ? `bg-black/10 backdrop-blur-lg border border-white/10 rounded-xl p-5 shadow-lg`
            : `bg-white/80 backdrop-blur-lg border border-gray-100 rounded-xl p-5 shadow-lg`,
          form: 'space-y-5',
        },
        elements: {
          ratingWrapper: colorMode === 'dark'
            ? 'bg-black/20 backdrop-blur-sm rounded-lg p-3'
            : 'bg-gray-50/80 backdrop-blur-sm rounded-lg p-3',
          starIcon: {
            filled: colorMode === 'dark' ? 'text-amber-400' : 'text-amber-500',
            empty: colorMode === 'dark' ? 'text-zinc-600' : 'text-gray-300',
          },
          textarea: {
            input: colorMode === 'dark'
              ? 'bg-black/20 backdrop-blur-sm border border-white/10 focus:border-white/30 rounded-lg resize-none text-white placeholder:text-white/50'
              : 'bg-white/80 backdrop-blur-sm border border-gray-200 focus:border-gray-300 rounded-lg resize-none text-gray-900 placeholder:text-gray-400',
          },
          submitButton: colorMode === 'dark'
            ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg py-3'
            : 'bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-3',
          email: {
            input: colorMode === 'dark'
              ? 'bg-black/20 backdrop-blur-sm border border-white/10 focus:border-white/30 rounded-lg text-white placeholder:text-white/50'
              : 'bg-white/80 backdrop-blur-sm border border-gray-200 focus:border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400',
          },
        },
        typography: {
          title: colorMode === 'dark' ? 'text-white font-medium' : 'text-gray-900 font-medium',
          description: colorMode === 'dark' ? 'text-white/70' : 'text-gray-600',
          feedbackPlaceholder: "Your thoughts here...",
        },
      };
    default:
      return {} as FeedbackFormAppearance;
  }
} 