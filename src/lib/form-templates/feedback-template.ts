import { z } from "zod";
import { IconMessageCircle2 } from "@tabler/icons-react";
import { FormType } from "@prisma/client";

export const feedbackTemplate = {
  id: 'feedback',
  name: "Feedback Form",
  description: "Collect user feedback and ratings",
  icon: IconMessageCircle2,
  formType: FormType.FEEDBACK,
  schema: z.object({
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    feedback: z.string().min(10, "Feedback must be at least 10 characters"),
    email: z.string().email("Please enter a valid email").optional(),
  }),
}; 