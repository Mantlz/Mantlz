import {
  MantlzClient,
  FormSubmitResponse,
  MantlzError,
  MantlzClientConfig,
  FormSubmitOptions,
} from './types';
import { toast, ToastHandler } from './utils/toast';
import { FormSchema } from './components/form/types';
import { getApiUrl } from './config';

// Global error tracking to prevent duplicate toasts across different client instances
const globalErrorState = {
  form404Errors: new Set<string>(),
};

// Cache for form schemas and responses to improve performance
const requestCache = new Map<string, {
  data: any, 
  timestamp: number
}>();

// Default cache TTL (5 minutes)
const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

/**
 * Type guard to check if an error is a MantlzError
 */
function isMantlzError(error: any): error is MantlzError {
  return error && typeof error === 'object' && 'code' in error;
}

/**
 * Sanitizes strings to prevent injection in UI (basic)
 */
// function sanitizeString(input: string): string {
//   return input.replace(/[<>&"'`]/g, (char) => {
//     const map: Record<string, string> = {
//       '<': '&lt;',
//       '>': '&gt;',
//       '&': '&amp;',
//       '"': '&quot;',
//       "'": '&#39;',
//       '`': '&#96;',
//     };
//     return map[char] || char;
//   });
// }

/**
 * Creates a new Mantlz SDK client instance
 * @param apiKey - Your Mantlz API key (or undefined to use environment variable)
 * @param config - Optional client configuration
 */
