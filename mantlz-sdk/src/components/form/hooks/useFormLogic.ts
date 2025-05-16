import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormSchema } from '../types';
import { SDK_CONFIG } from '../../../config';

export const useFormLogic = (
  formId: string,
  client: any,
  apiKey?: string,
  redirectUrl?: string
) => {
  const [formData, setFormData] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Process fields from form data
  const fields = useMemo(() => {
    if (!formData) return [];
    
    if (Array.isArray(formData.fields)) {
      return formData.fields;
    }
    
    return Object.entries(formData.schema || {}).map(([id, config]: [string, any]) => ({
      id,
      name: id,
      label: config.label || id.charAt(0).toUpperCase() + id.slice(1),
      type: config.type || 'text',
      required: config.required || false,
      placeholder: config.placeholder || '',
      options: config.options || undefined,
      defaultValue: config.defaultValue || '',
    }));
  }, [formData]);

  // Build Zod schema from fields
  const formSchema = useMemo(() => {
    const schemaFields: Record<string, any> = {};
    
    fields.forEach(field => {
      let validator: any;
      
      switch (field.type) {
        case 'number': validator = z.coerce.number(); break;
        case 'checkbox': validator = z.boolean(); break;
        case 'email': validator = z.string().email(); break;
        case 'file': validator = z.instanceof(File).optional(); break;
        default: validator = z.string(); break;
      }

      if (field.required) {
        if (field.type === 'checkbox') {
          validator = z.boolean().refine(val => val === true, { message: `${field.label} is required` });
        } else if (field.type === 'number') {
          validator = validator.min(1, { message: `${field.label} is required` });
        } else if (field.type === 'file') {
          validator = z.instanceof(File, { message: 'Please upload a file' });
        } else {
          validator = validator.min(1, { message: `${field.label} is required` });
        }
      } else {
        validator = validator.optional();
      }
      
      schemaFields[field.id] = validator;
    });

    if (formData?.formType === 'feedback') {
      schemaFields.rating = z.number().min(1, { message: "Please provide a rating" });
    }

    return z.object(schemaFields);
  }, [fields, formData?.formType]);

  // Set up default values for form
  const defaultValues = useMemo(() => {
    return fields.reduce((acc: Record<string, any>, field) => {
      acc[field.id] = field.defaultValue || (field.type === 'checkbox' ? false : '');
      return acc;
    }, {});
  }, [fields]);

  // Set up form with react-hook-form
  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
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
            console.error('Error processing form schema:', error);
          }
        }
        
        setFormData(formData as FormSchema);
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFormData();
  }, [formId, apiKey, client, isMounted]);

  // Form submission handler
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!client || !apiKey) {
      console.error('Mantlz client or API key not available');
      return;
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
        
        if (redirectUrl && typeof window !== 'undefined') {
          if (redirectUrl.startsWith('http')) {
            window.location.href = redirectUrl;
          } else {
            window.location.href = `${window.location.origin}${redirectUrl.startsWith('/') ? '' : '/'}${redirectUrl}`;
          }
        }
      } else {
        throw new Error(response.message || 'Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
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