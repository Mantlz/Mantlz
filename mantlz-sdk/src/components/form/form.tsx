import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '../../utils/cn';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea';
  placeholder?: string;
  required?: boolean;
  validation?: z.ZodType<any>;
}

export interface FormProps {
  fields: FormField[];
  onSubmit: (data: any) => Promise<void>;
  submitLabel?: string;
  className?: string;
}

export function Form({ fields, onSubmit, submitLabel = 'Submit', className }: FormProps) {
  const schema = z.object(
    fields.reduce((acc, field) => {
      let fieldSchema: z.ZodType<any>;
      
      if (field.type === 'email') {
        fieldSchema = z.string().email('Invalid email address');
      } else if (field.type === 'number') {
        fieldSchema = z.number();
      } else {
        fieldSchema = z.string();
      }
      
      if (!field.required) {
        fieldSchema = fieldSchema.optional();
      }
      
      if (field.validation) {
        fieldSchema = field.validation;
      }
      
      return { ...acc, [field.name]: fieldSchema };
    }, {} as Record<string, z.ZodType<any>>)
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
    >
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label
            htmlFor={field.name}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            error={errors[field.name]?.message as string}
            {...register(field.name)}
          />
        </div>
      ))}
      
      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
      >
        {submitLabel}
      </Button>
    </form>
  );
} 