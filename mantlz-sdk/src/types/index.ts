import { z } from 'zod';

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
}

export interface FormSubmissionResponse {
  success: boolean;
  submissionId: string;
}

export interface FormCreationResponse {
  id: string;
}

export interface TemplateFormResponse {
  id: string;
  name: string;
  description: string;
}

export interface FormConfig {
  name: string;
  description?: string;
  schema: z.ZodSchema;
}

export interface TemplateConfig {
  templateId: 'feedback' | 'waitlist';
  name?: string;
  description?: string;
}

export interface MantlzClient {
  submitForm: (formId: string, data: unknown) => Promise<FormSubmissionResponse>;
  createForm: (config: FormConfig) => Promise<FormCreationResponse>;
  getTemplates: () => Promise<FormTemplate[]>;
  createFromTemplate: (config: TemplateConfig) => Promise<TemplateFormResponse>;
} 