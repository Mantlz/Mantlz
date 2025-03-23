import { MantlzClient, FormSubmitResponse, MantlzError, MantlzClientConfig } from './types';
import * as formsApi from './api/forms';
import * as templatesApi from './api/templates';
import { toast, ToastHandler } from './utils/toast';

export function createMantlzClient(apiKey: string, config?: MantlzClientConfig): MantlzClient {
  // Apply toast handler if provided in config
  if (config?.toastHandler) {
    toast.setHandler(config.toastHandler);
  }

  // Set notification mode - silent by default
  const notificationsEnabled = config?.notifications !== false;

  return {
    submitForm: async (type: string, options: { formId: string; data: any }): Promise<FormSubmitResponse> => {
      try {
        const { formId, data } = options;
        const url = `/api/v1/forms/submit`;
        console.log('Submitting form to:', url, { type, formId });
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
          body: JSON.stringify({
            type,
            formId,
            apiKey,
            data
          }),
        });

        if (!response.ok) {
          const errorData = await response.json() as { error?: string };
          const status = response.status;
          
          // Create structured error
          const error: MantlzError = {
            message: errorData.error || 'Form submission failed',
            code: status,
            details: errorData,
          };
          
          // Add user-friendly messages
          if (status === 401) {
            error.userMessage = 'Authentication failed. Please check your API key.';
          } else if (status === 404) {
            error.userMessage = 'The requested form could not be found.';
          } else if (status === 400) {
            error.userMessage = 'Invalid form data. Please check your submission.';
          } else if (status >= 500) {
            error.userMessage = 'Server error. Please try again later.';
          } else {
            error.userMessage = 'An error occurred. Please try again.';
          }
          
          // Show toast notification for error if enabled
          if (notificationsEnabled) {
            toast.error(error.userMessage || error.message, {
              description: error.code ? `Error ${error.code}` : undefined,
              duration: 5000,
            });
          }
          
          throw error;
        }

        const result = await response.json();
        
        // Show success toast notification if enabled
        if (notificationsEnabled) {
          toast.success('Form submitted successfully', {
            duration: 3000,
          });
        }

        return result;
      } catch (error: any) {
        // If it's already a structured MantlzError, just rethrow it
        if (error && typeof error === 'object' && 'code' in error) {
          console.error('Form submission error:', error);
          
          // Show toast for the error even if it was processed before
          // This ensures we never miss showing an error message
          if (notificationsEnabled) {
            toast.error(error.userMessage || error.message || 'An error occurred', {
              description: error.code ? `Error ${error.code}` : undefined,
              duration: 5000,
            });
          }
          
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
          toast.error(formattedError.userMessage ?? "An error occurred", {
            description: formattedError.message,
            duration: 5000,
          });
        }
        
        console.error('Error submitting form:', formattedError);
        throw formattedError;
      }
    },
    
    createForm: async (config) => {
      try {
        const result = await formsApi.createForm(config, apiKey);
        
        if (notificationsEnabled) {
          toast.success('Form created successfully');
        }
        
        return result;
      } catch (error) {
        if (notificationsEnabled) {
          const message = error instanceof Error ? error.message : 'Failed to create form';
          toast.error(message);
        }
        throw error;
      }
    },
    
    getTemplates: async () => {
      try {
        return await templatesApi.getTemplates(apiKey);
      } catch (error) {
        if (notificationsEnabled) {
          const message = error instanceof Error ? error.message : 'Failed to fetch templates';
          toast.error(message);
        }
        throw error;
      }
    },
    
    createFromTemplate: async (config) => {
      try {
        const result = await templatesApi.createFromTemplate(config, apiKey);
        
        if (notificationsEnabled) {
          toast.success('Form created from template successfully');
        }
        
        return result;
      } catch (error) {
        if (notificationsEnabled) {
          const message = error instanceof Error ? error.message : 'Failed to create form from template';
          toast.error(message);
        }
        throw error;
      }
    },
    
    // Add a method to configure toast notifications
    configureNotifications: (enabled: boolean, handler?: ToastHandler) => {
      if (handler) {
        toast.setHandler(handler);
      }
      
      // Update the notification mode
      return { notifications: enabled };
    }
  };
}