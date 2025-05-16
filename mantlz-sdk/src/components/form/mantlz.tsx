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
import { FileUpload } from '../ui/file-upload';
import { FormFieldConfig, FormSchema, MantlzProps } from './types';
import { processAppearance } from './themeUtils';

// Animation styles
const fadeInAnimation = "opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]";
const fadeInKeyframes = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

// Component for checkbox input
const Checkbox = ({ 
  colorMode, 
  ...props 
}: React.InputHTMLAttributes<HTMLInputElement> & { colorMode?: 'light' | 'dark' }) => (
  <input 
    type="checkbox" 
    className={cn(
      "h-4 w-4 rounded border-zinc-300", 
      colorMode === 'dark' ? "bg-zinc-700 border-zinc-600" : "bg-white",
    )}
    {...props} 
  />
);

// Star rating component
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
        const effectiveRating = Math.max(hover, rating);
        const isHighlighted = starValue <= effectiveRating;
        const fillColor = colorMode === 'dark' ? "fill-yellow-400 stroke-yellow-400" : "fill-yellow-500 stroke-yellow-500";
        const emptyColor = colorMode === 'dark' ? "stroke-gray-400" : "stroke-gray-300";
        
        return (
          <Star
            key={index}
            size={24}
            className={cn(
              "cursor-pointer transition-all",
              isHighlighted ? fillColor : emptyColor
            )}
            onClick={() => setRating(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
          />
        );
      })}
    </div>
  );
};

