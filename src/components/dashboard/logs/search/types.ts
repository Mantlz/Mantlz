export interface NotificationLog {
  id: string
  type: 'SUBMISSION_CONFIRMATION' | 'DEVELOPER_NOTIFICATION' | 'DIGEST'
  status: 'SENT' | 'FAILED' | 'SKIPPED' | 'PENDING'
  error: string | null
  createdAt: string
}

export interface Submission {
  id: string
  createdAt: Date
  email: string | null
  formId: string
  formName: string
  formDescription?: string
  data?: Record<string, unknown>
  notificationLogs?: NotificationLog[]
  status?: string
  analytics?: {
    browser?: string
    location?: string
    [key: string]: unknown
  }
}

export interface Form {
  id: string
  name: string
  submissionCount: number
}

export interface SearchResult {
  submissions: Submission[]
  forms?: Form[]
}

// Advanced filters interface for search functionality
export interface AdvancedFilters {
  dateRange?: { from: Date | undefined; to?: Date | undefined }
  showOnlyWithAttachments?: boolean
  sortOrder?: 'newest' | 'oldest'
  timeFrame?: 'all' | '24h' | '7d' | '30d'
  hasEmail?: boolean
  browser?: string
  location?: string
}

// Forms data interface
export interface FormsData {
  forms: Form[]
}

// API parameters interface for better type safety
export interface ApiParams {
  page: number
  limit: number
  search?: string
  formId?: string
  type?: string
  status?: string
  startDate?: string
  endDate?: string
  hasEmail?: string
  browser?: string
  location?: string
  sortOrder?: string
  emailQuery?: string
  idQuery?: string
  dateAfter?: string
  dateBefore?: string
  dateEquals?: string
  formName?: string
  generalQuery?: string
  [key: string]: unknown
}