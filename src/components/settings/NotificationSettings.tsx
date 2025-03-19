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
    <div className="w-full max-w-2xl mx-auto bg-background rounded-lg p-2 space-y-6">
      <header className="pb-2 space-y-1">
        <h2 className="text-2xl font-semibold">Notification Settings</h2>
        <p className="text-muted-foreground">Manage how you receive notifications and updates</p>
      </header>

      <main className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Channels</h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="emailNotifications" className="font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggleChange("emailNotifications")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="pushNotifications" className="font-medium">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
              </div>
            </div>
            <Switch
              id="pushNotifications"
              checked={settings.pushNotifications}
              onCheckedChange={() => handleToggleChange("pushNotifications")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="smsNotifications" className="font-medium">
                  SMS Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive text messages for important updates</p>
              </div>
            </div>
            <Switch
              id="smsNotifications"
              checked={settings.smsNotifications}
              onCheckedChange={() => handleToggleChange("smsNotifications")}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Types</h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="securityAlerts" className="font-medium">
                  Security Alerts
                </Label>
                <p className="text-sm text-muted-foreground">Get notified about security-related events</p>
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

      <footer className="pt-4 flex justify-end">
        <Button onClick={saveSettings}>Save Settings</Button>
      </footer>
    </div>
  )
}

