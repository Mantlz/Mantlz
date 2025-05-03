"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart2, Mail, Send, Clock, CheckCircle2, XCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface CampaignListProps {
  formId: string
}

export function CampaignList({ formId }: CampaignListProps) {
  const router = useRouter()
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns", formId],
    queryFn: async () => {
      const response = await client.campaign.getFormCampaigns.$get({ formId })
      return response.json()
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!campaigns?.length) {
    return (
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm p-12 text-center">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No campaigns yet</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Create your first campaign to start sending emails
        </p>
        <Button
          onClick={() => router.push(`/dashboard/campaigns?formId=${formId}&action=create`)}
          className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100"
        >
          <Send className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign: any) => (
        <div
          key={campaign.id}
          className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm p-6 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900 dark:text-white">{campaign.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{format(new Date(campaign.createdAt), "MMM d, yyyy")}</span>
                <span>•</span>
                <span className={cn(
                  "inline-flex items-center gap-1",
                  campaign.status === "SENT" && "text-green-600 dark:text-green-400",
                  campaign.status === "SENDING" && "text-blue-600 dark:text-blue-400",
                  campaign.status === "DRAFT" && "text-gray-600 dark:text-gray-400"
                )}>
                  {campaign.status === "SENT" && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {campaign.status === "SENDING" && <Clock className="h-3.5 w-3.5" />}
                  {campaign.status === "DRAFT" && <Mail className="h-3.5 w-3.5" />}
                  {campaign.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/campaigns/${campaign.id}/analytics`)}
                className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              {campaign.status === "DRAFT" && (
                <Button
                  size="sm"
                  onClick={() => router.push(`/dashboard/campaigns?formId=${formId}&action=edit&campaignId=${campaign.id}`)}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 