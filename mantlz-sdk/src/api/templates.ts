import { API_ENDPOINTS, API_HEADERS } from '../config/constants';
import { makeApiRequest } from '../utils/api';
import type { FormTemplate, TemplateFormResponse } from '../types/index';

export async function getTemplates(apiKey: string): Promise<FormTemplate[]> {
  return makeApiRequest(API_ENDPOINTS.GET_TEMPLATES, {
    headers: {
      [API_HEADERS.AUTHORIZATION]: `Bearer ${apiKey}`,
    },
  });
}

export async function createFromTemplate(
  config: {
    templateId: 'feedback' | 'waitlist';
    name?: string;
    description?: string;
  },
  apiKey: string
): Promise<TemplateFormResponse> {
  return makeApiRequest(API_ENDPOINTS.CREATE_FROM_TEMPLATE, {
    method: 'POST',
    headers: {
      [API_HEADERS.AUTHORIZATION]: `Bearer ${apiKey}`,
    },
    body: config,
  });
} 