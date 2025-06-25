/**
 * Shared types across all Mantlz form components
 */

import { z } from 'zod';

// Form field types
export type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'file' | 'product';

// Form types
export type FormType = 'waitlist' | 'contact' | 'feedback' | 'custom' | 'survey' | 'application' | 'order' | 'analytics-opt-in' | 'rsvp';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: any;
  accept?: string[];
  maxSize?: number;
  premium?: boolean;
  products?: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    image?: string;
  }>;
  displayMode?: 'grid' | 'list';
}

export interface FormSchema {
  id: string;
  name: string;
  title?: string;
  description?: string;
  fields: FormField[];
  formType?: FormType;
  schema?: Record<string, any>;
}

// Validation schemas
export const formFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  label: z.string(),
  options: z.array(
    z.object({
      value: z.string(),
      label: z.string()
    })
  ).optional(),
  defaultValue: z.any().optional(),
  accept: z.array(z.string()).optional(),
  maxSize: z.number().optional(),
  premium: z.boolean().optional(),
  products: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      price: z.number(),
      currency: z.string(),
      image: z.string().optional()
    })
  ).optional(),
  displayMode: z.enum(['grid', 'list']).optional()
});

export const formSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  fields: z.array(formFieldSchema),
  formType: z.enum(['waitlist', 'contact', 'feedback', 'custom', 'survey', 'application', 'order', 'analytics-opt-in', 'rsvp']).optional(),
  schema: z.record(z.any()).optional(),
});

// Props interfaces
export interface BaseFormProps {
  formId: string;
  className?: string;
  redirectUrl?: string;
}

export interface WaitlistFormProps extends BaseFormProps {
  showUsersJoined?: boolean;
  usersJoinedLabel?: string;
  usersJoinedCount?: number;
}

export interface ContactFormProps extends BaseFormProps {
  // Contact specific props can be added here
}

export interface FeedbackFormProps extends BaseFormProps {
  // Feedback specific props can be added here
}

// Appearance customization types (similar to Clerk)
export interface AppearanceVariables {
  colorPrimary?: string;
  colorBackground?: string;
  colorInputBackground?: string;
  colorText?: string;
  colorInputText?: string;
  colorError?: string;
  colorSuccess?: string;
  borderRadius?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
}

export interface AppearanceElements {
  card?: string; // CSS classes for the main form container
  formTitle?: string; // CSS classes for the form title
  formDescription?: string; // CSS classes for the form description
  formField?: string; // CSS classes for form field containers
  formLabel?: string; // CSS classes for form labels
  formInput?: string; // CSS classes for form inputs
  formButton?: string; // CSS classes for form buttons
  formError?: string; // CSS classes for error messages
  usersJoined?: string; // CSS classes for users joined text
}

export interface Appearance {
  baseTheme?: 'light' | 'dark';
  variables?: AppearanceVariables;
  elements?: AppearanceElements;
}

export interface MantlzProps {
  formId: string;
  className?: string;
  showUsersJoined?: boolean;
  usersJoinedCount?: number;
  usersJoinedLabel?: string;
  redirectUrl?: string;
  theme?: 'default' | 'modern' | 'neobrutalism' | 'simple';
  appearance?: Appearance;
}

export interface SurveyFormProps extends BaseFormProps {
  // Survey specific props can be added here
}

export interface ApplicationFormProps extends BaseFormProps {
  // Application specific props can be added here
}

export interface OrderFormProps extends BaseFormProps {
  // Order specific props can be added here
}

export interface AnalyticsOptInFormProps extends BaseFormProps {
  // Analytics opt-in specific props can be added here
}

export interface RsvpFormProps extends BaseFormProps {
  // RSVP specific props can be added here
}

// Stripe checkout response
export interface StripeCheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
  orderId: string;
}

// Form submit response
export interface FormSubmitResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  redirect?: {
    url: string;
    allowed: boolean;
    reason?: string;
  };
}