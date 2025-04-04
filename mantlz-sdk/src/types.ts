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
}

export interface FormSubmitOptions {
  formId: string;
  data: any;
  apiKey?: string;  // Optional override for the API key
  recaptchaToken?: string;  // Optional reCAPTCHA token for spam protection
  redirectUrl?: string;  // For STANDARD/PRO plans: URL to redirect to after form submission. Free users always go to Mantlz's hosted thank-you page.
}

export interface EmailSettings {
  enabled: boolean;
  fromEmail?: string;
  subject?: string;
  template?: string;
  replyTo?: string;
}

export interface FormConfig {
  name: string;
  description?: string;
  schema: any;
  emailSettings?: EmailSettings;
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
  createForm: (config: FormConfig) => Promise<any>;
  getTemplates: () => Promise<any>;
  createFromTemplate: (config: any) => Promise<any>;
  configureNotifications: (enabled: boolean, handler?: ToastHandler) => { notifications: boolean };
  updateResendApiKey: (apiKey: string) => Promise<void>;
  getResendApiKey: () => Promise<string | null>;
  updateFormEmailSettings: (formId: string, settings: EmailSettings) => Promise<void>;
  getFormEmailSettings: (formId: string) => Promise<EmailSettings | null>;
}