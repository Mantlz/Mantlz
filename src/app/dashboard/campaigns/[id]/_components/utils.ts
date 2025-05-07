import { Campaign, CampaignStats } from './types';
import { client } from '@/lib/client';

interface ApiCampaign {
  id: string;
  name: string;
  description: string | null;
  status: Campaign['status'];
  createdAt: string;
  sentAt: string | null;
  scheduledAt: string | null;
  _count: {
    sentEmails: number;
    recipients: number;
  };
}

interface ApiCampaignStats {
  sentCount: number;
  totalOpens: number;
  totalClicks: number;
  bounces: number;
  spamReports: number;
  timeSeriesData?: Array<{
    date: string;
    opens: number;
    clicks: number;
    bounces: number;
  }>;
}

function transformCampaign(data: ApiCampaign): Campaign {
  return {
    id: data.id,
    name: data.name,
    description: data.description || undefined,
    status: data.status,
    createdAt: new Date(data.createdAt).toISOString(),
    sentAt: data.sentAt ? new Date(data.sentAt).toISOString() : undefined,
    scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString() : undefined,
    _count: {
      sentEmails: data._count.sentEmails,
      recipients: data._count.recipients
    }
  };
}

export async function fetchCampaignById(id: string, formId?: string): Promise<Campaign | null> {
  try {
    if (!formId) {
      const formsResponse = await client.forms.getUserForms.$get();
      const formsData = await formsResponse.json();
      
      for (const form of formsData.forms) {
        const campaignsResponse = await client.campaign.getFormCampaigns.$get({
          formId: form.id
        });
        const campaigns = (await campaignsResponse.json()) as unknown as ApiCampaign[];
        
        const foundCampaign = campaigns.find(c => c.id === id);
        if (foundCampaign) {
          return transformCampaign(foundCampaign);
        }
      }
      return null;
    } else {
      const campaignsResponse = await client.campaign.getFormCampaigns.$get({
        formId: formId
      });
      const campaigns = (await campaignsResponse.json()) as unknown as ApiCampaign[];
      
      const foundCampaign = campaigns.find(c => c.id === id);
      return foundCampaign ? transformCampaign(foundCampaign) : null;
    }
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }
}

export async function fetchCampaignStats(id: string): Promise<CampaignStats | null> {
  try {
    const response = await client.campaign.getStats.$get({
      campaignId: id
    });
    const data = await response.json() as ApiCampaignStats;
    
    console.log('Campaign stats API response:', data);
    
    // Generate time series data if not provided by API
    const timeSeriesData = [{
      date: new Date().toISOString(),
      opens: data.totalOpens,
      clicks: data.totalClicks,
      bounces: data.bounces
    }];
    
    const stats = {
      totalRecipients: data.sentCount,
      totalDelivered: data.sentCount - (data.bounces || 0),
      totalOpened: data.totalOpens,
      totalClicked: data.totalClicks,
      totalBounced: data.bounces,
      totalComplaints: data.spamReports,
      totalUnsubscribed: 0,
      timeSeriesData
    };
    
    console.log('Transformed campaign stats:', stats);
    return stats;
  } catch (error) {
    console.error('Error fetching campaign stats:', error);
    return null;
  }
}

export function getBackUrl(formId?: string): string {
  return formId ? `/dashboard/forms/${formId}/campaigns` : '/dashboard/campaigns';
} 