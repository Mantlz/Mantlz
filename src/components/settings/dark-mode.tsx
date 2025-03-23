'use client';

import React, { useEffect, useState } from 'react';
import { useThemeMode } from '@/hooks/use-setting';
import { cn } from '@/lib/utils';
import { SystemMode } from '@/components/theme-holder/system-theme';
import { LightMode } from '@/components/theme-holder/light-theme';
import { DarkMode } from '@/components/theme-holder/dark-theme';
import { Check, Sparkles } from 'lucide-react';

interface ThemeOptionProps {
  type: string;
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const ThemeOption: React.FC<ThemeOptionProps> = React.memo(({ type, isSelected, onClick, children }) => (
  <div className="group">
    <div
      className={cn(
        // Base styles
        'relative overflow-hidden cursor-pointer',
        'rounded-lg border',
        'transition-all duration-150',
        // Hover effects
        'hover:shadow-md dark:hover:shadow-md/20',
        'hover:-translate-y-0.5',
        // Border and background
        'bg-white dark:bg-zinc-900',
        'border-zinc-200 dark:border-zinc-800',
        // Selected state
        isSelected && [
          'border-zinc-400 dark:border-zinc-600',
          'shadow-md dark:shadow-lg/10',
          '-translate-y-0.5',
          'bg-white dark:bg-zinc-900'
        ]
      )}
      onClick={onClick}
    >
      {/* Gradient overlay */}
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-150",
        "bg-gradient-to-br from-zinc-100/40 via-transparent to-zinc-100/40 dark:from-zinc-800/20 dark:to-zinc-800/20",
        "group-hover:opacity-100"
      )} />

      {/* Content container */}
      <div className="relative p-3">
        {/* Preview - adjusted height only */}
        <div className="h-[120px] flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center">
            {children}
          </div>
        </div>

        {/* Label */}
        <div className={cn(
          "mt-2 flex items-center justify-between",
          "border-t border-zinc-200 dark:border-zinc-800",
          "pt-2"
        )}>
          <div className="flex items-center gap-2">
            {type === 'System' && (
              <Sparkles className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            )}
            <span className={cn(
              "text-sm font-medium",
              isSelected ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-400",
              "group-hover:text-zinc-900 dark:group-hover:text-white transition-colors duration-150"
            )}>
              {type}
            </span>
          </div>

          {/* Selected indicator */}
          <div className={cn(
            "flex items-center justify-center",
            "size-5 rounded-full",
            "transition-colors duration-150",
            "border",
            isSelected ? "bg-zinc-900 border-zinc-800 dark:bg-white dark:border-zinc-200" : "bg-zinc-200 border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700",
            "group-hover:bg-zinc-800 group-hover:border-zinc-700 dark:group-hover:bg-zinc-300 dark:group-hover:border-zinc-400"
          )}>
            <Check className={cn(
              "size-3",
              isSelected ? "text-white dark:text-zinc-900" : "text-transparent",
              "transition-opacity duration-150"
            )} />
          </div>
        </div>
      </div>
    </div>
  </div>
));

ThemeOption.displayName = 'ThemeOption';

const themeOptions = [
  { type: 'System', value: 'system', Component: SystemMode },
  { type: 'Light', value: 'light', Component: LightMode },
  { type: 'Dark', value: 'dark', Component: DarkMode },
] as const;

export default function DarkModeToggle() {
  const { setTheme, theme } = useThemeMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="h-[160px] animate-pulse bg-zinc-100/5 dark:bg-zinc-800/5 rounded-lg border border-zinc-200 dark:border-zinc-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-4">
        {themeOptions.map(({ type, value, Component }) => (
          <ThemeOption
            key={value}
            type={type}
            isSelected={theme === value}
            onClick={() => setTheme(value)}
          >
            <Component />
          </ThemeOption>
        ))}
      </div>
    </div>
  );
}