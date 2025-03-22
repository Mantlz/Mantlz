export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  SUBMIT_FORM: '/forms/submit',
  CREATE_FORM: '/forms/create',
  GET_TEMPLATES: '/forms/templates',
  CREATE_FROM_TEMPLATE: '/forms/create-from-template',
} as const;

export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  JSON_CONTENT: 'application/json',
} as const; 