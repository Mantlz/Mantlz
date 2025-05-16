/**
 * Shared types across all Mantlz form components
 */

import { z } from 'zod';
import { ThemeVariant } from './themes';

// Base theme types
export type BaseTheme = 'default' | 'dark' | 'purple' | 'neobrutalism';

// Simplified appearance API that's flatter and more intuitive
export interface SimpleAppearance {
  // Direct element styling
  container?: string;
  form?: string;
  background?: string;
  border?: string;
  
  // Form controls
  input?: string;
  textarea?: string;
  button?: string;
  label?: string;
  
  // Title and description
  title?: string;
  description?: string;
  
  // Error states
  errorText?: string;
  
  // Component-specific elements (these will be ignored by components that don't have these elements)
  ratingWrapper?: string;
  starButton?: string;
  starIconFilled?: string;
  starIconEmpty?: string;
  
  // Text customizations
  submitText?: string;
  placeholderText?: string;
}

// Function to normalize the flat appearance into the structured format
export function normalizeAppearance(appearance: SimpleAppearance): any {
  // This will be implemented later when we modify the component implementation
  return {
    baseStyle: {
      container: appearance.container,
      form: appearance.form,
      background: appearance.background,
      border: appearance.border,
    },
    elements: {
      // Form controls
      input: appearance.input,
      formInput: appearance.input,
      textarea: appearance.textarea ? {
        input: appearance.textarea
      } : undefined,
      email: appearance.input ? {
        input: appearance.input
      } : undefined,
      submitButton: appearance.button,
      formButtonPrimary: appearance.button,
      inputLabel: appearance.label,
      
      // Component-specific
      ratingWrapper: appearance.ratingWrapper,
      starButton: appearance.starButton,
      starIcon: (appearance.starIconFilled || appearance.starIconEmpty) ? {
        filled: appearance.starIconFilled,
        empty: appearance.starIconEmpty
      } : undefined,
      
      // Card elements
      cardTitle: appearance.title,
      cardDescription: appearance.description,
      
      // Error states
      inputError: appearance.errorText,
    },
    typography: {
      submitButtonText: appearance.submitText,
      feedbackPlaceholder: appearance.placeholderText,
      errorText: appearance.errorText,
    }
  };
}

// Base form types
export type FormType = 'waitlist' | 'contact' | 'feedback' | 'custom';

export type BaseFormTheme = 'default' | 'minimal' | 'modern' | 'classic';

// Theme types
export type WaitlistFormTheme = BaseFormTheme;
export type ContactFormTheme = BaseFormTheme;
export type FeedbackFormTheme = BaseFormTheme;

export const FORM_THEMES = {
  default: 'default',
  minimal: 'minimal',
  modern: 'modern',
  classic: 'classic',
} as const;

// Appearance types
export interface BaseStyle {
  container?: string;
  background?: string;
  border?: string;
  text?: string;
}

export interface ElementStyles {
  card?: string;
  input?: string;
  button?: string;
  label?: string;
  error?: string;
}

export interface FormAppearance {
  baseStyle?: BaseStyle;
  elements?: ElementStyles;
  baseTheme?: BaseFormTheme;
}

// Props types
export interface BaseFormProps {
  formId: string;
  className?: string;
  variant?: "default" | "glass";
  theme?: BaseFormTheme;
  appearance?: FormAppearance | ((theme: BaseFormTheme) => FormAppearance);
  darkMode?: boolean;
  baseTheme?: BaseFormTheme;
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

export interface DynamicFormProps {
  formId: string;
  colorMode?: 'light' | 'dark';
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  showUsersJoined?: boolean;
  usersJoinedCount?: number;
  usersJoinedLabel?: string;
  redirectUrl?: string;
}

// Form field types
export interface FormFieldConfig {
  id: string;
  name: string;
  type: string;
  required: boolean;
  placeholder?: string;
  label?: string;
  options?: string[];
  defaultValue?: any;
  accept?: string | string[];
  maxSize?: number;
  premium?: boolean;
}

export interface FormSchema {
  id: string;
  name: string;
  title?: string;
  description?: string;
  schema: Record<string, any>;
  fields?: FormFieldConfig[];
  formType?: 'waitlist' | 'contact' | 'feedback' | 'custom';
}

// Validation schemas
export const formFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  required: z.boolean(),
  placeholder: z.string().optional(),
  label: z.string().optional(),
  options: z.array(z.string()).optional(),
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
  schema: z.record(z.any()),
  fields: z.array(formFieldSchema).optional(),
  formType: z.enum(['waitlist', 'contact', 'feedback', 'custom']).optional(),
});

export interface MantlzProps {
  formId: string;
  colorMode?: 'light' | 'dark';
  className?: string;
  showUsersJoined?: boolean;
  usersJoinedCount?: number;
  usersJoinedLabel?: string;
  redirectUrl?: string;
  theme?: ThemeVariant;
} 