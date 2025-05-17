import { z } from "zod";
import { IconMail } from "@tabler/icons-react";
import { FormType } from "@prisma/client";

export const contactTemplate = {
  id: 'contact',
  name: "Contact Form",
  description: "Simple contact form for inquiries",
  icon: IconMail,
  formType: FormType.CONTACT,
  schema: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    message: z.string().min(10, "Message must be at least 10 characters"),
  }),
}; 