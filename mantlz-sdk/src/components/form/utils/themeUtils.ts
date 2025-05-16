import { useMemo } from 'react';

export const useThemeClasses = (colorMode: 'light' | 'dark', theme: string = 'default', styles: any) => {
  return useMemo(() => {
    const baseThemeClasses = {
      text: colorMode === 'dark' ? 'text-white' : 'text-gray-900',
      bg: colorMode === 'dark' ? 'bg-zinc-800' : 'bg-white',
      border: colorMode === 'dark' ? 'border-zinc-700' : 'border-zinc-200',
      inputBg: colorMode === 'dark' ? 'bg-zinc-700' : 'bg-white',
      inputText: colorMode === 'dark' ? 'text-white' : 'text-gray-900',
      inputBorder: colorMode === 'dark' ? 'border-zinc-600' : 'border-zinc-300',
      description: colorMode === 'dark' ? 'text-gray-300' : 'text-gray-500',
    };

    // Add theme-specific classes
    const themeSpecificClasses = {
      default: {},
      minimal: {
        border: 'border-0',
        bg: 'bg-transparent',
      },
      modern: {
        border: 'border-2',
        bg: colorMode === 'dark' ? 'bg-zinc-900' : 'bg-gray-50',
      },
      classic: {
        border: 'border-2 rounded-sm',
        bg: colorMode === 'dark' ? 'bg-zinc-800' : 'bg-white',
      },
    }[theme];

    return {
      ...baseThemeClasses,
      ...themeSpecificClasses,
      ...styles.baseStyle,
    };
  }, [colorMode, theme, styles]);
};

export const processAppearance = (appearance: any, theme: string = 'default') => {
  if (typeof appearance === 'function') {
    return appearance(theme);
  }
  return appearance || {};
}; 