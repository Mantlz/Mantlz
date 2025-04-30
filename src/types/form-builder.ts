import { Icon } from "@tabler/icons-react"

export interface FormCategory {
  id: string
  name: string
  icon: Icon
}

export interface FormTemplate {
  id: string
  name: string
  description: string
  icon: Icon
  category: string
  popular?: boolean
  comingSoon?: boolean
}

export type ViewMode = 'grid' | 'list' 