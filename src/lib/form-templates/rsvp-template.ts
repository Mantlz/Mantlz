import { z } from "zod";
import { IconUsers } from "@tabler/icons-react";
import { FormType } from "@prisma/client";

export const rsvpTemplate = {
  id: 'rsvp',
  name: "RSVP Form",
  description: "Event registration with attendance confirmation",
  icon: IconUsers,
  formType: FormType.RSVP,
  schema: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    attending: z.boolean(),
    guestCount: z.number().min(0, "Guest count must be 0 or more").max(10, "Maximum 10 guests"),
    dietaryRestrictions: z.string().optional(),
    message: z.string().optional(),
    arrivalDate: z.string().optional(),
    departureDate: z.string().optional(),
    needsAccommodation: z.boolean().optional(),
  }),
}; 