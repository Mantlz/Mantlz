export const API_BASE_URL = 'https://form-quay.vercel.app';

export const API_ENDPOINTS = {
  SUBMIT_FORM: '/v1/forms/submit',
} as const;

export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  JSON_CONTENT: 'application/json',
} as const; 