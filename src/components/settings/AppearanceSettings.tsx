import React from 'react';
import DarkModeToggle from './dark-mode';

export const AppearanceSettings = () => {
  return (
    <div className="h-full  flex flex-col ">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Theme Preference
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Choose how Waitlizt looks to you. Select a theme that matches your style.
        </p>
      </div>
      <div className="flex-1">
        <DarkModeToggle />
      </div>
    </div>
  );
};
