"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '@/lib/client'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface OverviewStepProps {
  campaignData: {
    name: string
    subject: string
    content: string
    selectedContacts: string[]
    settings: {
      fromEmail: string
      replyTo: string
      scheduledAt: Date | null
    }
  }
  formId: string
  onClose: () => void
}

export function OverviewStep({ campaignData, formId, onClose }: OverviewStepProps) {
  const queryClient = useQueryClient()

  const { mutate: createCampaign, isPending } = useMutation({
    mutationFn: async () => {
      const response = await client.campaign.create.$post({
        formId,
        name: campaignData.name,
        subject: campaignData.subject,
        content: campaignData.content,
        scheduledAt: campaignData.settings.scheduledAt || undefined,
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', formId] })
      toast.success('Campaign created successfully')
      onClose()
    },
    onError: (error) => {
      toast.error('Failed to create campaign', {
        description: error instanceof Error ? error.message : 'An error occurred'
      })
    }
  })

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Campaign Details</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1">{campaignData.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Subject</dt>
              <dd className="mt-1">{campaignData.subject}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Recipients</dt>
              <dd className="mt-1">{campaignData.selectedContacts.length} contacts</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Email Settings</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">From Email</dt>
              <dd className="mt-1">{campaignData.settings.fromEmail}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Reply-To</dt>
              <dd className="mt-1">{campaignData.settings.replyTo}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Scheduled For</dt>
              <dd className="mt-1">
                {campaignData.settings.scheduledAt
                  ? format(campaignData.settings.scheduledAt, 'PPP')
                  : 'Send immediately'}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Email Preview</h3>
        <div className="prose max-w-none">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium mb-2">{campaignData.subject}</div>
            <div className="whitespace-pre-wrap">{campaignData.content}</div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={() => createCampaign()} 
          disabled={isPending}
        >
          {isPending ? 'Creating...' : 'Create Campaign'}
        </Button>
      </div>
    </div>
  )
} 