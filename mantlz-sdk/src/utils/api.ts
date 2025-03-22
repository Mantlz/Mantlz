import { API_BASE_URL, API_HEADERS } from '../config/constants';

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
}

export async function makeApiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;

  const requestOptions: RequestInit = {
    method,
    headers: {
      [API_HEADERS.CONTENT_TYPE]: API_HEADERS.JSON_CONTENT,
      ...headers,
    },
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

  // Add error handling for non-JSON responses
  try {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Failed to make request to ${endpoint}`);
    }

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON response from ${endpoint}`);
    }
    throw error;
  }
} 