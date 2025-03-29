import { z } from 'zod';
import { FeedbackTheme } from './sharedTypes';

export const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().min(10, 'Please provide more detailed feedback'),
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
});

// Define appearance type
export interface FeedbackFormAppearance {
  baseStyle?: {
    container?: string;
    form?: string;
  };
  elements?: {
    ratingContainer?: string;
    ratingWrapper?: string;
    starButton?: string;
    starIcon?: {
      base?: string;
      filled?: string;
      empty?: string;
    };
    textarea?: {
      container?: string;
      input?: string;
      error?: string;
    };
    email?: {
      container?: string;
      input?: string;
    };
    submitButton?: string;
    submitButtonIcon?: string;
    submitButtonText?: string;
  };
  typography?: {
    title?: string;
    description?: string;
    errorText?: string;
    feedbackPlaceholder?: string;
    submitButtonText?: string;
  };
}

// Simplified appearance interface with more intuitive properties
export interface FeedbackFormSimpleAppearance {
  theme?: FeedbackTheme;
  primaryColor?: string; // Like "blue" or "#3b82f6"
  backgroundColor?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  // Add text customizations
  submitButtonText?: string;
  feedbackPlaceholder?: string;
  darkMode?: boolean; // Override auto-detection
}

export interface FeedbackFormProps {
  // Core props
  formId: string;
  onSubmitSuccess?: (data: z.infer<typeof feedbackSchema>) => void;
  onSubmitError?: (error: Error) => void;
  className?: string;
  variant?: "default" | "glass";
  
  // Layout options
  title?: string;
  description?: string;
  layout?: 'vertical' | 'horizontal';
  width?: 'narrow' | 'medium' | 'wide';
  showLabels?: boolean;
  showEmailField?: boolean;
  allowComments?: boolean;
  
  // Text content customization
  submitButtonText?: string;
  feedbackPlaceholder?: string;
  successMessage?: string;
  errorMessage?: string;
  ratingLabels?: [string, string, string, string, string]; // Custom rating labels
  
  // Theme selection
  theme?: FeedbackTheme;
  darkMode?: boolean;
  
  // Color customization
  primaryColor?: string;          // Main accent color
  backgroundColor?: string;       // Form background color
  textColor?: string;             // Primary text color
  secondaryTextColor?: string;    // Secondary text color (descriptions, placeholders)
  borderColor?: string;           // Border color
  
  // Button customization
  buttonTextColor?: string;       // Button text color
  buttonBgColor?: string;         // Button background color
  buttonHoverColor?: string;      // Button hover color
  
  // Star rating customization
  starColor?: string;             // Color of filled stars
  starEmptyColor?: string;        // Color of empty stars
  
  // Form element styling
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  fontFamily?: 'sans' | 'serif' | 'mono';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  // Advanced customization
  appearance?: FeedbackFormAppearance | ((theme: 'light' | 'dark') => FeedbackFormAppearance);
}