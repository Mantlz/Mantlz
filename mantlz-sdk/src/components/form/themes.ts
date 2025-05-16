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

const themes: Record<ThemeVariant, Record<'light' | 'dark', ThemeClasses>> = {
  default: {
    light: {
      bg: 'bg-white',
      border: 'border border-zinc-200',
      text: 'text-zinc-900',
      description: 'text-zinc-500',
      input: 'bg-zinc-50 border border-zinc-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900',
      button: 'bg-zinc-600 hover:bg-zinc-700 text-white font-medium rounded-lg shadow-sm',
      label: 'text-gray-700 text-sm font-medium',
      error: 'text-red-500'
    },
    dark: {
      bg: 'bg-zinc-800',
      border: 'border border-zinc-700',
      text: 'text-white',
      description: 'text-zinc-400',
      input: 'bg-zinc-700 border border-zinc-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white',
      button: 'bg-zinc-600 hover:bg-zinc-700 text-white font-medium rounded-lg shadow-sm',
      label: 'text-gray-300 text-sm font-medium',
      error: 'text-red-400'
    }
  },
  dark: {
    light: {
      bg: 'bg-zinc-900',
      border: 'border border-zinc-800',
      text: 'text-white',
      description: 'text-zinc-400',
      input: 'bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm',
      label: 'text-gray-300 text-sm font-medium',
      error: 'text-red-400'
    },
    dark: {
      bg: 'bg-zinc-900',
      border: 'border border-zinc-800',
      text: 'text-white',
      description: 'text-zinc-400',
      input: 'bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm',
      label: 'text-gray-300 text-sm font-medium',
      error: 'text-red-400'
    }
  },
  purple: {
    light: {
      bg: 'bg-white',
      border: 'border border-purple-200',
      text: 'text-purple-900',
      description: 'text-purple-500',
      input: 'bg-purple-50 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-900',
      button: 'bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm',
      label: 'text-purple-700 text-sm font-medium',
      error: 'text-red-500'
    },
    dark: {
      bg: 'bg-zinc-800',
      border: 'border border-purple-700',
      text: 'text-purple-300',
      description: 'text-purple-400',
      input: 'bg-zinc-700 border border-purple-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white',
      button: 'bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm',
      label: 'text-purple-300 text-sm font-medium',
      error: 'text-red-400'
    }
  },
  neobrutalism: {
    light: {
      bg: 'bg-yellow-100',
      border: 'border-4 border-black',
      text: 'text-black font-black uppercase',
      description: 'text-black font-medium',
      input: 'bg-white border-4 border-black rounded-none focus:ring-0 focus:border-black text-black font-mono',
      button: 'bg-zinc-500 hover:bg-zinc-400 text-black font-bold rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all',
      label: 'text-black text-lg font-bold uppercase',
      error: 'text-red-600 font-bold'
    },
    dark: {
      bg: 'bg-black',
      border: 'border-4 border-white',
      text: 'text-white font-black uppercase',
      description: 'text-white font-medium',
      input: 'bg-zinc-800 border-4 border-white rounded-none focus:ring-0 focus:border-white text-white font-mono',
      button: 'bg-zinc-500 hover:bg-zinc-400 text-white font-bold rounded-none border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all',
      label: 'text-white text-lg font-bold uppercase',
      error: 'text-red-400 font-bold'
    }
  }
};

export function getThemeClasses(theme: ThemeVariant = 'default', colorMode: 'light' | 'dark' = 'light'): ThemeClasses {
  return themes[theme][colorMode];
} 