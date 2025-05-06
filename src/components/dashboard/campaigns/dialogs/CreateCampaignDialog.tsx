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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, Info, Mail, MessageSquare, Sparkles, Send, LayoutTemplate } from "lucide-react"

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
  const [activeTab, setActiveTab] = useState("details")

  const isDetailsComplete = campaignName && campaignSubject
  const isContentComplete = campaignContent

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
          className="gap-1.5 px-4 hover:scale-[1.02] transition-transform duration-200"
          disabled={!isPremium}
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Create Campaign</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-800 shadow-xl">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-zinc-950 dark:to-zinc-900 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <DialogTitle className="text-xl font-semibold">Create New Campaign</DialogTitle>
          </div>
          <DialogDescription className="mt-2 text-sm opacity-80">
            Create a new email campaign to send to your form submissions.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-100 dark:border-zinc-800">
            <TabsList className="w-full justify-start rounded-none h-12 bg-transparent p-0 pl-6">
              <TabsTrigger 
                value="details" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none h-12 px-4"
              >
                <Info className="h-4 w-4 mr-2" />
                Campaign Details
                {isDetailsComplete && <div className="ml-2 h-2 w-2 rounded-full bg-green-500"></div>}
              </TabsTrigger>
              <TabsTrigger 
                value="content" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none h-12 px-4"
                disabled={!isDetailsComplete}
              >
                <LayoutTemplate className="h-4 w-4 mr-2" />
                Email Content
                {isContentComplete && <div className="ml-2 h-2 w-2 rounded-full bg-green-500"></div>}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="details" className="m-0 p-0">
            <div className="p-6 space-y-5">
              <Card className="border border-gray-100 dark:border-zinc-800 shadow-sm">
                <CardContent className="p-5 space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="name" className="text-sm font-medium">Campaign Name</Label>
                    </div>
                    <Input 
                      id="name" 
                      placeholder="Monthly Newsletter" 
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
                      This is for your reference only. Recipients won&apos;t see this.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
                    </div>
                    <Textarea 
                      id="description" 
                      placeholder="Brief description of this campaign's purpose"
                      value={campaignDescription}
                      onChange={(e) => setCampaignDescription(e.target.value)}
                      className="w-full min-h-[80px] focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="subject" className="text-sm font-medium">Email Subject</Label>
                    </div>
                    <Input 
                      id="subject" 
                      placeholder="Your form has been received"
                      value={campaignSubject}
                      onChange={(e) => setCampaignSubject(e.target.value)}
                      className="w-full focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={() => setActiveTab("content")} 
                  disabled={!isDetailsComplete}
                  className="gap-2 hover:scale-[1.02] transition-transform duration-200"
                >
                  Continue to Content
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="m-0 p-0">
            <div className="p-6 space-y-5">
              <Card className="border border-gray-100 dark:border-zinc-800 shadow-sm">
                <CardContent className="p-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <LayoutTemplate className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="content" className="text-sm font-medium">Email Content</Label>
                    </div>
                    <Textarea 
                      id="content" 
                      placeholder="Enter email content (HTML supported)" 
                      className="w-full min-h-[300px] focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                      value={campaignContent}
                      onChange={(e) => setCampaignContent(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
                      HTML is supported. You can include personalization variables if needed.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("details")}
                  className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Back to Details
                </Button>
                <Button 
                  onClick={handleCreateCampaign} 
                  disabled={loading || !isContentComplete}
                  className="gap-2 hover:scale-[1.02] transition-transform duration-200"
                >
                  {loading ? "Creating..." : "Create Campaign"}
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 