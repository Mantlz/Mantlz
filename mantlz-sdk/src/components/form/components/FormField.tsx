import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { FileUpload } from '../../ui/file-upload';
import { Checkbox } from './Checkbox';
import { cn } from '../../../utils/cn';
import { FormFieldConfig } from '../types';
import { ThemeClasses } from '../themes';

interface FormFieldProps {
  field: FormFieldConfig;
  formMethods: UseFormReturn<any>;
  themeClasses: ThemeClasses;
}

export const FormField = ({
  field,
  formMethods,
  themeClasses,
}: FormFieldProps) => {
  const renderField = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            className={cn(themeClasses.input)}
            {...formMethods.register(field.id)}
          />
        );
      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              id={field.id}
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
              "w-full rounded-lg p-2",
              themeClasses.input
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
              className={cn(themeClasses.input)}
            />
          </div>
        );
      default:
        return (
          <Input
            id={field.id}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            className={cn(themeClasses.input)}
            {...formMethods.register(field.id)}
          />
        );
    }
  };

  return (
    <div key={field.id}>
      <label
        htmlFor={field.id}
        className={cn('block text-sm font-medium mb-1', themeClasses.label)}
      >
        {field.label}
        {field.required && <span className="text-red-500">*</span>}
      </label>
      
      {renderField()}
      
      {formMethods.formState.errors[field.id] && (
        <p className={cn("text-sm mt-1", themeClasses.error)}>
          {formMethods.formState.errors[field.id]?.message as string}
        </p>
      )}
    </div>
  );
}; 