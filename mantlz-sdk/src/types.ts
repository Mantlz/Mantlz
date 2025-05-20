import { ToastHandler } from './utils/toast';
import { FormSchema } from './components/form/types';

// Client configuration
export interface MantlzClientConfig {
  toastHandler?: ToastHandler;
  notifications?: boolean;  // Enable/disable toast notifications
  showApiKeyErrorToasts?: boolean;  // Control API key error toasts separately
  apiUrl?: string;  // Custom API URL
  logger?: (message: string, ...args: any[]) => void;  // Optional logger function
  developmentMode?: boolean;  // Enable development mode for local testing
  credentials?: RequestCredentials;  // Control credentials mode for fetch requests ('include' recommended for cross-origin)
  corsMode?: RequestMode;  // Control CORS mode ('cors' recommended for cross-origin)
  cache?: {
    enabled?: boolean;  // Enable/disable caching (default: true)
    ttl?: number;       // Time-to-live in milliseconds (default: 5 minutes)
  };
}

export interface MantlzError {
  message: string;
  code: number;
  userMessage?: string;
  details?: any;
  alreadyHandled?: boolean;
  isConflict?: boolean;
}

export interface FormSubmitOptions {
  formId: string;
  data: any;
  apiKey?: string;  // Optional override for the API key
  recaptchaToken?: string;  // Optional reCAPTCHA token for spam protection
  redirectUrl?: string;  // For STANDARD/PRO plans: URL to redirect to after form submission. Free users always go to Mantlz's hosted thank-you page.
}

export interface FormSubmitResponse {
  success: boolean;
  data?: any;
  error?: MantlzError;
  submissionId?: string;
  message?: string;
  isConflict?: boolean;
  redirect?: {
    url: string;
    allowed: boolean;
    reason?: string;
  };
}

export interface FormFieldConfig {
  id: string;
  name: string;
  type: string;
  required: boolean;
  placeholder?: string;
  label?: string;
  options?: string[];
  defaultValue?: any;
  accept?: string[]; // For file fields
  maxSize?: number; // For file fields
}

export interface MantlzClient {
  apiUrl?: string;  // API URL for making requests
  submitForm: (type: string, options: FormSubmitOptions) => Promise<FormSubmitResponse>;
  getUsersJoinedCount: (formId: string) => Promise<number>;
  getFormSchema: (formId: string) => Promise<FormSchema>;
  configureNotifications: (enabled: boolean, handler?: ToastHandler) => { notifications: boolean };
  stripe: {
    createCheckoutSession: {
      $post: (data: { formId: string; products: Array<{ productId: string; quantity: number }>; customerEmail?: string; successUrl?: string }) => Promise<Response>;
    };
  };
}