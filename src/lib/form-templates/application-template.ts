import { z } from "zod";
import { IconClipboardList } from "@tabler/icons-react";
import { FormType } from "@prisma/client";

export const applicationTemplate = {
  id: 'application',
  name: "Application Form",
  description: "Detailed application form with multiple sections",
  icon: IconClipboardList,
  formType: FormType.APPLICATION,
  schema: z.object({
    // Personal Information
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    
    // Additional Information
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
    
    // Experience
    education: z.string().optional(),
    experience: z.string().min(10, "Experience must be at least 10 characters").optional(),
    skills: z.string().optional(),
    
    // Additional Questions
    whyJoin: z.string().min(50, "Please provide a more detailed response").optional(),
    referenceName: z.string().optional(),
    referenceEmail: z.string().email("Please enter a valid email").optional(),
  }),
}; 