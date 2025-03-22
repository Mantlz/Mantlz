import { z } from 'zod';

export type FormTemplate = {
  id: string;
  name: string;
  description: string;
};

export interface FormSubmitOptions {
  formId: string;
  apiKey: string;
  data: Record<string, any>;
}

export interface FormSubmitResponse {
  success: boolean;
  message?: string;
  error?: string;
  formId?: string;
  details?: any;
}

export interface MantlzClient {
  submitForm: (type: string, options: FormSubmitOptions) => Promise<FormSubmitResponse>;
  createForm: (config: {
    name: string;
    description?: string;
    schema: z.ZodSchema;
  }) => Promise<{
    id: string;
  }>;
  getTemplates: () => Promise<FormTemplate[]>;
  createFromTemplate: (config: {
    templateId: 'feedback' | 'waitlist';
    name?: string;
    description?: string;
  }) => Promise<{
    id: string;
    name: string;
    description: string;
  }>;
}

declare global {
  interface Window {
    mantlz: MantlzClient;
  }
} 