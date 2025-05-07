import { Campaign, CampaignStats } from './types';
import { client } from '@/lib/client';

function transformCampaign(data: any): Campaign {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    status: data.status,
    createdAt: new Date(data.createdAt).toISOString(),
    sentAt: data.sentAt ? new Date(data.sentAt).toISOString() : undefined,
    scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString() : undefined,
    _count: {
      sentEmails: data._count?.sentEmails || 0,
      recipients: data._count?.recipients || 0
    }
  };
}

export async function fetchCampaignById(campaignId: string, formId?: string | null): Promise<Campaign | null> {
  try {
    if (!formId) {
      // Get user forms
      const formsResponse = await client.forms.getUserForms.$get();
      const formsData = await formsResponse.json();
      
      // Try each form to find the campaign
      for (const form of formsData.forms) {
        const campaignsResponse = await client.campaign.getFormCampaigns.$get({
          formId: form.id
        });
        const campaigns = await campaignsResponse.json();
        
        const foundCampaign = campaigns.find((c: any) => c.id === campaignId);
        if (foundCampaign) {
          return transformCampaign(foundCampaign);
        }
      }
      return null;
    } else {
      // If we have formId in the URL, just fetch campaigns for that form
      const campaignsResponse = await client.campaign.getFormCampaigns.$get({
        formId: formId
      });
      const campaigns = await campaignsResponse.json();
      
      const foundCampaign = campaigns.find((c: any) => c.id === campaignId);
      return foundCampaign ? transformCampaign(foundCampaign) : null;
    }
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }
}

export async function fetchCampaignStats(campaignId: string): Promise<CampaignStats | null> {
  try {
    const response = await client.campaign.getStats.$get({
      campaignId
    });
    const data = await response.json();
    
    // Transform API response to match CampaignStats interface
    return {
      totalRecipients: data.sentCount || 0,
      totalSent: data.sentCount || 0,
      totalDelivered: data.sentCount - (data.bounces || 0),
      totalOpened: data.totalOpens || 0,
      totalClicked: data.totalClicks || 0,
      totalBounced: data.bounces || 0,
      totalComplaints: data.spamReports || 0,
      totalUnsubscribed: 0 // Add if available in API
    };
  } catch (error) {
    console.error('Error fetching campaign stats:', error);
    return null;
  }
}

export function getBackUrl(formId?: string | null) {
  return formId ? `/dashboard/campaigns?formId=${formId}` : '/dashboard/campaigns';
} 