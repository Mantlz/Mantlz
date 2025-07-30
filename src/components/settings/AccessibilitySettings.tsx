"use client"

import { useState, useEffect, useCallback } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, MousePointer2, Type } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AccessibilitySettingsProps {
  className?: string;
}

export function AccessibilitySettings({ className }: AccessibilitySettingsProps) {
  const [settings, setSettings] = useState({
    highContrast: false,
    largerText: false,
    screenReader: false,
  });
  const [saving, setSaving] = useState(false);

  const applyAccessibilitySettings = useCallback((newSettings: typeof settings) => {
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
  }, []);

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      // Apply saved settings on mount
      applyAccessibilitySettings(parsedSettings);
    }
  }, [applyAccessibilitySettings]);

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    // Prevent high contrast from being updated
    if (key === 'highContrast') return;
    
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
    applyAccessibilitySettings(newSettings);
    
    toast.success(`Accessibility setting updated: ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`, {
      className: "dark:bg-zinc-900 dark:text-white dark:border-zinc-800",
      duration: 2000,
    });
  };

  const saveSettings = () => {
    setSaving(true);
    
    // Simulate a slight delay since localStorage is synchronous
    setTimeout(() => {
      localStorage.setItem('accessibility-settings', JSON.stringify(settings));
      
      toast.success("Accessibility settings saved", {
        className: "dark:bg-zinc-900 dark:text-white dark:border-zinc-800",
        duration: 2000,
      });
      
      setSaving(false);
    }, 600);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className || ''}`}>
      <ScrollArea className="h-[550px]">
        <div className="w-full space-y-4 pr-4">
          <header className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                  Accessibility Settings
                </h2>
              </div>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Customize your accessibility preferences
            </p>
          </header>

          <Card className="border-zinc-200 dark:border-zinc-800 ">
            <CardHeader className="pb-3 pt-4 px-5">
              <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
                <Eye className="h-4 w-4 mr-2 text-zinc-500" />
                Display Settings
              </CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs">
                Adjust display settings for better visibility
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-5 pb-4 space-y-3">
              {/* High Contrast */}
              <div className="flex items-center justify-between gap-3  px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm opacity-75">
                <div className="flex items-center gap-4">
                  <div className="bg-white/50 dark:bg-zinc-900/50 rounded-lg p-2 border border-zinc-200 dark:border-zinc-800">
                    <Eye className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <Label htmlFor="highContrast" className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      High Contrast
                    </Label>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Coming soon - Color scheme in development
                    </span>
                  </div>
                </div>
                <Switch
                  id="highContrast"
                  checked={false}
                  disabled={true}
                  className="data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-600 cursor-not-allowed opacity-50"
                />
              </div>

              {/* Larger Text */}
              <div className="flex items-center justify-between gap-3  px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="bg-white dark:bg-zinc-900 rounded-lg p-2 border border-zinc-200 dark:border-zinc-800">
                    <Type className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <Label htmlFor="largerText" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      Larger Text
                    </Label>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {settings.largerText ? (
                        <span className="text-emerald-600 dark:text-emerald-500 font-medium">
                          Enabled
                        </span>
                      ) : (
                        <span className="text-zinc-500 dark:text-zinc-400">
                          Disabled
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <Switch
                  id="largerText"
                  checked={settings.largerText}
                  onCheckedChange={(checked) => updateSetting('largerText', checked)}
                  className="data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-600"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3 pt-4 px-5">
              <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
                <MousePointer2 className="h-4 w-4 mr-2 text-zinc-500" />
                Screen Reader Settings
              </CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs">
                Configure screen reader optimization
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-2 pb-2">
              <div className="flex items-center justify-between gap-3  px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="bg-white dark:bg-zinc-900 rounded-lg p-2 border border-zinc-200 dark:border-zinc-800">
                    <MousePointer2 className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="screenReader" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      Screen Reader Optimization
                    </Label>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {settings.screenReader ? (
                        <span className="text-emerald-600 dark:text-emerald-500 font-medium">
                          Enabled
                        </span>
                      ) : (
                        <span className="text-zinc-500 dark:text-zinc-400">
                          Disabled
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <Switch
                  id="screenReader"
                  checked={settings.screenReader}
                  onCheckedChange={(checked) => updateSetting('screenReader', checked)}
                  className="data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-600"
                />
              </div>
            </CardContent>
          </Card>

          <footer className="flex justify-end mt-4 pb-4">
            <Button 
              onClick={saveSettings}
              disabled={saving}
              className=" hover:bg-zinc-800  dark:hover:bg-zinc-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg border border-zinc-700 dark:border-zinc-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:translate-y-[-1px] transition-all"
            >
              {saving ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : "Save Settings"}
            </Button>
          </footer>
        </div>
      </ScrollArea>
    </div>
  );
}
