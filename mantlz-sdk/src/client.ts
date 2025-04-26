import {
  MantlzClient,
  FormSubmitResponse,
  MantlzError,
  MantlzClientConfig,
  FormSubmitOptions,
} from './types';
import { toast, ToastHandler } from './utils/toast';
import { FormSchema } from './components/shared/DynamicForm';

// Global error tracking to prevent duplicate toasts across different client instances
const globalErrorState = {
  form404Errors: new Set<string>(),
};

/**
 * Type guard to check if an error is a MantlzError
 */
function isMantlzError(error: any): error is MantlzError {
  return error && typeof error === 'object' && 'code' in error;
}

/**
 * Sanitizes strings to prevent injection in UI (basic)
 */
function sanitizeString(input: string): string {
  return input.replace(/[<>&"'`]/g, (char) => {
    const map: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;',
      '`': '&#96;',
    };
    return map[char] || char;
  });
}

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

  // Determine the base API URL
  const baseUrl =
    config?.apiUrl !== undefined
      ? config.apiUrl
      : typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_MANTLZ_API_URL !== undefined
      ? process.env.NEXT_PUBLIC_MANTLZ_API_URL
      : typeof window !== 'undefined'
      ? '' // relative path for same-origin requests in browser
      : 'https://form-quay.vercel.app'; // fallback for server environment

  // Setup toast handler if provided
  if (config?.toastHandler) {
    toast.setHandler(config.toastHandler);
  }

  // Notification enabled flag (default true)
  let notificationsEnabled = config?.notifications !== false;
  
  // Development mode for local testing (bypasses CORS)
  const developmentMode = config?.developmentMode === true;

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
    const safeMessage = sanitizeString(rawMessage);

    const error: MantlzError = {
      message: safeMessage,
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
        error.userMessage = `Form ID '${sanitizeString(formId)}' could not be found.`;
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

    const title = sanitizeString(error.userMessage || error.message || 'An error occurred');
    let description = error.code ? `Error ${error.code}` : undefined;

    if (error.code === 404 && formId) {
      description = `Form ID ${sanitizeString(formId)} not found. Please check your formId.`;
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
        const url = `${baseUrl}/api/v1/forms/${encodeURIComponent(formId)}`;
        log('Fetching form schema from:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': key,
          },
          credentials: developmentMode ? 'omit' : 'include',
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
            schema: {
              email: {
                type: 'email',
                required: true,
                label: 'Email',
                placeholder: 'your@email.com',
              },
              name: {
                type: 'text',
                required: true,
                label: 'Name',
                placeholder: 'Your Name',
              },
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

        const formSchema: FormSchema = {
          id: formData.id,
          name: formData.name || formData.title || 'Form',
          description: formData.description || '',
          formType: formData.formType || 'custom',
          schema: {},
        };

        if (Array.isArray(formData.fields)) {
          formData.fields.forEach((field: any) => {
            const key = field.id || field.name;
            if (key) {
              formSchema.schema[key] = {
                type: field.type || 'text',
                required: Boolean(field.required),
                placeholder: field.placeholder || '',
                label: field.label || field.name || '',
              };
            }
          });
        } else if (formData.schema) {
          formSchema.schema =
            typeof formData.schema === 'string'
              ? JSON.parse(formData.schema)
              : formData.schema;
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
        const url = `${baseUrl}/api/v1/forms/submit`;
        log('Submitting form to:', url, { type, formId });

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': key,
          },
          body: JSON.stringify({
            type,
            formId,
            apiKey: key,
            data,
            redirectUrl,
          }),
          credentials: developmentMode ? 'omit' : 'include',
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
        const url = `${baseUrl}/api/v1/forms/${encodeURIComponent(
          formId
        )}/users-joined`;
        log('Fetching users joined count:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-API-Key': key,
          },
          credentials: developmentMode ? 'omit' : 'include',
          mode: developmentMode ? 'no-cors' : 'cors',
        });
        
        // In development mode with opaque response, return a random number
        if (developmentMode && response.type === 'opaque') {
          const mockCount = Math.floor(Math.random() * 100) + 1;
          log('Development mode: Returning mock users count:', mockCount);
          return mockCount;
        }

        if (!response.ok) {
          const error = await handleApiError(response, formId);
          log('Failed to get users joined count:', error);
          throw error;
        }

        const result = await response.json();
        return typeof result.count === 'number' ? result.count : 0;
      } catch (error) {
        log('Error getting users joined count:', error);
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
