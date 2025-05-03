"use client"

import { useEffect, useState } from "react"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { ReadonlyURLSearchParams } from "next/navigation"
import { CampaignSearch } from "../CampaignSearch"
import { Button } from "@/components/ui/button"
import { ChevronLeft, PlusCircle } from "lucide-react"
import { CampaignResponse, FormsResponse } from "./types"
import { 
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createCampaign } from "./tableUtils"

interface TableHeaderProps {
  formId: string
  formsData?: FormsResponse
  searchParams: ReadonlyURLSearchParams
  router: AppRouterInstance
  campaignsData?: CampaignResponse
}

export function TableHeader({
  formId,
  formsData,
  searchParams,
  router,
  campaignsData,
}: TableHeaderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    subject: "",
    content: ""
  })

  // Get the current form
  const currentForm = formsData?.forms.find((form) => form.id === formId)

  // Handle going back to forms list
  const handleBackToForms = () => {
    const newParams = new URLSearchParams()
    router.push(`/dashboard/campaigns?${newParams.toString()}`)
  }
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewCampaign({
      ...newCampaign,
      [e.target.name]: e.target.value,
    })
  }
  
  // Handle campaign creation
  const handleCreateCampaign = async () => {
    try {
      setIsCreating(true)
      
      await createCampaign({
        ...newCampaign,
        formId
      })
      
      // Close dialog and reset form
      setIsCreateDialogOpen(false)
      setNewCampaign({
        name: "",
        description: "",
        subject: "",
        content: ""
      })
      
      // Force a refresh to show the new campaign
      router.refresh()
    } catch (error) {
      console.error("Error creating campaign:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleBackToForms}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to forms</span>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">
              {currentForm?.name || "Form Campaigns"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {campaignsData?.campaigns.length || 0} campaign(s)
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="ml-auto flex items-center gap-1"
                data-create-campaign-button
              >
                <PlusCircle className="h-4 w-4" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create a new campaign</DialogTitle>
                <DialogDescription>
                  Create an email campaign to send to your form submissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={newCampaign.name} 
                    onChange={handleInputChange}
                    placeholder="Enter campaign name" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={newCampaign.description} 
                    onChange={handleInputChange}
                    placeholder="Enter campaign description" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input 
                    id="subject" 
                    name="subject"
                    value={newCampaign.subject} 
                    onChange={handleInputChange}
                    placeholder="Enter email subject" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Email Content</Label>
                  <Textarea 
                    id="content" 
                    name="content"
                    value={newCampaign.content} 
                    onChange={handleInputChange}
                    placeholder="Enter email content (HTML supported)" 
                    className="min-h-[120px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateCampaign} 
                  disabled={
                    isCreating || 
                    !newCampaign.name || 
                    !newCampaign.subject || 
                    !newCampaign.content
                  }
                >
                  {isCreating ? "Creating..." : "Create Campaign"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <CampaignSearch />
      </div>
    </div>
  )
} 