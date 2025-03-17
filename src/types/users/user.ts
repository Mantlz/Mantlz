// types/user.ts
export type Plan = "FREE" | "INDIE" | "HACKER"

export interface Quota {
  id: string
  userId: string
  year: number
  month: number
  count: number
}

export interface User {
  id: string
  name: string
  clerkId: string | null
  email: string
  quotaLimit: number
  plan: Plan
  createdAt: Date
  updatedAt: Date
  Quota: Quota[]
}

// You might also want these utility types
export type UserWithoutQuota = Omit<User, "Quota">

export type CreateUserInput = {
  name: string
  clerkId: string
  email: string
  quotaLimit: number
  plan?: Plan
}

export type UpdateUserInput = Partial<CreateUserInput>

// Response types for your auth endpoints
export interface DatabaseSyncResponse {
  isSynced: boolean
  message?: string
}

export interface UserResponse {
  user: UserWithoutQuota | null
  error?: string
}