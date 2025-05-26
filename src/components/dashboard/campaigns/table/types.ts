export interface CampaignType {
  id: string
  name: string
  description?: string
  formId: string
  subject: string
  status: 'DRAFT' | 'SENDING' | 'SENT' | 'FAILED' | 'SCHEDULED' | 'CANCELLED'
  createdAt: string
  sentAt?: string
  scheduledAt?: string
  _count?: {
    sentEmails: number
    //actualRecipients: number
  }
}

export interface Form {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  _count?: {
    campaigns: number;
    submissions: number;
    unsubscribed: number;
  };
}

export interface FormsResponse {
  forms: Form[];
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface CampaignResponse {
  campaigns: CampaignType[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
  }
}

export interface CampaignStatsResponse {
  sentCount: number
  openCount: number
  clickCount: number
  unsubscribeCount: number
  bounceCount: number
} 