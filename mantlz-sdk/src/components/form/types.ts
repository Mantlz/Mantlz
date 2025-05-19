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
  onSuccess?: () => void;
  onError?: (error: Error) => void;
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

export interface MantlzProps {
  formId: string;
  className?: string;
  showUsersJoined?: boolean;
  usersJoinedCount?: number;
  usersJoinedLabel?: string;
  redirectUrl?: string;
  theme?: 'default' | 'modern' | 'neobrutalism' | 'simple';
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