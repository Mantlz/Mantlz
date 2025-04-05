import { z } from 'zod';

export type ContactFormTheme = 
  | 'default'
  | 'dark'
  | 'purple'
  | 'neobrutalism';

export const CONTACT_THEMES = {
  DEFAULT: 'default' as ContactFormTheme,
  DARK: 'dark' as ContactFormTheme,
  PURPLE: 'purple' as ContactFormTheme,
  NEOBRUTALISM: 'neobrutalism' as ContactFormTheme,
};

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Please provide more detailed message'),
});

export interface ContactFormAppearance {
  baseStyle?: {
    container?: string;
    form?: string;
    background?: string;
    border?: string;
  };
  elements?: {
    card?: string;
    cardHeader?: string;
    cardTitle?: string;
    cardDescription?: string;
    cardContent?: string;
    formButtonPrimary?: string;
    submitButton?: string; // Alias for formButtonPrimary
    formButtonIcon?: string; 
    buttonIcon?: string; // Alias for formButtonIcon
    input?: string;
    inputError?: string;
    inputLabel?: string;
    textarea?: string;
    formInput?: string; // Alias for input
    formTextarea?: string; // Alias for textarea
    background?: string; // For direct customization
    border?: string; // For direct customization
  };
}

export interface ContactFormProps {
  // Core props
  formId: string;
  className?: string;
  variant?: "default" | "glass";
  
  // Content customization
  title?: string;
  description?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  subjectLabel?: string;
  subjectPlaceholder?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  redirectUrl?: string;
  
  // Theme selection
  theme?: ContactFormTheme;
  baseTheme?: string; // Simplified theme prop for the new flat API
  
  // Appearance customization
  appearance?: ContactFormAppearance | ((theme: ContactFormTheme | string) => ContactFormAppearance);
  
  // Legacy prop for backward compatibility
  customSubmitText?: string;
} 