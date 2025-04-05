import { z } from 'zod';

export const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  name: z.string().min(2, 'Name is required'),
  referralSource: z.string().optional(),
});

export type WaitlistFormTheme = 'default' | 'dark' | 'purple' | 'neobrutalism';

export const WAITLIST_THEMES: Record<string, WaitlistFormTheme> = {
  DEFAULT: 'default',
  DARK: 'dark', 
  PURPLE: 'purple',
  NEOBRUTALISM: 'neobrutalism'
};

export interface WaitlistFormAppearance {
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
    formButtonIcon?: string;
    inputLabel?: string;
    input?: string;
    inputError?: string;
    background?: string; // For direct customization
    border?: string; // For direct customization
    // Additional common aliases for easier customization
    submitButton?: string; // Alias for formButtonPrimary
    buttonIcon?: string; // Alias for formButtonIcon
    formInput?: string; // Alias for input
  };
}

export interface WaitlistFormProps {
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
  redirectUrl?: string;
  
  // Theme selection
  theme?: WaitlistFormTheme;
  
  // Appearance customization
  appearance?: WaitlistFormAppearance;
  
  // Button text
  customSubmitText?: string;
} 