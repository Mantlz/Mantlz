import { ToastHandler } from './utils/toast';

// Client configuration
export interface MantlzClientConfig {
  toastHandler?: ToastHandler;
  notifications?: boolean;  // Enable/disable toast notifications
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
}

export interface FormSubmitResponse {
  success: boolean;
  data?: any;
  error?: MantlzError;
}

export interface MantlzClient {
  submitForm: (type: string, options: FormSubmitOptions) => Promise<FormSubmitResponse>;
  createForm: (config: any) => Promise<any>;
  getTemplates: () => Promise<any>;
  createFromTemplate: (config: any) => Promise<any>;
  configureNotifications: (enabled: boolean, handler?: ToastHandler) => { notifications: boolean };
}