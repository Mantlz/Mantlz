import { CampaignResponse, FormsResponse } from "./types"
import { client } from "@/lib/client"

// Function to fetch user forms
export async function fetchUserForms(page = 1, itemsPerPage = 8): Promise<FormsResponse> {
  try {
    const response = await client.forms.getUserForms.$get({
      limit: itemsPerPage,
      cursor: page > 1 ? `${page}` : undefined
    })
    
    // Transform the response to match FormsResponse type
    const data = await response.json()
    return {
      forms: data.forms.map(form => ({
        id: form.id,
        name: form.name,
        slug: form.id, // Using ID as slug
        createdAt: form.createdAt.toString()
      })),
      pagination: {
        totalItems: data.forms.length,
        totalPages: data.nextCursor ? page + 1 : page,
        currentPage: page,
        itemsPerPage
      }
    }
  } catch (error) {
    console.error('Error fetching forms:', error)
    throw error
  }
}

// Function to fetch campaigns for a form
export async function fetchCampaigns(
  formId: string | null, 
  page = 1, 
  startDate?: string, 
  endDate?: string,
  itemsPerPage = 8
): Promise<CampaignResponse> {
  try {
    if (!formId) {
      throw new Error('Form ID is required')
    }

    const response = await client.campaign.getFormCampaigns.$get({
      formId
    })

    // Transform the response to match CampaignResponse type
    const campaigns = await response.json()
    
    // Handle pagination manually since the API doesn't support it
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const filteredCampaigns = campaigns
      .filter(campaign => {
        if (!startDate && !endDate) return true
        
        const campaignDate = new Date(campaign.createdAt)
        const start = startDate ? new Date(startDate) : null
        const end = endDate ? new Date(endDate) : null
        
        if (start && end) {
          return campaignDate >= start && campaignDate <= end
        } else if (start) {
          return campaignDate >= start
        } else if (end) {
          return campaignDate <= end
        }
        
        return true
      })
      .slice(startIndex, endIndex)

    return {
      campaigns: filteredCampaigns.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description || undefined,
        formId: c.formId,
        subject: c.subject || '',
        status: c.status,
        createdAt: c.createdAt.toString(),
        sentAt: c.sentAt ? c.sentAt.toString() : undefined,
        _count: c._count
      })),
      pagination: {
        totalItems: campaigns.length,
        totalPages: Math.ceil(campaigns.length / itemsPerPage),
        currentPage: page,
        itemsPerPage
      }
    }
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    throw error
  }
}

// Function to send a campaign
export async function sendCampaign(campaignId: string): Promise<{ success: boolean }> {
  try {
    const response = await client.campaign.send.$post({
      campaignId
    })

    const result = await response.json()
    return { success: true }
  } catch (error) {
    console.error('Error sending campaign:', error)
    throw error
  }
}

// Function to create a new campaign
export async function createCampaign(data: {
  name: string
  description?: string
  formId: string
  subject: string
  content: string
  scheduledAt?: Date
}): Promise<{ id: string; name: string; status: string }> {
  try {
    const response = await client.campaign.create.$post(data)

    const result = await response.json()
    return {
      id: result.id,
      name: result.name,
      status: result.status
    }
  } catch (error) {
    console.error('Error creating campaign:', error)
    throw error
  }
}

// Function to format campaign status for display
export function formatCampaignStatus(status: string): { label: string; color: string } {
  switch (status) {
    case 'DRAFT':
      return { label: 'Draft', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' }
    case 'SENDING':
      return { label: 'Sending', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' }
    case 'SENT':
      return { label: 'Sent', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' }
    case 'FAILED':
      return { label: 'Failed', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
    case 'SCHEDULED':
      return { label: 'Scheduled', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' }
    case 'CANCELLED':
      return { label: 'Cancelled', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' }
    default:
      return { label: status, color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' }
  }
} 