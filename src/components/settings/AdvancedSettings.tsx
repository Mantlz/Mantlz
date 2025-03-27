"use client"

import React, { useState, useEffect } from "react";
import { Loader2, RefreshCw, AlertCircle, Bug, Link, Clock, Settings, Terminal, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { client } from "@/lib/client";

import { Label } from "@/components/ui/label";



interface AdvancedSettings {
  debugMode: boolean;
  apiEndpoint: string;
  cacheTimeout: string;
  maxRetries: string;
  developerAlerts: {
    enabled: boolean;
    threshold: string; // Number of form submissions before alerting
  };
}

export function AdvancedSettings() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [settings, setSettings] = useState<AdvancedSettings>({
    debugMode: false,
    apiEndpoint: "",
    cacheTimeout: "3600",
    maxRetries: "3",
    developerAlerts: {
      enabled: false,
      threshold: "50",
    }
  });

  const updateSettingsMutation = async (data: {
    formId: string;
    developerNotificationsEnabled: boolean;
    maxNotificationsPerHour: number;
  }) => {
    try {
      await client.forms.updateEmailSettings.$post(data);
      toast.success('Advanced settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Load settings from localStorage
      const savedSettings = localStorage.getItem('advanced-settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const updateSetting = (key: keyof typeof settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('advanced-settings', JSON.stringify(newSettings));
    
    toast.success(`Advanced setting updated: ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`);

    // Update developer notification settings in the database
    if (key === 'developerAlerts') {
      updateSettingsMutation({
        formId: 'global',
        developerNotificationsEnabled: value.enabled,
        maxNotificationsPerHour: parseInt(value.threshold),
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <header className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Advanced Settings</h2>
        <div className="w-12 h-0.5 bg-zinc-300 dark:bg-zinc-700 my-1.5"></div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Configure advanced application settings</p>
      </header>

      <main className="space-y-4">
        <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">Debug Options</h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-zinc-200 dark:bg-zinc-800">
                  <Bug className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                </div>
                <div>
                  <Label htmlFor="debugMode" className="text-sm font-medium text-zinc-900 dark:text-white">
                    Debug Mode
                  </Label>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Enable detailed logging and debugging features</p>
                </div>
              </div>
              <Switch
                id="debugMode"
                checked={settings.debugMode}
                onCheckedChange={(checked) => updateSetting('debugMode', checked)}
              />
            </div>
          </div>
        </div>

    


        <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">Developer Alerts</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-zinc-200 dark:bg-zinc-800">
                  <Bell className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                </div>
                <div>
                  <Label htmlFor="developerAlerts" className="text-sm font-medium text-zinc-900 dark:text-white">
                    Form Submission Alerts
                  </Label>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Get notified about high form submission volumes</p>
                </div>
              </div>
              <Switch
                id="developerAlerts"
                checked={settings.developerAlerts.enabled}
                onCheckedChange={(checked) => updateSetting('developerAlerts', { 
                  ...settings.developerAlerts,
                  enabled: checked 
                })}
              />
            </div>

            {settings.developerAlerts.enabled && (
              <div className="space-y-2 px-2">
                <Label className="text-sm text-zinc-900 dark:text-white">Alert Threshold</Label>
                <Input
                  type="number"
                  value={settings.developerAlerts.threshold}
                  onChange={(e) => updateSetting('developerAlerts', {
                    ...settings.developerAlerts,
                    threshold: e.target.value
                  })}
                  placeholder="50"
                  className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                />
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Alert when form submissions exceed this number per hour
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="flex justify-end mt-4">
        <Button 
          onClick={() => {
            localStorage.setItem('advanced-settings', JSON.stringify(settings));
            toast.success('Settings saved successfully');
          }}
          className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-sm font-medium px-3 py-1.5 rounded-md border border-zinc-700 dark:border-zinc-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:translate-y-[-1px] transition-all"
        >
          Save Settings
        </Button>
      </footer>
    </div>
  );
} 