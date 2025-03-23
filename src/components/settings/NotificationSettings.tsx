"use client"

import { useState } from "react"
import { Bell, Mail, Phone, Shield } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
// import { toast } from "@/hooks/use-toast"

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    securityAlerts: true,
    marketingEmails: false,
    frequency: "immediate",
  })

  const handleToggleChange = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleFrequencyChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      frequency: value,
    }))
  }

  const saveSettings = () => {
    // Here you would typically save the settings to a database
    // toast({
    //   title: "Settings saved",
    //   description: "Your notification preferences have been updated.",
    // })
  }

  return (
    <div className="w-full space-y-6">
      <header className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Notification Settings</h2>
        <div className="w-16 h-0.5 bg-zinc-300 dark:bg-zinc-700 my-2"></div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Manage how you receive notifications and updates</p>
      </header>

      <main className="space-y-6">
        <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
          <h3 className="text-base font-medium text-zinc-900 dark:text-white mb-4">Notification Channels</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-zinc-200 dark:bg-zinc-800">
                  <Mail className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                </div>
                <div>
                  <Label htmlFor="emailNotifications" className="font-medium text-zinc-800 dark:text-zinc-200">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Receive updates via email</p>
                </div>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggleChange("emailNotifications")}
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-zinc-200 dark:bg-zinc-800">
                  <Bell className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                </div>
                <div>
                  <Label htmlFor="pushNotifications" className="font-medium text-zinc-800 dark:text-zinc-200">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Receive notifications in your browser</p>
                </div>
              </div>
              <Switch
                id="pushNotifications"
                checked={settings.pushNotifications}
                onCheckedChange={() => handleToggleChange("pushNotifications")}
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-zinc-200 dark:bg-zinc-800">
                  <Phone className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                </div>
                <div>
                  <Label htmlFor="smsNotifications" className="font-medium text-zinc-800 dark:text-zinc-200">
                    SMS Notifications
                  </Label>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Receive text messages for important updates</p>
                </div>
              </div>
              <Switch
                id="smsNotifications"
                checked={settings.smsNotifications}
                onCheckedChange={() => handleToggleChange("smsNotifications")}
              />
            </div>
          </div>
        </div>

        <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
          <h3 className="text-base font-medium text-zinc-900 dark:text-white mb-4">Notification Types</h3>

          <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-md bg-zinc-200 dark:bg-zinc-800">
                <Shield className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
              </div>
              <div>
                <Label htmlFor="securityAlerts" className="font-medium text-zinc-800 dark:text-zinc-200">
                  Security Alerts
                </Label>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Get notified about security-related events</p>
              </div>
            </div>
            <Switch
              id="securityAlerts"
              checked={settings.securityAlerts}
              onCheckedChange={() => handleToggleChange("securityAlerts")}
            />
          </div>
        </div>
      </main>

      <footer className="flex justify-end mt-6">
        <Button 
          onClick={saveSettings}
          className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-medium px-4 py-2 rounded-md border border-zinc-700 dark:border-zinc-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:translate-y-[-1px] transition-all"
        >
          Save Settings
        </Button>
      </footer>
    </div>
  )
}




