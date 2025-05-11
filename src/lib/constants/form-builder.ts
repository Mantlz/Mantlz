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

export const categories: FormCategory[] = [
  { id: "all", name: "All Forms", icon: IconLayoutGrid },
  { id: "lead", name: "Lead Generation", icon: IconUserPlus },
  { id: "feedback", name: "Feedback & Support", icon: IconMessageCircle2 },
  { id: "commerce", name: "E-commerce", icon: IconBuildingStore },
  { id: "events", name: "Events & RSVP", icon: IconUsers }
]

export const formTemplates: FormTemplate[] = [
  {
    id: 'waitlist',
    name: "Waitlist Form",
    description: "Collect waitlist signups for your product",
    icon: IconUserPlus,
    category: "lead",
    popular: true
  },
  {
    id: 'contact',
    name: "Contact Form",
    description: "Simple contact form for inquiries",
    icon: IconMail,
    category: "feedback"
  },
  {
    id: 'feedback',
    name: "Feedback Form",
    description: "Collect user feedback and ratings",
    icon: IconMessageCircle2,
    category: "feedback"
  },
  {
    id: 'survey',
    name: "Survey Form",
    description: "Multiple question survey with various field types",
    icon: IconForms,
    category: "feedback",
    comingSoon: true
  },
  {
    id: 'application',
    name: "Application Form",
    description: "Detailed application form with multiple sections",
    icon: IconClipboardList,
    category: "lead",
    comingSoon: true
  },
  {
    id: 'order',
    name: "Order Form",
    description: "Simple product order form with payment integration",
    icon: IconBuildingStore,
    category: "commerce",
    comingSoon: true
  },
  {
    id: 'analytics',
    name: "Analytics Opt-in",
    description: "Get user consent for analytics tracking",
    icon: IconDeviceAnalytics,
    category: "lead",
    comingSoon: true
  },
  {
    id: 'rsvp',
    name: "RSVP Form",
    description: "Event registration with attendance confirmation",
    icon: IconUsers,
    category: "events",
    comingSoon: true
  },
  {
    id: 'custom',
    name: "Custom Form",
    description: "Build a completely custom form from scratch",
    icon: IconPlus,
    category: "all",
    comingSoon: true
  }
] 