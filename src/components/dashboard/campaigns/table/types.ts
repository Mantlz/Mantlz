export interface CampaignType {
  id: string
  name: string
  description?: string
  formId: string
  subject: string
  status: 'DRAFT' | 'SENDING' | 'SENT' | 'FAILED' | 'SCHEDULED' | 'CANCELLED'
  createdAt: string
  sentAt?: string
  _count?: {
    sentEmails: number
  }
}

export interface FormsResponse {
  forms: Array<{
    id: string
    name: string
    slug: string
    createdAt: string
  }>
  pagination?: {
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
  }
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