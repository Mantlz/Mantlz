export interface FormDetail {
  id: string
  name: string
  description?: string | null
  submissionCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Submission {
  id: string
  createdAt: Date
  data: any
}

export interface FormState {
  isLoading: boolean
  isError: boolean
  data?: FormDetail
} 