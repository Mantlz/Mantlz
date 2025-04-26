'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { cn } from '../../utils/cn';
import { Loader2, Star } from 'lucide-react';
import { useMantlz } from '../../context/mantlzContext';
import { ApiKeyErrorCard } from '../ui/ApiKeyErrorCard';
import { toast } from '../../utils/toast';
import { SDK_CONFIG } from '../../config';

// Simple Checkbox component if it's missing
const Checkbox = ({ 
  colorMode, 
  ...props 
}: React.InputHTMLAttributes<HTMLInputElement> & { colorMode?: 'light' | 'dark' }) => (
  <input 
    type="checkbox" 
    className={cn(
      "h-4 w-4 rounded border-gray-300", 
      colorMode === 'dark' ? "bg-gray-700 border-gray-600" : "bg-white",
    )}
    {...props} 
  />
);

const StarRating = ({ 
  rating, 
  setRating, 
  count = 5,
  colorMode = 'light'
}: { 
  rating: number; 
  setRating: (rating: number) => void; 
  count?: number;
  colorMode?: 'light' | 'dark'; 
}) => {
  const [hover, setHover] = useState(0);
  
  return (
    <div className="flex gap-1">
      {[...Array(count)].map((_, index) => {
        const starValue = index + 1;
        // Determine the effective rating based on hover and selection
        const effectiveRating = Math.max(hover, rating);
        
        return (
          <Star
            key={index}
            size={24}
            className={cn(
              "cursor-pointer transition-all",
              // Highlight based on the effective rating
              starValue <= effectiveRating
                ? colorMode === 'dark' 
                  ? "fill-yellow-400 stroke-yellow-400" 
                  : "fill-yellow-500 stroke-yellow-500"
                : colorMode === 'dark'
                ? "stroke-gray-400" 
                : "stroke-gray-300"
            )}
            onClick={() => setRating(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)} // Reset hover state
          />
        );
      })}
    </div>
  );
};

export interface FormFieldConfig {
  id: string;
  name: string;
  type: string;
  required: boolean;
  placeholder?: string;
  label?: string;
  options?: string[];
  defaultValue?: any;
}

export interface FormSchema {
  id: string;
  name: string;
  title?: string;
  description?: string;
  schema: Record<string, any>;
  fields?: FormFieldConfig[];
  formType?: string;
}

