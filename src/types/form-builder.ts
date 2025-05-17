import { Icon } from "@tabler/icons-react"

export interface FormCategory {
  id: string
  name: string
  icon: Icon
}

export type PlanRequirement = 'FREE' | 'STANDARD' | 'PRO'

export interface FormTemplate {
  id: string
  name: string
  description: string
  icon: Icon
  category: string
  popular?: boolean
  comingSoon?: boolean
  requiredPlan?: PlanRequirement // Minimum plan required to use this template
}

export type ViewMode = 'grid' | 'list' 