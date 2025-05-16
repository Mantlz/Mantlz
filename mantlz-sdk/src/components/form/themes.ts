export type ThemeVariant = 'default' | 'dark' | 'purple' | 'neobrutalism';

export interface ThemeClasses {
  bg: string;
  border: string;
  text: string;
  description: string;
  input: string;
  button: string;
  label: string;
  error: string;
}

const themes: Record<ThemeVariant, ThemeClasses> = {
  default: {
    bg: 'bg-white dark:bg-zinc-800',
    border: 'border border-zinc-200 dark:border-zinc-700',
    text: 'text-zinc-900 dark:text-white',
    description: 'text-zinc-500 dark:text-zinc-400',
    input: 'bg-zinc-50 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white',
    button: 'bg-zinc-600 hover:bg-zinc-700 text-white font-medium rounded-lg shadow-sm',
    label: 'text-gray-700 dark:text-gray-300 text-sm font-medium',
    error: 'text-red-500 dark:text-red-400'
  },
  dark: {
    bg: 'bg-zinc-900',
    border: 'border border-zinc-800',
    text: 'text-white',
    description: 'text-zinc-400',
    input: 'bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white placeholder:text-zinc-400',
    button: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm',
    label: 'text-gray-300 text-sm font-medium',
    error: 'text-red-400'
  },
  purple: {
    bg: 'bg-white dark:bg-zinc-800',
    border: 'border border-purple-200 dark:border-purple-700',
    text: 'text-purple-900 dark:text-purple-300',
    description: 'text-purple-500 dark:text-purple-400',
    input: 'bg-purple-50 dark:bg-zinc-700 border border-purple-300 dark:border-purple-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white',
    button: 'bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm',
    label: 'text-purple-700 dark:text-purple-300 text-sm font-medium',
    error: 'text-red-500 dark:text-red-400'
  },
  neobrutalism: {
    bg: 'bg-yellow-100 dark:bg-black',
    border: 'border-4 border-black dark:border-white',
    text: 'text-black dark:text-white font-black uppercase',
    description: 'text-black dark:text-white font-medium',
    input: 'bg-white dark:bg-zinc-800 border-4 border-black dark:border-white rounded-none focus:ring-0 focus:border-black dark:focus:border-white text-black dark:text-white font-mono',
    button: 'bg-zinc-500 hover:bg-zinc-400 text-black dark:text-white font-bold rounded-none border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all',
    label: 'text-black dark:text-white text-lg font-bold uppercase',
    error: 'text-red-600 dark:text-red-400 font-bold'
  }
};

export function getThemeClasses(theme: ThemeVariant = 'default'): ThemeClasses {
  return themes[theme];
} 