export default function Mantlz({
  formId,
  colorMode = 'light',
  onSuccess,
  onError,
  className,
  showUsersJoined = false,
  usersJoinedCount: initialUsersJoinedCount = 0,
  usersJoinedLabel = 'people have joined',
  redirectUrl,
  theme = 'default',
  appearance,
  variant = 'default',
}: MantlzProps) {
  const { client, apiKey } = useMantlz();
  const [formData, setFormData] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [starRating, setStarRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [usersJoined, setUsersJoined] = useState(initialUsersJoinedCount);
  const [canShowUsersJoined, setCanShowUsersJoined] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch users joined count
  useEffect(() => {
    if (!showUsersJoined || !client || !formId) return;
    
    const fetchUsersCount = async () => {
      try {
        const count = await client.getUsersJoinedCount(formId);
        if (count > 0) {
          setUsersJoined(count);
          setCanShowUsersJoined(true);
        }
      } catch (error) {
        console.error('Failed to fetch users joined count:', error);
      }
    };
    
    fetchUsersCount();
    const intervalId = setInterval(fetchUsersCount, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, [showUsersJoined, formId, client]);

  // Process styles
  const styles = useMemo(() => {
    const processedAppearance = appearance && typeof appearance === 'function'
      ? appearance(theme)
      : appearance || {};
    return processAppearance(processedAppearance, theme);
  }, [appearance, theme]);

  // Theme classes
  const themeClasses = useMemo(() => {
    const baseThemeClasses = {
      text: colorMode === 'dark' ? 'text-white' : 'text-gray-900',
      bg: colorMode === 'dark' ? 'bg-zinc-800' : 'bg-white',
      border: colorMode === 'dark' ? 'border-zinc-700' : 'border-zinc-200',
      inputBg: colorMode === 'dark' ? 'bg-zinc-700' : 'bg-white',
      inputText: colorMode === 'dark' ? 'text-white' : 'text-gray-900',
      inputBorder: colorMode === 'dark' ? 'border-zinc-600' : 'border-zinc-300',
      description: colorMode === 'dark' ? 'text-gray-300' : 'text-gray-500',
    };

    // Add theme-specific classes
    const themeSpecificClasses = {
      default: {},
      minimal: {
        border: 'border-0',
        bg: 'bg-transparent',
      },
      modern: {
        border: 'border-2',
        bg: colorMode === 'dark' ? 'bg-zinc-900' : 'bg-gray-50',
      },
      classic: {
        border: 'border-2 rounded-sm',
        bg: colorMode === 'dark' ? 'bg-zinc-800' : 'bg-white',
      },
    }[theme];

    return {
      ...baseThemeClasses,
      ...themeSpecificClasses,
      ...styles.baseStyle,
    };
  }, [colorMode, theme, styles]);

  // Fetch form data
  useEffect(() => {
    if (!apiKey || !isMounted) return;
    
    const fetchFormData = async () => {
      try {
        setLoading(true);
        let formData;
        
        // Try client method first
        if (client?.getFormSchema) {
          try {
            formData = await client.getFormSchema(formId);
          } catch (error) {
            console.warn('Client method failed, falling back to API call', error);
          }
        }
        
        // Fall back to direct API call
        if (!formData) {
          const apiUrl = client?.apiUrl || SDK_CONFIG.DEFAULT_API_URL;
          const res = await fetch(`${apiUrl}/api/v1/forms/${formId}`, {
            headers: { 'x-api-key': apiKey } as HeadersInit,
          });
          
          if (!res.ok) throw new Error('Failed to fetch form data');
          formData = await res.json();
        }
        
        // Process schema if needed
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
        if (onError) onError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFormData();
  }, [formId, apiKey, client, onError, isMounted]);

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
      
      // Set up validator based on field type
      switch (field.type) {
        case 'number': validator = z.coerce.number(); break;
        case 'checkbox': validator = z.boolean(); break;
        case 'email': validator = z.string().email(); break;
        case 'file': validator = z.instanceof(File).optional(); break;
        default: validator = z.string(); break;
      }

      // Add required validation
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

    // Add rating field for feedback forms
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

  // Helper to remove empty fields from submission
  // const removeEmptyFields = (data: Record<string, any>) => {
  //   return Object.fromEntries(
  //     Object.entries(data).filter(([_, value]) => 
  //       value !== undefined && value !== null && value !== ''
  //     )
  //   );
  // };

  // Form submission handler
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!client || !apiKey) {
      console.error('Mantlz client or API key not available');
      return;
    }

    try {
      setSubmitting(true);
      
      // Check if we have any file uploads in the current submission
      const hasFileUploads = Object.values(data).some(value => value instanceof File);
      
      let submissionData;
      
      if (hasFileUploads) {
        // Use FormData if we have files to upload
        const formDataToSend = new FormData();
        formDataToSend.append('formId', formId);
        
        // Add redirect URL if provided
        if (redirectUrl) {
          formDataToSend.append('redirectUrl', redirectUrl);
        }
        
        // Add all form fields
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
        // If no files, use regular JSON
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
        if (onSuccess) onSuccess();
        
        // Handle redirect if URL is provided
        if (redirectUrl) {
          if (typeof window !== 'undefined') {
            // Check if it's an absolute URL
            if (redirectUrl.startsWith('http')) {
              window.location.href = redirectUrl;
            } else {
              // For relative URLs, use window.location.origin
              window.location.href = `${window.location.origin}${redirectUrl.startsWith('/') ? '' : '/'}${redirectUrl}`;
            }
          }
        }
      } else {
        throw new Error(response.message || 'Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      if (onError) onError(error as Error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Render loading state
  if (!isMounted || loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render API key error
  if (!apiKey) {
    return <ApiKeyErrorCard />;
  }

  // Render form error
  if (!formData || fields.length === 0) {
    return (
      <Card className={cn(themeClasses.bg, themeClasses.border, className)}>
        <CardHeader>
          <CardTitle className={themeClasses.text}>Form Error</CardTitle>
          <CardDescription className={themeClasses.description}>
            {loading ? 'Loading form...' : 'Form configuration is missing or empty.'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Render success message after submission
  if (submitted) {
    return (
      <Card className={cn("mantlz-form", themeClasses.bg, themeClasses.border, className)}>
        <CardHeader>
          <CardTitle className={themeClasses.text}>Thank You!</CardTitle>
          <CardDescription className={themeClasses.description}>
            Your submission has been received.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Render form field based on type
  const renderField = (field: FormFieldConfig) => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            className={cn(themeClasses.inputBg, themeClasses.inputText, themeClasses.inputBorder)}
            {...formMethods.register(field.id)}
          />
        );
      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              id={field.id}
              colorMode={colorMode}
              {...formMethods.register(field.id)}
            />
            <label
              htmlFor={field.id}
              className={cn('text-sm', themeClasses.text)}
            >
              {field.placeholder || field.label}
            </label>
          </div>
        );
      case 'select':
        if (!Array.isArray(field.options)) return null;
        return (
          <select
            id={field.id}
            className={cn(
              "w-full rounded-lg p-2 border border-input",
              themeClasses.inputBg, 
              themeClasses.inputText, 
              themeClasses.inputBorder
            )}
            {...formMethods.register(field.id)}
          >
            <option value="">Select an option</option>
            {field.options.map((option: string, index: number) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'file':
        return (
          <div className="space-y-2">
            <FileUpload
              value={formMethods.watch(field.id)}
              accept={typeof field.accept === 'string' ? field.accept.split(',') : field.accept}
              maxSize={field.maxSize}
              onChange={(file) => {
                formMethods.setValue(field.id, file);
              }}
              className={cn(
                themeClasses.inputBg, 
                themeClasses.inputText, 
                themeClasses.inputBorder
              )}
            />
          </div>
        );
      default:
        return (
          <Input
            id={field.id}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            className={cn(themeClasses.inputBg, themeClasses.inputText, themeClasses.inputBorder)}
            {...formMethods.register(field.id)}
          />
        );
    }
  };

  // Main form render
  return (
    <Card className={cn(
      "mantlz-form",
      themeClasses.bg,
      themeClasses.border,
      styles.elements?.card,
      variant === 'glass' && 'bg-opacity-50 backdrop-blur-sm',
      className
    )}>
      <style dangerouslySetInnerHTML={{ __html: fadeInKeyframes }} />
      
      <CardHeader>
        <CardTitle className={themeClasses.text}>{formData?.title || formData?.name}</CardTitle>
        {formData?.description && (
          <CardDescription className={themeClasses.description}>
            {formData.description}
          </CardDescription>
        )}
        
        {showUsersJoined && canShowUsersJoined && usersJoined > 0 && (
          <div className={cn(
            "inline-flex items-center justify-center mt-2 font-medium",
            "transition-all duration-300 ease-in-out",
            fadeInAnimation,
          )}>
            <span className="font-bold mr-1">{usersJoined}</span> {usersJoinedLabel}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-2">
          {fields.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className={cn('block text-sm font-medium mb-1', themeClasses.text)}
              >
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              
              {renderField(field)}
              
              {formMethods.formState.errors[field.id] && (
                <p className="text-red-500 text-sm mt-1">
                  {formMethods.formState.errors[field.id]?.message as string}
                </p>
              )}
            </div>
          ))}
          
          {formData.formType === 'feedback' && (
            <div>
              <label className={cn('block text-sm font-medium mb-1', themeClasses.text)}>
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
