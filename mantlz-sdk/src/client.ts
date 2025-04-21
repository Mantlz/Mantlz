import { MantlzClient, FormSubmitResponse, MantlzError, MantlzClientConfig, FormSubmitOptions } from './types';
import { toast, ToastHandler } from './utils/toast';
import { FormSchema } from './components/shared/DynamicForm';

// Global error tracking to prevent duplicate toasts across different client instances
const globalErrorState = {
  form404Errors: new Set<string>()
};

/**
 * Creates a new Mantlz SDK client instance
 * @param apiKey - Your Mantlz API key (or undefined to use environment variable)
 * @param config - Optional client configuration
 */
export function createMantlzClient(apiKey?: string, config?: MantlzClientConfig): MantlzClient {
  // Try to use provided API key, fall back to environment variable if available
  const key = apiKey || (typeof process !== 'undefined' && process.env ? process.env.MANTLZ_KEY : undefined);
  
  if (!key || typeof key !== 'string' || key.trim() === '') {
    throw new Error('Valid API key is required to initialize the Mantlz client. Provide it directly or set MANTLZ_KEY in your environment variables.');
  }

  // Determine the base API URL
  // 1. Use explicit config.apiUrl if provided
  // 2. Use NEXT_PUBLIC_MANTLZ_API_URL env var if provided
  // 3. Default to a relative path (empty string) for same-origin requests if running in browser
  // 4. Fallback to production URL if none of the above apply (e.g., in Node.js env without config)
  const baseUrl = config?.apiUrl !== undefined 
    ? config.apiUrl
    : (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_MANTLZ_API_URL !== undefined)
      ? process.env.NEXT_PUBLIC_MANTLZ_API_URL
      : (typeof window !== 'undefined') // Check if running in browser
        ? '' // Use relative path for same-origin requests
        : 'https://api.mantlz.io'; // Fallback for non-browser env

  // Apply toast handler if provided in config
  if (config?.toastHandler) {
    toast.setHandler(config.toastHandler);
  }

  // Set notification mode - silent by default
  let notificationsEnabled = config?.notifications !== false;
  
  // Add flag to track if this client instance has already shown notifications
  const notificationState = {
    hasShownFormError: {} as Record<string, boolean>
  };

  /**
   * Handles API error responses and transforms them into structured MantlzErrors
   */
  const handleApiError = async (response: Response, formId?: string): Promise<MantlzError> => {
    const status = response.status;
    let errorData: { error?: string } = {};
    
    try {
      errorData = await response.json();
    } catch (e) {
      // JSON parsing failed, use default error
    }
    
    // Create structured error
    const error: MantlzError = {
      message: errorData.error || 'Form submission failed',
      code: status,
      details: errorData,
    };
    
    // Add user-friendly messages based on status code
    if (status === 401) {
      if (errorData.error?.includes('inactive')) {
        error.userMessage = 'Your API key is inactive. Please activate it in your dashboard.';
      } else if (errorData.error?.includes('not found')) {
        error.userMessage = 'API key does not exist. Please check your API key.';
      } else {
        error.userMessage = 'Authentication failed. Please check your API key.';
      }
    } else if (status === 404) {
      error.userMessage = 'The requested form could not be found.';
      if (formId) {
        error.userMessage = `Form ID '${formId}' could not be found.`;
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
   * Handles showing error notifications with deduplication
   */
  const showErrorNotification = (error: MantlzError, formId?: string): void => {
    // Skip showing error toast if it's already been handled
    if (error.alreadyHandled) {
      return;
    }
    
    // For 401 errors, only show if specifically enabled
    if (error.code === 401) {
      if (config?.showApiKeyErrorToasts) {
        const title = error.userMessage || 'API Key Error';
        const description = 'Check your MANTLZ_KEY in the environment variables.';
        
        toast.error(title, {
          description,
          duration: 5000, // Longer duration for important errors
        });
      }
      return;
    }
    
    // For 404 form errors, check for duplicates using formId
    if (error.code === 404 && formId) {
      const errorKey = `form_${formId}_404`;
      if (notificationState.hasShownFormError[formId] || globalErrorState.form404Errors.has(errorKey)) {
        console.log(`Suppressing duplicate error toast for formId: ${formId}`);
        error.alreadyHandled = true;
        return;
      }
      
      // Mark this formId as having shown an error
      notificationState.hasShownFormError[formId] = true;
      globalErrorState.form404Errors.add(errorKey);
    }
    
    // Show the error toast
    const title = error.userMessage || error.message || 'An error occurred';
    let description = error.code ? `Error ${error.code}` : undefined;
    
    if (error.code === 404 && formId) {
      description = `Form ID ${formId} not found. Please check your formId.`;
    }
    
    toast.error(title, {
      description,
      duration: 5000,
    });
    
    // Mark error as already handled
    error.alreadyHandled = true;
  };
  
  /**
   * Handles redirection after successful form submission
   */
  const handleRedirect = (result: FormSubmitResponse, userRedirectUrl?: string): void => {
    if (!result?.redirect || !result.redirect?.url || typeof window === 'undefined') {
      return;
    }
    
    console.log('Server provided redirect:', result.redirect);
    
    // For free users who attempted to use a custom redirect, show explanation
    if (userRedirectUrl && result.redirect.allowed === false && notificationsEnabled) {
      toast.info('Using Mantlz thank-you page', {
        description: 'Custom redirects require a STANDARD or PRO plan',
        duration: 3000,
      });
    }
    
    // Short timeout to allow any toast messages to be seen
    setTimeout(() => {
      window.location.href = result.redirect!.url!;
    }, 1000);
  };
  
  return {
    apiUrl: baseUrl, // Expose the resolved API URL
    
    // Get form schema for dynamic rendering
    getFormSchema: async (formId: string): Promise<FormSchema> => {
      if (!formId) {
        throw new Error('Form ID is required to fetch form schema');
      }
      
      try {
        // Use the resolved baseUrl
        const url = `${baseUrl}/api/v1/forms/${formId}`;
        console.log('Fetching form schema from:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': key,
          },
          credentials: 'same-origin',
        });

        if (!response.ok) {
          const error = await handleApiError(response, formId);
          
          console.error('Error fetching form schema:', error);
          
          if (notificationsEnabled) {
            showErrorNotification(error, formId);
          }
          
          throw error;
        }

        const formData = await response.json();
        
        // Process the form data to ensure it has the right structure for FormSchema
        const formSchema: FormSchema = {
          id: formData.id,
          name: formData.name || formData.title || 'Form',
          description: formData.description || '',
          formType: formData.formType || 'custom',
          schema: {},
        };
        
        // If fields are provided, convert them to schema format
        if (Array.isArray(formData.fields)) {
          formData.fields.forEach((field: any) => {
            formSchema.schema[field.id || field.name] = {
              type: field.type || 'text',
              required: field.required || false,
              placeholder: field.placeholder || '',
              label: field.label || field.name,
            };
          });
        } else if (formData.schema) {
          // If raw schema is provided, use it directly
          formSchema.schema = typeof formData.schema === 'string' 
            ? JSON.parse(formData.schema) 
            : formData.schema;
        }
        
        return formSchema;
      } catch (error) {
        console.error('Failed to fetch form schema:', error);
        throw error;
      }
    },

    submitForm: async (type: string, options: FormSubmitOptions): Promise<FormSubmitResponse> => {
      if (!type || typeof type !== 'string' || !options?.formId) {
        throw new Error('Form type and formId are required for form submission');
      }
      
      const { formId, data, redirectUrl } = options;
      
      try {
        // Use the resolved baseUrl
        const url = `${baseUrl}/api/v1/forms/submit`;
        console.log('Submitting form to:', url, { type, formId });
        
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
          credentials: 'same-origin', // Improve security with CSRF protection
        });

        if (!response.ok) {
          const error = await handleApiError(response, formId);
          
          // Log the error
          console.error('Form submission error:', error);
          
          // Show toast notification if enabled
          if (notificationsEnabled) {
            showErrorNotification(error, formId);
          }
          
          throw error;
        }

        const result = await response.json() as FormSubmitResponse;
        
        // Show success toast if notifications are enabled but there's no redirect
        if (notificationsEnabled && (!result.redirect || !result.redirect.url)) {
          toast.success('Form submitted successfully', {
            duration: 3000,
          });
        }

        // Handle redirects
        handleRedirect(result, redirectUrl);

        return result;
      } catch (error: unknown) {
        // If it's already a structured MantlzError, just rethrow it
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        // Format as a MantlzError
        const formattedError: MantlzError = {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 500,
          userMessage: 'Failed to submit form. Please check your connection and try again.',
          details: error
        };
        
        // Show toast notification for this new error if enabled
        if (notificationsEnabled) {
          showErrorNotification(formattedError, formId);
        }
        
        console.error('Error submitting form:', formattedError);
        throw formattedError;
      }
    },
    
    // Get the count of users who have joined a form
    getUsersJoinedCount: async (formId: string): Promise<number> => {
      try {
        // Use the resolved baseUrl
        const url = `${baseUrl}/api/v1/forms/${formId}/users-joined`;
        console.log('Fetching users joined count:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-API-Key': key,
          },
          credentials: 'same-origin',
        });

        if (!response.ok) {
          const error = await handleApiError(response, formId);
          console.error('Failed to get users joined count:', error);
          
          // Don't show notifications for this operation by default
          throw error;
        }

        const result = await response.json();
        return result.count || 0;
      } catch (error) {
        console.error('Error getting users joined count:', error);
        // Return 0 as a fallback to prevent UI issues
        return 0;
      }
    },
    
    // Method to configure toast notifications
    configureNotifications: (enabled: boolean, handler?: ToastHandler) => {
      if (handler) {
        toast.setHandler(handler);
      }
      
      // Update the notification mode
      notificationsEnabled = enabled;
      
      // Reset notification state when reconfiguring
      if (enabled) {
        Object.keys(notificationState.hasShownFormError).forEach(key => {
          delete notificationState.hasShownFormError[key];
        });
      }
      
      return { notifications: enabled };
    }
  };
}