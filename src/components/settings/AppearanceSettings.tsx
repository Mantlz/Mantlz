import React, { useState, useEffect } from "react";
import DarkModeToggle from "./dark-mode";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FONT_FAMILIES, type FontFamily } from "@/lib/fonts";

export const AppearanceSettings = () => {
  const [fontFamily, setFontFamily] = useState<FontFamily>("inter");

  useEffect(() => {
    // Load saved preferences
    const savedFont = localStorage.getItem("font-family") as FontFamily;

    // Only set font if it's a valid font family
    if (savedFont && FONT_FAMILIES[savedFont]) {
      setFontFamily(savedFont);
      // Ensure the font is applied to the document
      document.documentElement.setAttribute("data-font", savedFont);
    }
  }, []);

  const handleFontChange = (value: FontFamily) => {
    setFontFamily(value);
    localStorage.setItem("font-family", value);
    document.documentElement.setAttribute("data-font", value);
  };

  return (
    <div className="w-full mx-auto">
      <div className="w-full space-y-4 pr-4">
        <header className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                Appearance Settings
              </h2>
            </div>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Choose how Mantlz looks to you. Select a theme that matches your style.
          </p>
        </header>

        <div className="space-y-4">
          <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
            <DarkModeToggle />
          </div>

          <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
              Font Family
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">
              Choose your preferred font family for the application.
            </p>
            <Select value={fontFamily} onValueChange={handleFontChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(FONT_FAMILIES).map(([value, font]) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className={font.className}
                  >
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
