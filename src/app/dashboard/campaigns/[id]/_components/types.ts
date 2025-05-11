export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED';

export interface FormData {
  id: string;
  _count?: {
    submissions: number;
    unsubscribed?: number;
  };
  name?: string;
  userId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  description?: string | null;
  schema?: string;
  settings?: unknown;
  formType?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED';
  createdAt: string;
  scheduledAt?: string;
  sentAt?: string;
  _count: {
    sentEmails: number;
    recipients: number;
  };
}

export interface CampaignStats {
  totalRecipients: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  totalComplaints: number;
  totalUnsubscribed: number;
  timeSeriesData: CampaignTimeSeriesData[];
}

export interface CampaignTimeSeriesData {
  date: string;
  opens: number;
  clicks: number;
  bounces: number;
}

// Helper function to validate campaign status
export function isCampaignStatus(status: string): status is CampaignStatus {
  return ['DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'FAILED'].includes(status);
} 