export interface DynamicFormProps {
  formId: string;
  colorMode?: 'light' | 'dark';
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

export default function DynamicForm({
  formId,
  colorMode = 'light',
  onSuccess,
  onError,
  className,
}: DynamicFormProps) {
  const { client, apiKey } = useMantlz();
  const [formData, setFormData] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [starRating, setStarRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const textColorClass = colorMode === 'dark' ? 'text-white' : 'text-gray-900';
  const bgColorClass = colorMode === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColorClass = colorMode === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBgClass = colorMode === 'dark' ? 'bg-gray-700' : 'bg-white';
  const inputTextClass = colorMode === 'dark' ? 'text-white' : 'text-gray-900';
  const inputBorderClass = colorMode === 'dark' ? 'border-gray-600' : 'border-gray-300';

  useEffect(() => {
    if (!apiKey) return;
    
    const fetchFormData = async () => {
      try {
        setLoading(true);
        
        let formData;
        
        // Try to use the client's getFormSchema method if available
        if (client && typeof client.getFormSchema === 'function') {
          try {
            formData = await client.getFormSchema(formId);
          } catch (error) {
            console.warn('Failed to fetch schema using client method, falling back to direct API call', error);
          }
        }
        
        // Fall back to direct API call if client method failed or is not available
        if (!formData) {
          const apiUrl = client?.apiUrl || SDK_CONFIG.DEFAULT_API_URL;
          const res = await fetch(`${apiUrl}/api/v1/forms/${formId}`, {
            headers: {
              'x-api-key': apiKey,
            } as HeadersInit,
          });
          
          if (!res.ok) {
            throw new Error('Failed to fetch form data');
          }
          
          formData = await res.json();
        }
        
        // Process the form data to ensure it has the required structure
        if (!formData.fields && formData.schema) {
          // Legacy format - convert schema to fields
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
        if (onError) onError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFormData();
  }, [formId, apiKey, client, onError]);

  const fields = useMemo(() => {
    if (!formData) return [];
    return Array.isArray(formData.fields)
      ? formData.fields
      : Object.entries(formData.schema || {}).map(([id, config]: [string, any]) => ({
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

  const formSchema = useMemo(() => {
    const schemaFields: Record<string, any> = {};
    fields.forEach(field => {
      let validator: any;
      switch (field.type) {
        case 'number': validator = z.coerce.number(); break;
        case 'checkbox': validator = z.boolean(); break;
        case 'email': validator = z.string().email(); break;
        case 'textarea':
        case 'select':
        case 'text':
        default: validator = z.string(); break;
      }

      if (field.required) {
        if (field.type === 'checkbox') {
          validator = z.boolean().refine(val => val === true, { message: `${field.label} is required` });
        } else if (field.type === 'number') {
          validator = validator.min(1, { message: `${field.label} is required` });
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

  const defaultValues = useMemo(() => {
    return fields.reduce((acc: Record<string, any>, field) => {
      acc[field.id] = field.defaultValue || (field.type === 'checkbox' ? false : '');
      return acc;
    }, {});
  }, [fields]);

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    formMethods.reset(defaultValues);
  }, [defaultValues, formMethods]);

  const removeEmptyFields = (data: Record<string, any>) => {
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => {
        if (value === undefined || value === null || value === '') return false;
        return true;
      })
    );
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!formData) {
      toast.error("Form data not loaded yet.");
      return;
    }
    
    try {
      setSubmitting(true);
      
      if (formData.formType === 'feedback') {
        data.rating = starRating;
      }
      
      if (!client) {
        throw new Error('Client is not initialized');
      }
      
      await client.submitForm(formData.formType || 'contact', {
        formId,
        data: removeEmptyFields(data),
      });
      
      setSubmitted(true);
      toast.success("Your form has been submitted successfully.");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("There was a problem submitting your form. Please try again.");
      
      if (onError) {
        onError(error as Error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!apiKey) {
    return <ApiKeyErrorCard />;
  }

  if (!formData || fields.length === 0) {
    return (
      <Card className={cn(bgColorClass, borderColorClass, className)}>
        <CardHeader>
          <CardTitle className={textColorClass}>Form Error</CardTitle>
          <CardDescription className={colorMode === 'dark' ? 'text-gray-300' : 'text-gray-500'}>
            {loading ? 'Loading form...' : 'Form configuration is missing or empty.'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card className={cn("mantlz-form", bgColorClass, borderColorClass, className)}>
        <CardHeader>
          <CardTitle className={textColorClass}>Thank You!</CardTitle>
          <CardDescription className={colorMode === 'dark' ? 'text-gray-300' : 'text-gray-500'}>
            Your submission has been received.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={cn("mantlz-form", bgColorClass, borderColorClass, className)}>
      <CardHeader>
        <CardTitle className={textColorClass}>{formData.title || formData.name}</CardTitle>
        {formData.description && (
          <CardDescription className={colorMode === 'dark' ? 'text-gray-300' : 'text-gray-500'}>
            {formData.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className={cn('block text-sm font-medium mb-1', textColorClass)}
              >
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  className={cn(inputBgClass, inputTextClass, inputBorderClass)}
                  {...formMethods.register(field.id)}
                />
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={field.id}
                    colorMode={colorMode}
                    {...formMethods.register(field.id)}
                  />
                  <label
                    htmlFor={field.id}
                    className={cn('text-sm', textColorClass)}
                  >
                    {field.placeholder || field.label}
                  </label>
                </div>
              ) : field.type === 'select' && Array.isArray(field.options) ? (
                <select
                  id={field.id}
                  className={cn(
                    "w-full rounded-md p-2 border border-input",
                    inputBgClass, 
                    inputTextClass, 
                    inputBorderClass
                  )}
                  {...formMethods.register(field.id)}
                >
                  <option value="">Select an option</option>
                  {field.options.map((option: string, index: number) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.id}
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  className={cn(inputBgClass, inputTextClass, inputBorderClass)}
                  {...formMethods.register(field.id)}
                />
              )}
              
              {formMethods.formState.errors[field.id] && (
                <p className="text-red-500 text-sm mt-1">
                  {formMethods.formState.errors[field.id]?.message as string}
                </p>
              )}
            </div>
          ))}
          
          {formData.formType === 'feedback' && (
            <div>
              <label className={cn('block text-sm font-medium mb-1', textColorClass)}>
                Rating<span className="text-red-500">*</span>
              </label>
              <StarRating 
                rating={starRating} 
                setRating={setStarRating} 
                colorMode={colorMode}
              />
              {formMethods.formState.errors.rating && (
                <p className="text-red-500 text-sm mt-1">
                  {formMethods.formState.errors.rating?.message as string}
                </p>
              )}
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 