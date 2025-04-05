import { ReadonlyURLSearchParams } from "next/navigation"

export interface NotificationLog {
  id: string
  type: 'SUBMISSION_CONFIRMATION' | 'DEVELOPER_NOTIFICATION' | 'DIGEST'
  status: 'SENT' | 'FAILED' | 'SKIPPED'
  error: string | null
  createdAt: string
}

export interface Analytics {
  browser: string
  location: string
  _meta?: {
    browser: string
    country: string
  }
}

export interface Submission {
  id: string
  createdAt: Date
  email: string | null
  data: any
  formId: string
  form: {
    id: string
    name: string
  }
  notificationLogs: NotificationLog[]
  analytics: {
    browser: string
    location: string
  }
}

export interface SubmissionResponse {
  submissions: Submission[]
  pagination: {
    total: number
    pages: number
    currentPage: number
  }
}

export interface Form {
  id: string
  name: string
  description: string | null
  submissionCount: number
  createdAt: Date
  updatedAt: Date
}

export interface FormsResponse {
  forms: Form[]
  nextCursor?: string
}

export interface LogsTableContentProps {
  data: SubmissionResponse | undefined
  isLoading: boolean
  page: number
  pagination: {
    total: number
    pages: number
    currentPage: number
  } | undefined
  searchParams: ReadonlyURLSearchParams
  router: any
  isPremium: boolean
  userPlan?: 'FREE' | 'STANDARD' | 'PRO'
  refetch?: () => void
}

export interface LogsTableHeaderProps {
  formId: string | null
  formsData: FormsResponse | undefined
  searchParams: ReadonlyURLSearchParams
  router: any
  submissionsData?: SubmissionResponse | undefined
} 