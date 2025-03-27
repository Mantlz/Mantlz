"use client"

import { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, MousePointer2, Type } from "lucide-react";
import { toast } from "sonner";

interface AccessibilitySettingsProps {
  className?: string;
}

export function AccessibilitySettings({ className }: AccessibilitySettingsProps) {
  const [settings, setSettings] = useState({
    highContrast: false,
    largerText: false,
    screenReader: false,
  });

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      // Apply saved settings on mount
      applyAccessibilitySettings(parsedSettings);
    }
  }, []);

  const applyAccessibilitySettings = (newSettings: typeof settings) => {
    // Apply High Contrast
    if (newSettings.highContrast) {
      document.documentElement.classList.add('high-contrast');
      // Check if dark mode is enabled
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      if (isDarkMode) {
        // Dark mode high contrast
        document.documentElement.style.setProperty('--background', '#1a1a1a');
        document.documentElement.style.setProperty('--foreground', '#ffffff');
        document.documentElement.style.setProperty('--muted', '#666666');
        document.documentElement.style.setProperty('--muted-foreground', '#999999');
        document.documentElement.style.setProperty('--border', '#ffffff');
        document.documentElement.style.setProperty('--input', '#ffffff');
        document.documentElement.style.setProperty('--ring', '#ffffff');
      } else {
        // Light mode high contrast
        document.documentElement.style.setProperty('--background', '#ffffff');
        document.documentElement.style.setProperty('--foreground', '#1a1a1a');
        document.documentElement.style.setProperty('--muted', '#333333');
        document.documentElement.style.setProperty('--muted-foreground', '#666666');
        document.documentElement.style.setProperty('--border', '#1a1a1a');
        document.documentElement.style.setProperty('--input', '#1a1a1a');
        document.documentElement.style.setProperty('--ring', '#1a1a1a');
      }
    } else {
      document.documentElement.classList.remove('high-contrast');
      document.documentElement.style.removeProperty('--background');
      document.documentElement.style.removeProperty('--foreground');
      document.documentElement.style.removeProperty('--muted');
      document.documentElement.style.removeProperty('--muted-foreground');
      document.documentElement.style.removeProperty('--border');
      document.documentElement.style.removeProperty('--input');
      document.documentElement.style.removeProperty('--ring');
    }

    // Apply Larger Text
    if (newSettings.largerText) {
      document.documentElement.classList.add('larger-text');
      // Check if dark mode is enabled
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      if (isDarkMode) {
        // Dark mode text settings
        document.documentElement.style.setProperty('--font-size-base', '90%');
        document.documentElement.style.setProperty('--line-height-base', '1.1');
        document.documentElement.style.setProperty('--text-color', '#ffffff');
        document.documentElement.style.setProperty('--text-muted', '#a3a3a3');
      } else {
        // Light mode text settings
        document.documentElement.style.setProperty('--font-size-base', '90%');
        document.documentElement.style.setProperty('--line-height-base', '1.1');
        document.documentElement.style.setProperty('--text-color', '#000000');
        document.documentElement.style.setProperty('--text-muted', '#666666');
      }
    } else {
      document.documentElement.classList.remove('larger-text');
      document.documentElement.style.removeProperty('--font-size-base');
      document.documentElement.style.removeProperty('--line-height-base');
      document.documentElement.style.removeProperty('--text-color');
      document.documentElement.style.removeProperty('--text-muted');
    }

    // Apply Screen Reader Optimization
    if (newSettings.screenReader) {
      document.documentElement.setAttribute('role', 'application');
      document.documentElement.setAttribute('aria-label', 'Application');
    } else {
      document.documentElement.removeAttribute('role');
      document.documentElement.removeAttribute('aria-label');
    }
  };

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
    applyAccessibilitySettings(newSettings);
    
    // Show toast notification
    toast.success(`Accessibility setting updated: ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`, {
      className: "dark:bg-zinc-900 dark:text-white dark:border-zinc-800",
      duration: 2000,
    });
  };

  const saveSettings = () => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    toast.success("Accessibility settings saved", {
      className: "dark:bg-zinc-900 dark:text-white dark:border-zinc-800",
      duration: 2000,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <header className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Accessibility Settings</h2>
        <div className="w-12 h-0.5 bg-zinc-300 dark:bg-zinc-700 my-1.5"></div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Customize your accessibility preferences</p>
      </header>

      <main className="space-y-4">
        <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">Display</h3>

          <div className="space-y-2">
            {/* High Contrast */}
            <div className="flex items-center justify-between p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-zinc-200 dark:bg-zinc-800">
                  <Eye className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                </div>
                <div>
                  <Label htmlFor="highContrast" className="text-sm font-medium text-zinc-900 dark:text-white">
                    High Contrast
                  </Label>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Increase contrast for better readability</p>
                </div>
              </div>
              <Switch
                id="highContrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              />
            </div>

            {/* Larger Text */}
            <div className="flex items-center justify-between p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-zinc-200 dark:bg-zinc-800">
                  <Type className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                </div>
                <div>
                  <Label htmlFor="largerText" className="text-sm font-medium text-zinc-900 dark:text-white">
                    Larger Text
                  </Label>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Increase text size throughout the application</p>
                </div>
              </div>
              <Switch
                id="largerText"
                checked={settings.largerText}
                onCheckedChange={(checked) => updateSetting('largerText', checked)}
              />
            </div>
          </div>
        </div>

        <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">Screen Reader</h3>

          <div className="space-y-2">
            {/* Screen Reader */}
            <div className="flex items-center justify-between p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-zinc-200 dark:bg-zinc-800">
                  <MousePointer2 className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                </div>
                <div>
                  <Label htmlFor="screenReader" className="text-sm font-medium text-zinc-900 dark:text-white">
                    Screen Reader Optimization
                  </Label>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Enhance compatibility with screen readers</p>
                </div>
              </div>
              <Switch
                id="screenReader"
                checked={settings.screenReader}
                onCheckedChange={(checked) => updateSetting('screenReader', checked)}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="flex justify-end mt-4">
        <Button 
          onClick={saveSettings}
          className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-sm font-medium px-3 py-1.5 rounded-md border border-zinc-700 dark:border-zinc-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:translate-y-[-1px] transition-all"
        >
          Save Settings
        </Button>
      </footer>
    </div>
  );
}
