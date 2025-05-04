"use client"

import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"

interface NoCampaignsViewProps {
  isPremium?: boolean
  onUpgradeClick?: () => void
}

export function NoCampaignsView({ isPremium = false, onUpgradeClick }: NoCampaignsViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const formId = searchParams.get("formId")
  
  const handleCreateCampaign = () => {
    if (!isPremium) {
      onUpgradeClick?.();
      return;
    }
    // Get the current dialog from the table header to open
    const createButton = document.querySelector("[data-create-campaign-button]") as HTMLButtonElement
    if (createButton) {
      createButton.click()
    }
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
        <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
          {isPremium ? "No campaigns yet" : "Upgrade to create campaigns"}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isPremium 
            ? "Create your first campaign to start sending emails to your form submissions."
            : "Create and manage email campaigns with advanced features like scheduling, analytics, and more. Available on Standard and Pro plans."}
        </p>
      </div>
      <Button 
        size="sm" 
        className="mt-4" 
        onClick={handleCreateCampaign}
      >
        {isPremium ? "Create Campaign" : "Upgrade Now"}
      </Button>
    </div>
  )
} 