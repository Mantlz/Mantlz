"use client"

import { Mail } from "lucide-react"


interface NoCampaignsViewProps {
  isPremium?: boolean
  onUpgradeClick?: () => void
}

export function NoCampaignsView({ isPremium = false, }: NoCampaignsViewProps) {

  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
        <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
          {isPremium ? "No campaigns yet" : "Upgrade to create campaigns"}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          {isPremium 
            ? "Create your first campaign to start sending emails to your form submissions."
            : "Create and manage email campaigns with advanced features like scheduling, analytics, and more. Available on Standard and Pro plans."}
        </p>
      </div>
    </div>
  )
} 