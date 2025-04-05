import { ToastHandler } from './utils/toast';

// Client configuration
export interface MantlzClientConfig {
  toastHandler?: ToastHandler;
  notifications?: boolean;  // Enable/disable toast notifications
  showApiKeyErrorToasts?: boolean;  // Control API key error toasts separately
}

export interface MantlzError {
  message: string;
  code: number;
  userMessage?: string;
  details?: any;
  alreadyHandled?: boolean;
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
  redirect?: {
    url: string;
    allowed: boolean;
    reason?: string;
  };
}

export interface MantlzClient {
  submitForm: (type: string, options: FormSubmitOptions) => Promise<FormSubmitResponse>;
  configureNotifications: (enabled: boolean, handler?: ToastHandler) => { notifications: boolean };
}