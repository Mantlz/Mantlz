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
        'rounded-xl border',
        'transition-all duration-200',
        'backdrop-blur-sm',
        // Hover effects
        'hover:shadow-sm hover:shadow-primary/5',
        'group-hover:border-primary/20',
        // Border and background
        'bg-white/5 dark:bg-zinc-900/50',
        'border-zinc-200/30 dark:border-zinc-800/50',
        // Selected state
        isSelected && [
          'border-primary/50 dark:border-primary/50',
          'shadow-sm shadow-primary/10',
          'bg-primary/5 dark:bg-primary/5'
        ]
      )}
      onClick={onClick}
    >
      {/* Gradient overlay */}
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-200",
        "bg-gradient-to-br from-primary/5 via-transparent to-primary/5",
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
          "border-t border-zinc-200/10 dark:border-zinc-800/50",
          "pt-2"
        )}>
          <div className="flex items-center gap-2">
            {type === 'System' && (
              <Sparkles className="h-3.5 w-3.5  mt-3 text-primary/70" />
            )}
            <span className={cn(
              "text-sm mt-3 font-medium",
              isSelected ? "text-primary" : "text-zinc-600 dark:text-zinc-400",
              "group-hover:text-primary/80 transition-colors duration-200"
            )}>
              {type}
            </span>
          </div>

          {/* Selected indicator */}
          <div className={cn(
            "flex items-center justify-center",
            "size-4 rounded-full",
            "transition-colors duration-200",
            isSelected ? "bg-primary" : "bg-zinc-200/50 dark:bg-zinc-800/50",
            "group-hover:bg-primary/70"
          )}>
            <Check className={cn(
              "size-3",
              isSelected ? "text-black dark:text-white" : "text-transparent",
              "transition-opacity duration-200"
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
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="h-[160px]  animate-pulse bg-zinc-100/5 dark:bg-zinc-800/5 rounded-xl border border-zinc-200/30 dark:border-zinc-800/30"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full ">
      <div className="grid grid-cols-3 gap-3 ">
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