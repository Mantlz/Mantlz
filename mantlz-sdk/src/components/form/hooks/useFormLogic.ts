import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormSchema, FormField } from '../types';
import { SDK_CONFIG } from '../../../config';
import { FormSubmitResponse } from '../../../types';
import { MantlzClient } from '../../../types';

export const useFormLogic = (
  formId: string,
  client: MantlzClient | null,
  apiKey?: string,
  redirectUrl?: string
) => {
  const [formData, setFormData] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [fields, setFields] = useState<FormField[]>([]);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Process fields from form data
  const fieldsMemo = useMemo(() => {
    if (!formData) return [];
    
    if (Array.isArray(formData.fields)) {
      return formData.fields;
    }
    
    return Object.entries(formData.schema || {}).map(([id, config]: [string, any]) => {
      const field = {
        id,
        name: id,
        label: config.label || id.charAt(0).toUpperCase() + id.slice(1),
        type: config.type || 'text',
        required: config.required || false,
        placeholder: config.placeholder || '',
        options: config.options || undefined,
        defaultValue: config.defaultValue || '',
        premium: config.premium || false
      };

      // Handle product fields
      if (config.type === 'product') {
        return {
          ...field,
          products: config.products || [],
          displayMode: config.displayMode || 'grid',
          productIds: config.productIds || []
        };
      }

      return field;
    });
  }, [formData]);

  // Build Zod schema from fields
  const formSchema = useMemo(() => {
    const schemaFields: Record<string, any> = {};
    
    fieldsMemo.forEach(field => {
      let validator: any;
      
      switch (field.type) {
        case 'checkbox': 
          // For checkbox fields, we need special handling
          validator = z.boolean();
          if (field.required) {
            // If the checkbox is required, it must be checked (true)
            validator = z.literal(true, {
              errorMap: () => ({ message: `${field.label} must be checked` })
            });
          } else {
            validator = z.boolean().optional();
          }
          break;
        case 'number': 
          validator = z.coerce.number(); 
          break;
        case 'email': 
          validator = z.string().email(); 
          break;
        case 'file': 
          validator = z.instanceof(File).optional(); 
          break;
        default: 
          validator = z.string(); 
          break;
      }

      if (field.required && field.type !== 'checkbox') {
        if (field.type === 'number') {
          validator = validator.min(1, { message: `${field.label} is required` });
        } else if (field.type === 'file') {
          validator = z.instanceof(File, { message: 'Please upload a file' });
        } else {
          validator = validator.min(1, { message: `${field.label} is required` });
        }
      } else if (!field.required && field.type !== 'checkbox') {
        validator = validator.optional();
      }
      
      schemaFields[field.id] = validator;
    });

    if (formData?.formType === 'feedback') {
      schemaFields.rating = z.number().min(1, { message: "Please provide a rating" });
    }

    return z.object(schemaFields);
  }, [fieldsMemo, formData?.formType]);

  // Set up default values for form
  const defaultValues = useMemo(() => {
    return fieldsMemo.reduce((acc: Record<string, any>, field) => {
      if (field.type === 'checkbox') {
        // For checkboxes, explicitly set false as default value
        acc[field.id] = field.defaultValue === true ? true : false;
      } else {
        acc[field.id] = field.defaultValue || '';
      }
      return acc;
    }, {});
  }, [fieldsMemo]);

  // Set up form with react-hook-form
  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onBlur'
  });

  // Reset form when default values change
  useEffect(() => {
    formMethods.reset(defaultValues);
  }, [defaultValues, formMethods]);

  // Fetch form data
  useEffect(() => {
    if (!apiKey || !isMounted || !formId) return;
    
    const fetchFormData = async () => {
      try {
        setLoading(true);
        let formData;
        
        if (client?.getFormSchema) {
          try {
            formData = await client.getFormSchema(formId);
          } catch (error) {
            console.warn('Client method failed, falling back to API call', error);
          }
        }
        
        if (!formData) {
          const apiUrl = client?.apiUrl || SDK_CONFIG.DEFAULT_API_URL;
          const res = await fetch(`${apiUrl}/api/v1/forms/${formId}`, {
            headers: { 'x-api-key': apiKey } as HeadersInit,
          });
          
          if (!res.ok) throw new Error('Failed to fetch form data');
          formData = await res.json();
        }
        
        if (!formData.fields && formData.schema) {
          try {
            const schema = typeof formData.schema === 'string' 
              ? JSON.parse(formData.schema) 
              : formData.schema;
            
            formData.fields = Object.entries(schema).map(([key, value]: [string, any]) => ({
              id: key,
              name: key,
              label: value.label || key.charAt(0).toUpperCase() + key.slice(1),
              type: value.type || 'text',
              required: value.required || false,
              placeholder: value.placeholder || '',
              options: value.options || undefined,
            }));
          } catch (error) {
            // console.error('Error processing form schema:', error);
          }
        }
        
        setFormData(formData as FormSchema);
        setFields(formData.fields || []);
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFormData();
  }, [formId, apiKey, client, isMounted]);

  const validateField = (field: FormField, value: any) => {
    if (field.required) {
      // Special handling for checkbox fields
      if (field.type === 'checkbox') {
        // Ensure we're working with a boolean value
        const boolValue = value === true;
        return field.required ? boolValue : true;
      }
      
      // For other field types
      if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        return false;
      }
    }
    return true;
  };

  // Form submission handler
  const onSubmit = async (data: z.infer<typeof formSchema>): Promise<FormSubmitResponse> => {
    if (!client || !apiKey) {
      console.error('Mantlz client or API key not available');
      return { success: false, message: 'Client or API key not available' };
    }

    // Validate all fields before submission
    const validationErrors = fields.reduce((errors: string[], field) => {
      const value = data[field.name];
      if (!validateField(field, value)) {
        errors.push(`${field.label || field.name} is required`);
      }
      return errors;
    }, []);

    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    try {
      setSubmitting(true);
      
      const hasFileUploads = Object.values(data).some(value => value instanceof File);
      let submissionData;
      
      if (hasFileUploads) {
        const formDataToSend = new FormData();
        formDataToSend.append('formId', formId);
        
        if (redirectUrl) {
          formDataToSend.append('redirectUrl', redirectUrl);
        }
        
        for (const [key, value] of Object.entries(data)) {
          if (value instanceof File) {
            formDataToSend.append(key, value);
          } else if (value !== undefined && value !== null) {
            formDataToSend.append(key, String(value));
          }
        }
        
        submissionData = {
          formId,
          data: formDataToSend
        };
      } else {
        submissionData = {
          formId,
          data: Object.fromEntries(
            Object.entries(data).filter(([_, value]) => 
              value !== undefined && value !== null
            )
          ),
          redirectUrl
        };
      }
      
      const response = await client.submitForm(formId, submissionData);
      
      if (response.success) {
        setSubmitted(true);
        return response;
      } else {
        // Handle conflict errors specifically
        if (response.isConflict || (response.error?.code === 409)) {
          return {
            success: false,
            message: response.message || response.error?.userMessage || 'This value already exists',
            isConflict: true,
            error: response.error
          };
        }
        throw new Error(response.message || 'Form submission failed');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      // Check if it's a conflict error from the API
      if (error.code === 409 || error.isConflict) {
        return {
          success: false,
          message: error.userMessage || error.message || 'This value already exists',
          isConflict: true,
          error: error
        };
      }
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Form submission failed',
        error: error
      };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    loading,
    submitting,
    submitted,
    fields,
    formMethods,
    onSubmit,
    isMounted,
  };
}; 