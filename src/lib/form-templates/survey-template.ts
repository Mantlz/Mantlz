import { z } from "zod";
import { IconForms } from "@tabler/icons-react";
import { FormType } from "@prisma/client";

export const surveyTemplate = {
  id: 'survey',
  name: "Survey Form",
  description: "Multiple question survey with various field types",
  icon: IconForms,
  formType: FormType.SURVEY,
  schema: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    age: z.number().min(1, "Age must be positive").optional(),
    occupation: z.string().optional(),
    satisfaction: z.number().min(1).max(10).optional(),
    feedback: z.string().min(10, "Feedback must be at least 10 characters").optional(),
    wouldRecommend: z.boolean().optional(),
  }),
}; 