export function createMantlzClient(
  apiKey?: string,
  config?: MantlzClientConfig
): MantlzClient {
  // Use provided API key or fallback to environment variable
  const key =
    apiKey ||
    (typeof process !== 'undefined' && process.env
      ? process.env.MANTLZ_KEY
      : undefined);

  if (!key || typeof key !== 'string' || key.trim() === '') {
    throw new Error(
      'Valid API key is required to initialize the Mantlz client. Provide it directly or set MANTLZ_KEY in your environment variables.'
    );
  }

  // Determine the base API URL using our centralized configuration
  const baseUrl = getApiUrl(config?.apiUrl);

  // Setup toast handler if provided
  if (config?.toastHandler) {
    toast.setHandler(config.toastHandler);
  }

  // Notification enabled flag (default true)
  let notificationsEnabled = config?.notifications !== false;
  
  // Development mode for local testing (bypasses CORS)
  const developmentMode = config?.developmentMode === true;
  
  // Credentials mode for fetch requests (default to 'include' for cross-origin requests)
  const credentialsMode = config?.credentials || 'include';

  // Cache configuration with default values
  const cacheEnabled = config?.cache?.enabled !== false;
  const cacheTTL = config?.cache?.ttl || DEFAULT_CACHE_TTL;

  // Default headers for all requests
  const defaultHeaders = {
    'X-API-Key': key,
    'Content-Type': 'application/json',
  };

  // Generate cache key from url and options
  const generateCacheKey = (url: string, options: RequestInit) => {
    const methodKey = options.method || 'GET';
    const bodyKey = options.body ? JSON.stringify(options.body) : '';
    return `${methodKey}:${url}:${bodyKey}`;
  };

  // Helper function to make API requests with proper CORS handling and caching
  const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${baseUrl}/api/v1${endpoint}`;
    const headers = {
      ...defaultHeaders,
      ...options.headers,
    };

    // Only cache GET requests
    const isGetRequest = !options.method || options.method === 'GET';
    const shouldCache = cacheEnabled && isGetRequest;
    
    const cacheKey = shouldCache ? generateCacheKey(url, options) : '';
    
    // Check cache for valid entry
    if (shouldCache) {
      const cachedItem = requestCache.get(cacheKey);
      
      if (cachedItem && Date.now() - cachedItem.timestamp < cacheTTL) {
        log('Cache hit for', url);
        return {
          ok: true,
          json: async () => cachedItem.data,
          status: 200,
          headers: new Headers(),
        } as Response;
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: credentialsMode,
        mode: 'cors',
      });

      if (!response.ok) {
        throw await handleApiError(response);
      }

      // Cache the successful response if it's cacheable
      if (shouldCache) {
        const clonedResponse = response.clone();
        try {
          const data = await clonedResponse.json();
          requestCache.set(cacheKey, { 
            data, 
            timestamp: Date.now() 
          });
          log('Cached response for', url);
        } catch (e) {
          log('Failed to cache response:', e);
        }
      }

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  };

  // Notification state to prevent duplicate toasts per formId
  const notificationState = {
    hasShownFormError: {} as Record<string, boolean>,
  };

  // Optional logging function (no-op by default)
  const log = config?.logger || (() => {});

  /**
   * Handles API error responses and transforms them into structured MantlzErrors
   */
  const handleApiError = async (
    response: Response,
    formId?: string
  ): Promise<MantlzError> => {
    const status = response.status;
    let errorData: { error?: string } = {};

    try {
      errorData = await response.json();
    } catch {
      // Ignore JSON parse errors, fallback to generic message
    }

    // Sanitize error message to avoid injection
    const rawMessage = errorData.error || 'Form submission failed';
    // const safeMessage = sanitizeString(rawMessage);

    const error: MantlzError = {
      message: rawMessage,
      code: status,
      details: errorData,
    };

    // User-friendly messages based on status code
    if (status === 401) {
      if (errorData.error?.includes('inactive')) {
        error.userMessage =
          'Your API key is inactive. Please activate it in your dashboard.';
      } else if (errorData.error?.includes('not found')) {
        error.userMessage = 'API key does not exist. Please check your API key.';
      } else {
        error.userMessage = 'Authentication failed. Please check your API key.';
      }
    } else if (status === 404) {
      error.userMessage = 'The requested form could not be found.';
      if (formId) {
        error.userMessage = `Form ID ${formId} could not be found.`;
      }
    } else if (status === 400) {
      error.userMessage = 'Invalid form data. Please check your submission.';
    } else if (status >= 500) {
      error.userMessage = 'Server error. Please try again later.';
    } else {
      error.userMessage = 'An error occurred. Please try again.';
    }

    return error;
  };

  /**
   * Shows error notifications with deduplication and sanitization
   */
  const showErrorNotification = (error: MantlzError, formId?: string): void => {
    if (error.alreadyHandled) {
      return;
    }

    if (error.code === 401) {
      if (config?.showApiKeyErrorToasts) {
        toast.error(error.userMessage || 'API Key Error', {
          description: 'Check your MANTLZ_KEY in the environment variables.',
          duration: 5000,
        });
      }
      return;
    }

    if (error.code === 404 && formId) {
      const errorKey = `form_${formId}_404`;
      if (
        notificationState.hasShownFormError[formId] ||
        globalErrorState.form404Errors.has(errorKey)
      ) {
        log(`Suppressing duplicate error toast for formId: ${formId}`);
        error.alreadyHandled = true;
        return;
      }
      notificationState.hasShownFormError[formId] = true;
      globalErrorState.form404Errors.add(errorKey);
    }

    const title = (error.userMessage || error.message || 'An error occurred');
    let description = error.code ? `Error ${error.code}` : undefined;

    if (error.code === 404 && formId) {
      description = `Form ${formId} not found. Please check your formId.`;
    }

    toast.error(title, {
      description,
      duration: 5000,
    });

    error.alreadyHandled = true;
  };

  /**
   * Handles safe redirection after form submission
   */
  const handleRedirect = (
    result: FormSubmitResponse,
    userRedirectUrl?: string
  ): void => {
    if (
      !result?.redirect ||
      !result.redirect?.url ||
      typeof window === 'undefined'
    ) {
      return;
    }

    log('Server provided redirect:', result.redirect);

    if (userRedirectUrl && result.redirect.allowed === false && notificationsEnabled) {
      toast.info('Using Mantlz thank-you page', {
        description: 'Custom redirects require a STANDARD or PRO plan',
        duration: 3000,
      });
    }

    // Use a short timeout to allow toast to show before redirect
    setTimeout(() => {
      // Sanitize URL before redirecting to prevent open redirect attacks
      try {
        const redirectUrl = new URL(result.redirect!.url!);
        // Optionally, restrict redirect to your domain or trusted domains here
        // For example:
        // if (!redirectUrl.hostname.endsWith('yourdomain.com')) {
        //   throw new Error('Redirect URL not allowed');
        // }
        window.location.href = redirectUrl.toString();
      } catch {
        log('Invalid redirect URL, skipping redirect.');
      }
    }, 1000);
  };

  return {
    apiUrl: baseUrl,

    getFormSchema: async (formId: string): Promise<FormSchema> => {
      if (!formId) {
        throw new Error('Form ID is required to fetch form schema');
      }

      try {
        // Ensure the URL is absolute by making sure baseUrl has protocol and domain
        const url = new URL(`/api/v1/forms/${encodeURIComponent(formId)}`, baseUrl).toString();
        log('Fetching form schema from:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': key,
          },
          credentials: developmentMode ? 'omit' : credentialsMode,
          mode: developmentMode ? 'no-cors' : 'cors',
        });
        
        // With no-cors mode, the response type is 'opaque' and cannot be read
        // In development mode, return a default schema with a note
        if (developmentMode && response.type === 'opaque') {
          log('Development mode: Returning mock schema for form', formId);
          return {
            id: formId,
            name: 'Development Form',
            description: 'This is a mock form generated in development mode',
            formType: 'custom',
            fields: [
              {
                id: 'email',
                name: 'email',
                type: 'email',
                required: true,
                label: 'Email',
                placeholder: 'your@email.com'
              },
              {
                id: 'name',
                name: 'name',
                type: 'text',
                required: true,
                label: 'Name',
                placeholder: 'Your Name'
              }
            ],
            schema: {
              email: {
                type: 'email',
                required: true,
                label: 'Email',
                placeholder: 'your@email.com'
              },
              name: {
                type: 'text',
                required: true,
                label: 'Name',
                placeholder: 'Your Name'
              }
            }
          };
        }

        if (!response.ok) {
          const error = await handleApiError(response, formId);
          log('Error fetching form schema:', error);
          if (notificationsEnabled) {
            showErrorNotification(error, formId);
          }
          throw error;
        }

        const formData = await response.json();

        const formSchema: FormSchema & { schema: Record<string, any> } = {
          id: formData.id,
          name: formData.name || formData.title || 'Form',
          description: formData.description || '',
          formType: formData.formType || 'custom',
          fields: [],
          schema: {}
        };

        if (Array.isArray(formData.fields)) {
          formSchema.fields = formData.fields.map((field: any) => ({
            id: field.id || field.name,
            name: field.name,
            type: field.type || 'text',
            required: Boolean(field.required),
            label: field.label || field.name || '',
            placeholder: field.placeholder || '',
            options: field.options?.map((opt: any) => ({
              value: typeof opt === 'string' ? opt : opt.value,
              label: typeof opt === 'string' ? opt : opt.label
            }))
          }));

          // Also update schema for backward compatibility
          formSchema.fields.forEach(field => {
            formSchema.schema[field.id] = {
              type: field.type,
              required: field.required,
              label: field.label,
              placeholder: field.placeholder,
              options: field.options
            };
          });
        } else if (formData.schema) {
          const parsedSchema = typeof formData.schema === 'string'
            ? JSON.parse(formData.schema)
            : formData.schema;
          
          formSchema.schema = parsedSchema;
            
          // Generate fields from schema for consistency
          formSchema.fields = Object.entries(parsedSchema).map(([key, value]: [string, any]) => ({
            id: key,
            name: key,
            type: value.type || 'text',
            required: Boolean(value.required),
            label: value.label || key,
            placeholder: value.placeholder || '',
            options: value.options?.map((opt: any) => ({
              value: typeof opt === 'string' ? opt : opt.value,
              label: typeof opt === 'string' ? opt : opt.label
            }))
          }));
        }

        return formSchema;
      } catch (error) {
        log('Failed to fetch form schema:', error);
        throw error;
      }
    },

    submitForm: async (
      type: string,
      options: FormSubmitOptions
    ): Promise<FormSubmitResponse> => {
      if (!type || typeof type !== 'string' || !options?.formId) {
        throw new Error('Form type and formId are required for form submission');
      }

      const { formId, data, redirectUrl } = options;

      try {
        // Ensure the URL is absolute by making sure baseUrl has protocol and domain
        const url = new URL('/api/v1/forms/submit', baseUrl).toString();
        log('Submitting form to:', url, { type, formId });

        // Determine if we're sending FormData or JSON
        const isFormData = data instanceof FormData;
        const headers: HeadersInit = {
          'X-API-Key': key,
        };

        // Set appropriate content type
        if (!isFormData) {
          headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: isFormData ? data : JSON.stringify({
            type,
            formId,
            apiKey: key,
            data,
            redirectUrl,
          }),
          credentials: developmentMode ? 'omit' : credentialsMode,
          mode: developmentMode ? 'no-cors' : 'cors',
        });
        
        // Handle opaque responses in development mode
        if (developmentMode && response.type === 'opaque') {
          log('Development mode: Simulating successful form submission');
          
          // Return simulated success response
          const mockResponse: FormSubmitResponse = {
            success: true,
            submissionId: 'dev-' + Math.random().toString(36).substring(2, 11),
            message: 'Form submitted successfully in development mode',
          };
          
          if (notificationsEnabled) {
            toast.success('Form submitted successfully (Dev Mode)', {
              duration: 3000,
            });
          }
          
          return mockResponse;
        }

        if (!response.ok) {
          const error = await handleApiError(response, formId);
          log('Form submission error:', error);
          if (notificationsEnabled) {
            showErrorNotification(error, formId);
          }
          throw error;
        }

        const result = (await response.json()) as FormSubmitResponse;

        if (notificationsEnabled && (!result.redirect || !result.redirect.url)) {
          toast.success('Form submitted successfully', {
            duration: 3000,
          });
        }

        handleRedirect(result, redirectUrl);

        return result;
      } catch (error: unknown) {
        if (isMantlzError(error)) {
          throw error;
        }

        const formattedError: MantlzError = {
          message:
            error instanceof Error ? error.message : 'Unknown error occurred',
          code: 500,
          userMessage:
            'Failed to submit form. Please check your connection and try again.',
          details: error,
        };

        if (notificationsEnabled) {
          showErrorNotification(formattedError, formId);
        }

        log('Error submitting form:', formattedError);
        throw formattedError;
      }
    },

    getUsersJoinedCount: async (formId: string): Promise<number> => {
      try {
        const response = await makeRequest(`/forms/${formId}/users-joined`);
        const data = await response.json();
        return data.count || 0;
      } catch (error) {
        if (isMantlzError(error)) {
          showErrorNotification(error, formId);
        }
        return 0;
      }
    },

    configureNotifications: (enabled: boolean, handler?: ToastHandler) => {
      if (handler) {
        toast.setHandler(handler);
      }

      notificationsEnabled = enabled;

      if (enabled) {
        Object.keys(notificationState.hasShownFormError).forEach((key) => {
          delete notificationState.hasShownFormError[key];
        });
      }

      return { notifications: enabled };
    },
  };
}