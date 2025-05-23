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
    <div className="h-full flex flex-col ">
      <div className="mb-6 p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
          Theme Preference
        </h3>
        {/* <div className="w-16 h-0.5 bg-zinc-300 dark:bg-zinc-700 mb-3"></div> */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Choose how Mantlz looks to you. Select a theme that matches your
          style.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
          <DarkModeToggle />
        </div>

        <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
            Font Family
          </h3>
          {/* <div className="w-16 h-0.5 bg-zinc-300 dark:bg-zinc-700 mb-3"></div> */}
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
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
  );
};
