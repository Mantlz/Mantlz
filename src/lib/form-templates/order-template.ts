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
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    
    // Shipping Information
    shipping: z.string().min(5, "Address must be at least 5 characters"),
    
    // Product Selection (optional since it's a pro feature)
    products: z.array(z.object({
      productId: z.string(),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })).optional(),
    
    // Payment Intent (populated on the server)
    paymentIntentId: z.string().optional(),
  }),
}; 