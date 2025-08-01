"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { client } from "@/lib/client"
import { PlusCircle, Send, Eye, Save, RotateCcw } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { Separator } from "@/components/ui/separator"

interface CreateCampaignDialogProps {
  formId: string | null
  isPremium: boolean
  onUpgradeClick: () => void
}

interface DraftData {
  campaignName: string
  campaignDescription: string
  campaignSubject: string
  campaignContent: string
  lastSaved: string
}

export function CreateCampaignDialog({
  formId,
  isPremium,
  onUpgradeClick
}: CreateCampaignDialogProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [campaignName, setCampaignName] = useState("")
  const [campaignDescription, setCampaignDescription] = useState("")
  const [campaignSubject, setCampaignSubject] = useState("")
  const [campaignContent, setCampaignContent] = useState("")
  const [isPreview, setIsPreview] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  const isFormValid = campaignName && campaignSubject && campaignContent
  const DRAFT_KEY = `campaign-draft-${formId}`

  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY)
      if (savedDraft) {
        const draft: DraftData = JSON.parse(savedDraft)
        setCampaignName(draft.campaignName || "")
        setCampaignDescription(draft.campaignDescription || "")
        setCampaignSubject(draft.campaignSubject || "")
        setCampaignContent(draft.campaignContent || "")
        setLastSaved(draft.lastSaved)
        setHasDraft(true)
      }
    } catch (error) {
      console.error('Error loading draft:', error)
    }
  }, [DRAFT_KEY, setCampaignName, setCampaignDescription, setCampaignSubject, setCampaignContent, setLastSaved, setHasDraft])

  const saveDraft = useCallback((silent = false) => {
    try {
      const draftData: DraftData = {
        campaignName,
        campaignDescription,
        campaignSubject,
        campaignContent,
        lastSaved: new Date().toISOString()
      }
      
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData))
      setLastSaved(draftData.lastSaved)
      setHasDraft(true)
      
      if (!silent) {
        toast.success("Draft saved")
      }
    } catch (error) {
      console.error('Error saving draft:', error)
      if (!silent) {
        toast.error("Failed to save draft")
      }
    }
  }, [DRAFT_KEY, campaignName, campaignDescription, campaignSubject, campaignContent, setLastSaved, setHasDraft])

  // Load draft on component mount and when dialog opens
  useEffect(() => {
    if (open && typeof window !== 'undefined') {
      loadDraft()
    }
  }, [open, formId, loadDraft])

  // Auto-save draft every 30 seconds if there's content
  useEffect(() => {
    if (!open) return
    
    const autoSaveInterval = setInterval(() => {
      if (campaignName || campaignSubject || campaignContent || campaignDescription) {
        saveDraft(true) // true for silent save
      }
    }, 30000) // 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [open, campaignName, campaignSubject, campaignContent, campaignDescription, saveDraft])

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY)
      setHasDraft(false)
      setLastSaved(null)
      toast.success("Draft cleared")
    } catch (error) {
      console.error('Error clearing draft:', error)
    }
  }

  const resetForm = () => {
    setCampaignName("")
    setCampaignDescription("")
    setCampaignSubject("")
    setCampaignContent("")
    setLastSaved(null)
    setHasDraft(false)
  }

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
      
      // Clear draft after successful creation
      localStorage.removeItem(DRAFT_KEY)
      
      // Reset form
      resetForm()
      
      // Close dialog
      setOpen(false)
      
      // Show success toast
      toast.success("Campaign created successfully")
      
      // Invalidate React Query cache to update the table without a page refresh
      if (formId) {
        await queryClient.invalidateQueries({ queryKey: ["campaignLogs", formId] })
        console.log("Campaign cache invalidated for formId:", formId)
      }
      
      // Refresh page (soft refresh, but not really needed)
      router.refresh()
    } catch (error: unknown) {
      console.error("Error creating campaign", error)
      // Check if it's a quota limit error
      if (error instanceof Error && error.message.includes("Monthly campaign limit")) {
        toast.error("You've reached your monthly campaign limit. Upgrade your plan to create more campaigns.", {
          duration: 3000,
          action: {
            label: "Upgrade",
            onClick: () => router.push("/dashboard/pricing")
          }
        })
      } else {
        toast.error("Failed to create campaign")
      }
    } finally {
      setLoading(false)
    }
  }

  const formatLastSaved = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
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
          className="h-8 px-2 text-md bg-amber-500 text-black/70 dark:text-white dark:border-background border text-sm shadow-md shadow-zinc-950/30 ring ring-inset ring-white/20 transition-[filter] duration-200 hover:brightness-125 active:brightness-95"

          disabled={!isPremium}
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Create Campaign</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] p-0 overflow-hidden">
        {/* Simple Header */}
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <DialogTitle className="text-lg font-semibold">New Campaign</DialogTitle>
                {lastSaved && (
                  <DialogDescription className="text-xs text-green-600">
                    Saved {formatLastSaved(lastSaved)}
                  </DialogDescription>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 mr-5">
              {hasDraft && (
                <Button variant="ghost" size="sm" onClick={clearDraft}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => saveDraft()}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsPreview(!isPreview)}>
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        {!isPreview ? (
          /* Compose Mode */
          <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(85vh-140px)]">
            {/* Campaign Name */}
            <div className="space-y-2 ">
              <Label htmlFor="name" className="text-sm font-medium">Campaign Name</Label>
              <Input 
                id="name" 
                placeholder="Welcome Series #1" 
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
              <Input 
                id="description" 
                placeholder="Brief description"
                value={campaignDescription}
                onChange={(e) => setCampaignDescription(e.target.value)}
                className="h-9"
              />
            </div>

            <Separator />

            {/* Subject Line */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">Subject Line</Label>
              <Input 
                id="subject" 
                placeholder="Welcome! Your form submission was received"
                value={campaignSubject}
                onChange={(e) => setCampaignSubject(e.target.value)}
                className="h-10 font-medium"
              />
            </div>

            {/* Email Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium">Email Content</Label>
              <Textarea 
                id="content" 
                placeholder="Write your email content here...\n\nYou can use HTML for formatting:\n• <strong>Bold text</strong>\n• <em>Italic text</em>\n• <a href='#'>Links</a>"
                className="min-h-[200px] resize-none text-sm"
                value={campaignContent}
                onChange={(e) => setCampaignContent(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                💡 HTML supported. Variables like {'{name}'} coming soon.
              </p>
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div className="p-4 overflow-y-auto max-h-[calc(85vh-140px)]">
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <div className="space-y-3">
                <div className="border-b pb-2">
                  <h3 className="font-semibold">
                    {campaignSubject || "Subject Line Preview"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    From: Your Campaign • To: Form Subscribers
                  </p>
                </div>
                <div 
                  className="prose prose-sm max-w-none text-sm"
                  dangerouslySetInnerHTML={{ 
                    __html: campaignContent || "<p>Your email content will appear here...</p>" 
                  }}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {isFormValid ? (
                <span className="text-green-600">✓ Ready to send</span>
              ) : (
                <span>Fill required fields</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button 
                size="sm"
                            className="h-8 px-2 text-md gap-1 bg-amber-500 text-white dark:text-black dark:border-background border text-sm shadow-md shadow-zinc-950/30 ring ring-inset ring-white/20 transition-[filter] duration-200 hover:brightness-125 active:brightness-95"

                onClick={handleCreateCampaign} 
                disabled={loading || !isFormValid}

              >
                {loading ? (
                  "Creating..."
                ) : (
                  <>
                    <Send className="h-3 w-3" />
                    Create
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}