"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { client } from "@/lib/client"
import { PlusCircle } from "lucide-react"

interface CreateCampaignDialogProps {
  formId: string | null
  isPremium: boolean
  onUpgradeClick: () => void
}

export function CreateCampaignDialog({
  formId,
  isPremium,
  onUpgradeClick
}: CreateCampaignDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [campaignName, setCampaignName] = useState("")
  const [campaignDescription, setCampaignDescription] = useState("")
  const [campaignSubject, setCampaignSubject] = useState("")
  const [campaignContent, setCampaignContent] = useState("")

  const handleCreateCampaign = async () => {
    if (!formId) {
      toast.error("Please select a form first")
      return
    }
    
    if (!campaignName || !campaignSubject || !campaignContent) {
      toast.error("Please fill out all required fields")
      return
    }
    
    try {
      setLoading(true)
      
      await client.campaign.create.$post({
        name: campaignName,
        description: campaignDescription || undefined,
        formId,
        subject: campaignSubject,
        content: campaignContent
      })
      
      // Reset form
      setCampaignName("")
      setCampaignDescription("")
      setCampaignSubject("")
      setCampaignContent("")
      
      // Close dialog
      setOpen(false)
      
      // Show success toast
      toast.success("Campaign created successfully")
      
      // Refresh page
      router.refresh()
    } catch (error: any) {
      console.error("Error creating campaign", error)
      // Check if it's a quota limit error
      if (error?.message?.includes("Monthly campaign limit")) {
        toast.error("You've reached your monthly campaign limit. Upgrade your plan to create more campaigns.", {
          duration: 3000,
          action: {
            label: "Upgrade",
            onClick: () => router.push("/dashboard/settings/billing")
          }
        })
      } else {
        toast.error("Failed to create campaign")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            if (!isPremium) {
              onUpgradeClick()
              return
            }
            setOpen(true)
          }}
          size="sm"
          className="gap-1.5 px-4"
          disabled={!isPremium}
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Create Campaign</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">Create New Campaign</DialogTitle>
          <DialogDescription className="mt-2">
            Create a new email campaign to send to your form submissions.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Campaign Name</Label>
              <Input 
                id="name" 
                placeholder="Monthly Newsletter" 
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This is for your reference only. Recipients won't see this.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
              <Textarea 
                id="description" 
                placeholder="Brief description of this campaign's purpose"
                value={campaignDescription}
                onChange={(e) => setCampaignDescription(e.target.value)}
                className="w-full min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">Email Subject</Label>
              <Input 
                id="subject" 
                placeholder="Your form has been received"
                value={campaignSubject}
                onChange={(e) => setCampaignSubject(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium">Email Content</Label>
              <Textarea 
                id="content" 
                placeholder="Enter email content (HTML supported)" 
                className="w-full min-h-[200px]"
                value={campaignContent}
                onChange={(e) => setCampaignContent(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 bg-gray-50 dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateCampaign} disabled={loading}>
            {loading ? "Creating..." : "Create Campaign"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 