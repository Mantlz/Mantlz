import { z } from 'zod';

export type FeedbackFormTheme = 
  | 'default'
  | 'dark'
  | 'purple'
  | 'neobrutalism';

export type RatingType = 
  | 'star' 
  | 'emoji' 
  | 'radio';

export const FEEDBACK_THEMES = {
  DEFAULT: 'default' as FeedbackFormTheme,
  DARK: 'dark' as FeedbackFormTheme,
  PURPLE: 'purple' as FeedbackFormTheme,
  NEOBRUTALISM: 'neobrutalism' as FeedbackFormTheme,
};

export const feedbackSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Please provide more detailed feedback'),
});

export interface FeedbackFormAppearance {
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
    select?: string; // For select elements
    formSelect?: string; // Alias for select
    background?: string; // For direct customization
    border?: string; // For direct customization
    
    // Rating label
    ratingLabel?: string;
    
    // Old star rating styles (for backward compatibility)
    ratingWrapper?: string;
    starButton?: string;
    starIcon?: {
      base?: string;
      filled?: string;
      empty?: string;
    };
    
    // New rating styles
    // Star rating related
    ratingContainer?: string;
    ratingStarActive?: string;
    ratingStarInactive?: string;
    
    // Emoji rating related
    emojiContainer?: string;
    emojiButton?: string;
    emojiButtonActive?: string;
    emojiButtonInactive?: string;
    
    // Radio rating related
    radioContainer?: string;
    radioButton?: string;
    radioButtonActive?: string;
    radioButtonInactive?: string;
  };
  typography?: {
    submitButtonText?: string;
    feedbackPlaceholder?: string;
    errorText?: string;
  };
}

export interface FeedbackFormProps {
  // Core props
  formId: string;
  className?: string;
  variant?: "default" | "glass";
  
  // Content customization
  title?: string;
  description?: string;
  ratingLabel?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  redirectUrl?: string;
  
  // Theme selection
  theme?: FeedbackFormTheme;
  baseTheme?: string; // Simplified theme prop for the new flat API
  darkMode?: boolean;
  
  // Rating type selection
  ratingType?: RatingType;
  
  // Appearance customization
  appearance?: FeedbackFormAppearance | ((theme: FeedbackFormTheme | string, ratingType?: RatingType) => FeedbackFormAppearance);
  
  // Submit text
  submitButtonText?: string;
  
  // Event handlers
  onSubmitSuccess?: (data: z.infer<typeof feedbackSchema>) => void;
  onSubmitError?: (error: any) => void;
} 