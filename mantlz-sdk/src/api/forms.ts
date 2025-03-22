import { z } from 'zod';
import { API_ENDPOINTS, API_HEADERS } from '../config/constants';
import { makeApiRequest } from '../utils/api';
import type { FormSubmissionResponse, FormCreationResponse } from '../types/index';

export async function submitForm(
  formId: string,
  data: unknown,
  apiKey: string
): Promise<FormSubmissionResponse> {
  return makeApiRequest(API_ENDPOINTS.SUBMIT_FORM, {
    method: 'POST',
    body: { formId, data, apiKey },
  });
}

export async function createForm(
  config: {
    name: string;
    description?: string;
    schema: z.ZodSchema;
  },
  apiKey: string
): Promise<FormCreationResponse> {
  return makeApiRequest(API_ENDPOINTS.CREATE_FORM, {
    method: 'POST',
    headers: {
      [API_HEADERS.AUTHORIZATION]: `Bearer ${apiKey}`,
    },
    body: config,
  });
} 