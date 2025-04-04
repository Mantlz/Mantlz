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
  data?: any
  notificationLogs?: NotificationLog[]
  status?: string
  analytics?: {
    browser?: string
    location?: string
    [key: string]: any
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