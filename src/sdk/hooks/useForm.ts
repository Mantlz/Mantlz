import { useCallback, useState } from 'react';
import { z } from 'zod';
import FormsQuay from '../core';

// Initialize the client
const client = new FormsQuay({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
});

interface UseFormOptions<T extends z.ZodType> {
  formId: string;
  schema: T;
}

export function useForm<T extends z.ZodType>({ formId, schema }: UseFormOptions<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = (name: string) => ({
    name,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // TODO: Add field-level validation
    },
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());
      
      // Validate the data
      const validatedData = schema.parse(data);
      
      // Submit the form
      await client.submitForm(formId, validatedData);
      
      // TODO: Add success handling
    } catch (error) {
      // TODO: Add error handling
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formId, schema]);

  return {
    register,
    handleSubmit,
    isSubmitting,
  };
}
