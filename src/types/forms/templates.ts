import { z } from "zod"
import { 
  IconMessageCircle2, 
  IconUserPlus, 
  IconMail 
} from "@tabler/icons-react"

export const formTemplates = {
  feedback: {
    id: 'feedback',
    name: "Feedback Form",
    description: "Collect user feedback and ratings",
    icon: IconMessageCircle2,
    schema: z.object({
      rating: z.number().min(1).max(5),
      feedback: z.string().min(10),
      email: z.string().email().optional(),
    }),
  },
  waitlist: {
    id: 'waitlist',
    name: "Waitlist Form",
    description: "Collect waitlist signups for your product",
    icon: IconUserPlus,
    schema: z.object({
      email: z.string().email(),
      name: z.string().min(2),
    }),
  },
  contact: {
    id: 'contact',
    name: "Contact Form",
    description: "Simple contact form for inquiries",
    icon: IconMail,
    schema: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      message: z.string().min(10),
    }),
  },
} as const

export type FormTemplateId = keyof typeof formTemplates 