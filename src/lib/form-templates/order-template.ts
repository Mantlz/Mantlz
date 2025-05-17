import { z } from "zod";
import { IconBuildingStore } from "@tabler/icons-react";
import { FormType } from "@prisma/client";

export const orderTemplate = {
  id: 'order',
  name: "Order Form",
  description: "Simple product order form with payment integration",
  icon: IconBuildingStore,
  formType: FormType.ORDER,
  schema: z.object({
    // Customer Information
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(10, "Phone number must be at least 10 characters").optional(),
    
    // Shipping Information
    shippingAddress: z.string().min(5, "Address must be at least 5 characters"),
    shippingCity: z.string().min(2, "City must be at least 2 characters"),
    shippingState: z.string().min(2, "State must be at least 2 characters"),
    shippingZip: z.string().min(5, "Zip code must be at least 5 characters"),
    shippingCountry: z.string().min(2, "Country must be at least 2 characters"),
    
    // Order Details
    productId: z.string(),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    specialInstructions: z.string().optional(),
    
    // Payment Intent (populated on the server)
    paymentIntentId: z.string().optional(),
  }),
}; 