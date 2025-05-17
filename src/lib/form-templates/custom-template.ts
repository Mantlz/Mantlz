import { z } from "zod";
import { IconPlus } from "@tabler/icons-react";
import { FormType } from "@prisma/client";

export const customTemplate = {
  id: 'custom',
  name: "Custom Form",
  description: "Build a completely custom form from scratch",
  icon: IconPlus,
  formType: FormType.CUSTOM,
  // The schema will be defined by the user, starting with minimal fields
  schema: z.object({
    email: z.string().email("Please enter a valid email"),
  }),
}; 