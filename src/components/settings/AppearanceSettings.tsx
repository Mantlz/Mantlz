import React from 'react';
import DarkModeToggle from './dark-mode';

export const AppearanceSettings = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
          Theme Preference
        </h3>
        <div className="w-16 h-0.5 bg-zinc-300 dark:bg-zinc-700 mb-3"></div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Choose how Waitlizt looks to you. Select a theme that matches your style.
        </p>
      </div>
      <div className="flex-1 p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
        <DarkModeToggle />
      </div>
    </div>
  );
};