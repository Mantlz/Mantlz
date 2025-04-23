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
  data: Record<string, unknown>
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
    totalPages: number
  }
  formId: string | null
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
  pagination?: {
    total: number
    totalPages: number
    currentPage: number
  }
}

export interface RouterType {
  push: (url: string) => void
  replace: (url: string) => void
  back: () => void
  forward: () => void
  refresh: () => void
  prefetch: (href: string) => void
}

export interface LogsTableContentProps {
  data: SubmissionResponse | undefined
  isLoading: boolean
  page: number
  pagination: {
    total: number
    pages: number
    currentPage: number
    totalPages: number
  } | undefined
  searchParams: ReadonlyURLSearchParams
  router: RouterType
  isPremium: boolean
  userPlan?: 'FREE' | 'STANDARD' | 'PRO'
  refetch?: () => void
  itemsPerPage?: number
}

export interface LogsTableHeaderProps {
  formId: string | null
  formsData: FormsResponse | undefined
  searchParams: ReadonlyURLSearchParams
  router: RouterType
  submissionsData?: SubmissionResponse | undefined
} 