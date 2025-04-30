import { LucideIcon } from "lucide-react"

export interface FormCategory {
  id: string
  name: string
  icon: LucideIcon
}

export interface FormTemplate {
  id: string
  name: string
  description: string
  icon: LucideIcon
  category: string
  popular?: boolean
  comingSoon?: boolean
}

export type ViewMode = 'grid' | 'list' 