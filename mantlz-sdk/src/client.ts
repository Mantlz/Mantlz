import { MantlzClient, FormSubmitOptions, FormSubmitResponse } from './types';
import * as formsApi from './api/forms';
import * as templatesApi from './api/templates';

export function createMantlzClient(apiKey: string): MantlzClient {
  return {
    submitForm: async (type: string, options: FormSubmitOptions): Promise<FormSubmitResponse> => {
      try {
        const url = '/api/v1/forms/submit';
        console.log('Submitting form to:', url, { type, formId: options.formId });
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type,
            formId: options.formId,
            apiKey: options.apiKey,
            data: options.data,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json() as { error?: string };
          throw new Error(errorData.error || 'Form submission failed');
        }

        return await response.json();
      } catch (error) {
        console.error('Error submitting form:', error);
        throw error;
      }
    },
    
    createForm: (config) => 
      formsApi.createForm(config, apiKey),
    
    getTemplates: () => 
      templatesApi.getTemplates(apiKey),
    
    createFromTemplate: (config) => 
      templatesApi.createFromTemplate(config, apiKey),
  };
} 