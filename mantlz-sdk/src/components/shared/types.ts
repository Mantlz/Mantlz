/**
 * Shared types across all Mantlz form components
 */

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