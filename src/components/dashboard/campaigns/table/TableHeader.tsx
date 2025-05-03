"use client"

import { useRef } from "react"
import { useRouter, ReadonlyURLSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlusCircle, ChevronLeft, Mail, Clock, Send } from "lucide-react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormsResponse, CampaignResponse } from "./types"
import { useState } from "react"
import { client } from "@/lib/client"
import { CampaignSearch } from "../CampaignSearch"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface TableHeaderProps {
  formId: string | null
  formsData?: FormsResponse
  searchParams: ReadonlyURLSearchParams
  router: ReturnType<typeof useRouter>
  campaignsData?: CampaignResponse
}

export function TableHeader({
  formId,
  formsData,
  searchParams,
  router,
  campaignsData,
}: TableHeaderProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [campaignName, setCampaignName] = useState("")
  const [campaignDescription, setCampaignDescription] = useState("")
  const [campaignSubject, setCampaignSubject] = useState("")
  const [campaignContent, setCampaignContent] = useState("")
  const createButtonRef = useRef<HTMLButtonElement>(null)
  
  // Find the current form name
  const currentForm = formsData?.forms.find(form => form.id === formId)
  
  const handleFormSelect = (formId: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set("formId", formId)
    newParams.delete("page")
    router.push(`?${newParams.toString()}`)
  }
  
  const handleBackClick = () => {
    router.push("/dashboard/campaigns")
  }
  
  const handleCreateCampaign = async () => {
    if (!formId) {
      alert("Please select a form first")
      return
    }
    
    if (!campaignName || !campaignSubject || !campaignContent) {
      alert("Please fill out all required fields")
      return
    }
    
    try {
      setLoading(true)
      
      const response = await client.campaign.create.$post({
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
      
      // Refresh page
      router.refresh()
    } catch (error) {
      console.error("Error creating campaign", error)
      alert("Failed to create campaign")
    } finally {
      setLoading(false)
    }
  }
  
  const selectedForm = formsData?.forms?.find((f: any) => f.id === formId)
  const campaignCount = campaignsData?.campaigns?.length || 0
  const lastCampaign = campaignCount > 0 ? campaignsData?.campaigns[0] : null

  return (
    <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg px-3"
                  onClick={handleBackClick}
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden xs:inline">Back to Forms</span>
                </Button>
                {selectedForm && (
                  <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    Form ID: {selectedForm?.id.slice(0, 8)}...
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                {selectedForm?.name || "Select a Form"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <CampaignSearch />
              
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="gap-1.5"
                    data-create-campaign-button
                    ref={createButtonRef}
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Create Campaign</span>
                    <span className="sm:hidden">Create</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Create New Campaign</DialogTitle>
                    <DialogDescription>
                      Create a new email campaign to send to your form submissions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Campaign Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Monthly Newsletter" 
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        This is for your reference only. Recipients won't see this.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Brief description of this campaign's purpose"
                        value={campaignDescription}
                        onChange={(e) => setCampaignDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Email Subject</Label>
                      <Input 
                        id="subject" 
                        placeholder="Your form has been received"
                        value={campaignSubject}
                        onChange={(e) => setCampaignSubject(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Email Content</Label>
                      <Textarea 
                        id="content" 
                        placeholder="Enter email content (HTML supported)" 
                        className="min-h-[200px]"
                        value={campaignContent}
                        onChange={(e) => setCampaignContent(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCampaign} disabled={loading}>
                      {loading ? "Creating..." : "Create Campaign"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Description */}
          {selectedForm?.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
              {selectedForm.description}
            </p>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{campaignCount}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Campaigns</p>
                </div>
              </div>
              <div className="mt-2 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                <div 
                  className="h-full bg-black dark:bg-white rounded-lg transition-all duration-500"
                  style={{ width: `${Math.min((campaignCount / 100) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedForm?.createdAt ? formatDistanceToNow(new Date(selectedForm.createdAt), { addSuffix: true }) : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Form Created</p>
                </div>
              </div>
            </div>

            {/* Last Campaign Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Send className="h-5 w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {lastCampaign ? formatDistanceToNow(new Date(lastCampaign.createdAt), { addSuffix: true }) : 'No campaigns yet'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last Campaign</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 