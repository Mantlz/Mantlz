/**
 * Shared appearance handler for all form components
 * This enables a more intuitive, flatter API for styling forms
 */

// Type for the flattened appearance object
interface FlatAppearance {
  // Base theme
  baseTheme?: string;
  
  // Direct styling
  container?: string;
  form?: string;
  background?: string;
  border?: string;
  
  // Form controls
  formButtonPrimary?: string;
  submitButton?: string;
  button?: string;
  input?: string;
  formInput?: string;
  textarea?: string;
  label?: string;
  inputLabel?: string;
  
  // Card elements
  card?: string;
  cardTitle?: string;
  cardDescription?: string;
  cardHeader?: string;
  title?: string;
  description?: string;
  
  // Error states
  inputError?: string;
  errorText?: string;
  
  // Feedback form specific
  ratingContainer?: string;
  ratingWrapper?: string;
  starButton?: string;
  starIconBase?: string;
  starIconFilled?: string;
  starIconEmpty?: string;
  submitButtonIcon?: string;
  submitButtonText?: string;
  
  // Text customizations
  submitText?: string;
  placeholderText?: string;
  
  // Email and textarea nested objects
  email?: {
    container?: string;
    input?: string;
    error?: string;
  };
  textareaObject?: {
    container?: string;
    input?: string;
    error?: string;
  };
  
  // Star icon nested object
  starIcon?: {
    base?: string;
    filled?: string;
    empty?: string;
  };
  
  [key: string]: any;
}

/**
 * Detects if an appearance object is using the flat format
 */
function isFlatAppearance(appearance: any): appearance is FlatAppearance {
  if (!appearance || typeof appearance !== 'object' || Array.isArray(appearance)) {
    return false;
  }
  
  // Check if it has any of the top-level properties that would indicate flat format
  const flatProperties = [
    'baseTheme', 'container', 'button', 'input', 'textarea', 'label', 'formButtonPrimary',
    'submitButton', 'cardTitle', 'title', 'description', 'background', 'border'
  ];
  
  return flatProperties.some(prop => prop in appearance) &&
    // And it doesn't have the nested structure
    !('baseStyle' in appearance && 'elements' in appearance);
}

/**
 * Convert a flat appearance object to the structured format expected by components
 */
function normalizeAppearance(appearance: FlatAppearance): any {
  const result: any = {
    baseStyle: {},
    elements: {},
    typography: {}
  };
  
  // Process baseStyle properties
  if (appearance.container) result.baseStyle.container = appearance.container;
  if (appearance.form) result.baseStyle.form = appearance.form;
  if (appearance.background) result.baseStyle.background = appearance.background;
  if (appearance.border) result.baseStyle.border = appearance.border;
  if (appearance.card) result.baseStyle.container = appearance.card;
  
  // Process button properties
  if (appearance.button) {
    result.elements.submitButton = appearance.button;
    result.elements.formButtonPrimary = appearance.button;
  }
  if (appearance.submitButton) {
    result.elements.submitButton = appearance.submitButton;
    if (!appearance.formButtonPrimary) {
      result.elements.formButtonPrimary = appearance.submitButton;
    }
  }
  if (appearance.formButtonPrimary) {
    result.elements.formButtonPrimary = appearance.formButtonPrimary;
    if (!appearance.submitButton) {
      result.elements.submitButton = appearance.formButtonPrimary;
    }
  }
  
  // Process input properties
  if (appearance.input) {
    result.elements.input = appearance.input;
    
    // Also apply to email and textarea if not specified
    if (!appearance.email?.input) {
      if (!result.elements.email) result.elements.email = {};
      result.elements.email.input = appearance.input;
    }
    
    if (!appearance.textareaObject?.input && !appearance.textarea) {
      if (!result.elements.textarea) result.elements.textarea = {};
      result.elements.textarea.input = appearance.input;
    }
  }
  
  if (appearance.formInput) {
    if (!result.elements.email) result.elements.email = {};
    result.elements.email.input = appearance.formInput;
    
    if (!result.elements.textarea) result.elements.textarea = {};
    result.elements.textarea.input = appearance.formInput;
  }
  
  // Process textarea
  if (appearance.textarea) {
    if (!result.elements.textarea) result.elements.textarea = {};
    result.elements.textarea.input = appearance.textarea;
  }
  
  // Process label
  if (appearance.label || appearance.inputLabel) {
    result.elements.inputLabel = appearance.label || appearance.inputLabel;
  }
  
  // Process title and description
  if (appearance.title || appearance.cardTitle) {
    result.elements.cardTitle = appearance.title || appearance.cardTitle;
  }
  
  if (appearance.description || appearance.cardDescription) {
    result.elements.cardDescription = appearance.description || appearance.cardDescription;
  }
  
  // Process error states
  if (appearance.errorText || appearance.inputError) {
    result.elements.inputError = appearance.errorText || appearance.inputError;
    result.typography.errorText = appearance.errorText || appearance.inputError;
  }
  
  // Process text customizations
  if (appearance.submitText || appearance.submitButtonText) {
    result.typography.submitButtonText = appearance.submitText || appearance.submitButtonText;
    result.elements.submitButtonText = appearance.submitText || appearance.submitButtonText;
  }
  
  if (appearance.placeholderText) {
    result.typography.feedbackPlaceholder = appearance.placeholderText;
  }
  
  // Process Feedback form specific properties
  if (appearance.ratingContainer) result.elements.ratingContainer = appearance.ratingContainer;
  if (appearance.ratingWrapper) result.elements.ratingWrapper = appearance.ratingWrapper;
  if (appearance.starButton) result.elements.starButton = appearance.starButton;
  if (appearance.submitButtonIcon) result.elements.submitButtonIcon = appearance.submitButtonIcon;
  
  // Process star icon
  if (appearance.starIconBase || appearance.starIconFilled || appearance.starIconEmpty) {
    if (!result.elements.starIcon) result.elements.starIcon = {};
    if (appearance.starIconBase) result.elements.starIcon.base = appearance.starIconBase;
    if (appearance.starIconFilled) result.elements.starIcon.filled = appearance.starIconFilled;
    if (appearance.starIconEmpty) result.elements.starIcon.empty = appearance.starIconEmpty;
  }
  
  // Pass through nested objects if they exist
  if (appearance.email) {
    result.elements.email = {
      ...result.elements.email,
      ...appearance.email
    };
  }
  
  if (appearance.textareaObject) {
    result.elements.textarea = {
      ...result.elements.textarea,
      ...appearance.textareaObject
    };
  }
  
  if (appearance.starIcon) {
    result.elements.starIcon = {
      ...result.elements.starIcon,
      ...appearance.starIcon
    };
  }
  
  if (appearance.cardHeader) {
    result.elements.cardHeader = appearance.cardHeader;
  }
  
  return result;
}

/**
 * Process an appearance prop, handling both flat and nested formats
 */
export function processAppearance(appearance: any, theme?: string): any {
  if (!appearance) {
    return { baseStyle: {}, elements: {}, typography: {} };
  }
  
  // If it's a function, call it with the theme parameter
  const appearanceObj = typeof appearance === 'function'
    ? appearance(theme || 'default')
    : appearance;
    
  // If it's a flat appearance, normalize it
  if (isFlatAppearance(appearanceObj)) {
    return normalizeAppearance(appearanceObj);
  }
  
  // Otherwise, assume it's already in the correct format
  return appearanceObj;
} 