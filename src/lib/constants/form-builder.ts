import { 
  IconMessageCircle2, 
  IconUserPlus, 
  IconMail, 
  IconPlus, 
  IconForms, 
  IconClipboardList,
  IconBuildingStore,
  IconDeviceAnalytics,
  IconUsers,
  IconLayoutGrid
} from "@tabler/icons-react"
import { FormCategory, FormTemplate } from "@/types/form-builder"
import { formTemplates as templateDefinitions } from "../form-templates"

export const categories: FormCategory[] = [
  { id: "all", name: "All Forms", icon: IconLayoutGrid },
  { id: "lead", name: "Lead Generation", icon: IconUserPlus },
  { id: "feedback", name: "Feedback & Support", icon: IconMessageCircle2 },
  { id: "commerce", name: "E-commerce", icon: IconBuildingStore },
  { id: "events", name: "Events & RSVP", icon: IconUsers }
]

// Convert the form templates from the template files to FormTemplate type
export const formTemplates: FormTemplate[] = [
  {
    id: 'waitlist',
    name: templateDefinitions.waitlist.name,
    description: templateDefinitions.waitlist.description,
    icon: templateDefinitions.waitlist.icon,
    category: "lead",
    popular: true
  },
  {
    id: 'contact',
    name: templateDefinitions.contact.name,
    description: templateDefinitions.contact.description,
    icon: templateDefinitions.contact.icon,
    category: "feedback"
  },
  {
    id: 'feedback',
    name: templateDefinitions.feedback.name,
    description: templateDefinitions.feedback.description,
    icon: templateDefinitions.feedback.icon,
    category: "feedback"
  },
  {
    id: 'survey',
    name: templateDefinitions.survey.name,
    description: templateDefinitions.survey.description,
    icon: templateDefinitions.survey.icon,
    category: "feedback",
    requiredPlan: 'STANDARD'
  },
  {
    id: 'application',
    name: templateDefinitions.application.name,
    description: templateDefinitions.application.description,
    icon: templateDefinitions.application.icon,
    category: "lead",
    requiredPlan: 'STANDARD'
  },
  {
    id: 'order',
    name: templateDefinitions.order.name,
    description: templateDefinitions.order.description,
    icon: templateDefinitions.order.icon,
    category: "commerce",
    requiredPlan: 'STANDARD'
  },
  {
    id: 'analytics',
    name: templateDefinitions.analytics.name,
    description: templateDefinitions.analytics.description,
    icon: templateDefinitions.analytics.icon,
    category: "lead",
    requiredPlan: 'PRO'
  },
  {
    id: 'rsvp',
    name: templateDefinitions.rsvp.name,
    description: templateDefinitions.rsvp.description,
    icon: templateDefinitions.rsvp.icon,
    category: "events",
    requiredPlan: 'PRO'
  },
  {
    id: 'custom',
    name: templateDefinitions.custom.name,
    description: templateDefinitions.custom.description,
    icon: templateDefinitions.custom.icon,
    category: "all",
    requiredPlan: 'PRO',
    popular: true
  }
] 