import { z } from "zod";
import { IconUserPlus } from "@tabler/icons-react";
import { FormType } from "@prisma/client";

export const waitlistTemplate = {
  id: 'waitlist',
  name: "Waitlist Form",
  description: "Collect waitlist signups for your product",
  icon: IconUserPlus,
  formType: FormType.WAITLIST,
  schema: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
  }),
}; 