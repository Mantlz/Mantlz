import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import * as Form from '@radix-ui/react-form';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import { //CheckIcon,
   ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { FormField as FormFieldType } from '../types';
import { useAppearance } from '../hooks/useAppearance';
import { FileUpload } from '../../ui/file-upload';
import { ProductField } from './ProductField';
import { StarRating } from './StarRating';

interface FormFieldProps {
  field: FormFieldType;
  formMethods: UseFormReturn<any>;
  theme: string;
  appearance?: import('../types').Appearance;
}

export const FormField = ({
  field,
  formMethods,
  theme,
  appearance,
}: FormFieldProps) => {
  const { 
    getLabelStyles, 
    getInputStyles, 
    getElementClasses, 
    mergeClasses,
    styles 
  } = useAppearance(theme, appearance);
  
  const elementClasses = getElementClasses();

  const renderField = () => {
    // Special handling for rating field in feedback forms
    if (field.type === 'number' && field.name === 'rating') {
      // Get the current rating value from form state
      const ratingValue = formMethods.watch(field.id) || 0;
      
      return (
        <Form.Field name={field.id}>
          <Form.Label 
            className={mergeClasses('', elementClasses.formLabel)}
            style={getLabelStyles()}
          >
            {field.label}
            {field.required && <span style={{ color: 'var(--red-9)' }}>*</span>}
          </Form.Label>
          <StarRating 
            rating={ratingValue} 
            setRating={(value) => {
              formMethods.setValue(field.id, value, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
              });
            }} 
          />
          {formMethods.formState.errors[field.id] && (
            <Form.Message style={styles.field.error}>
              {formMethods.formState.errors[field.id]?.message as string}
            </Form.Message>
          )}
        </Form.Field>
      );
    }
    
    switch (field.type) {
      case 'textarea':
        return (
          <Form.Field name={field.id}>
            <Form.Label 
              className={mergeClasses('', elementClasses.formLabel)}
              style={getLabelStyles()}
            >
              {field.label}
              {field.required && <span style={{ color: 'var(--red-9)' }}>*</span>}
            </Form.Label>
            <Form.Control asChild>
              <textarea
                id={field.id}
                placeholder={field.placeholder}
                className={mergeClasses('', elementClasses.formInput)}
                {...formMethods.register(field.id)}
                style={{
                  ...getInputStyles(),
                  minHeight: '100px',
                }}
              />
            </Form.Control>
            {formMethods.formState.errors[field.id] && (
              <Form.Message 
                className={mergeClasses('', elementClasses.formError)}
                style={styles.field.error}
              >
                {formMethods.formState.errors[field.id]?.message as string}
              </Form.Message>
            )}
          </Form.Field>
        );

      case 'checkbox':
        return (
          <Form.Field name={field.id}>
            <div className="form-field">
              <div className="flex items-center gap-2">
                <Checkbox.Root
                  id={field.id}
                  checked={formMethods.watch(field.id)}
                  onCheckedChange={(checked) => {
                    const boolValue = checked === true;
                    formMethods.setValue(field.id, boolValue, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true
                    });
                  }}
                  name={field.id}
                  className="h-4 w-4 rounded border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <Checkbox.Indicator className="flex items-center justify-center">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M9 1L3.5 6.5L1 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label 
                  htmlFor={field.id}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    field.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''
                  }`}
                >
                  {field.label}
                </label>
              </div>
              {formMethods.formState.errors[field.id] && (
                <Form.Message 
                  className={mergeClasses('', elementClasses.formError)}
                  style={styles.field.error}
                >
                  {formMethods.formState.errors[field.id]?.message as string}
                </Form.Message>
              )}
            </div>
          </Form.Field>
        );

      case 'select':
        if (!Array.isArray(field.options)) return null;
        return (
          <Form.Field name={field.id}>
            <Form.Label 
              className={mergeClasses('', elementClasses.formLabel)}
              style={getLabelStyles()}
            >
              {field.label}
              {field.required && <span style={{ color: 'var(--red-9)' }}>*</span>}
            </Form.Label>
            <Select.Root onValueChange={(value) => formMethods.setValue(field.id, value)}>
              <Select.Trigger 
                className={mergeClasses('', elementClasses.formInput)}
                style={getInputStyles()}
              >
                <Select.Value placeholder="Select an option" />
                <Select.Icon>
                  <ChevronDownIcon />
                </Select.Icon>
              </Select.Trigger>

              <Select.Portal>
                <Select.Content>
                  <Select.ScrollUpButton>
                    <ChevronUpIcon />
                  </Select.ScrollUpButton>
                  <Select.Viewport>
                    {field.options.map((option, index) => (
                      <Select.Item
                        key={index}
                        value={option.value}
                        style={{
                          padding: '8px',
                          cursor: 'pointer',
                          outline: 'none',
                        }}
                      >
                        <Select.ItemText>{option.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                  <Select.ScrollDownButton>
                    <ChevronDownIcon />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
            {formMethods.formState.errors[field.id] && (
              <Form.Message 
                className={mergeClasses('', elementClasses.formError)}
                style={styles.field.error}
              >
                {formMethods.formState.errors[field.id]?.message as string}
              </Form.Message>
            )}
          </Form.Field>
        );

      case 'file':
        return (
          <Form.Field name={field.id}>
            <Form.Label 
              className={mergeClasses('', elementClasses.formLabel)}
              style={getLabelStyles()}
            >
              {field.label}
              {field.required && <span style={{ color: 'var(--red-9)' }}>*</span>}
            </Form.Label>
            <FileUpload
              name={field.id}
              accept={field.accept}
              maxSize={field.maxSize}
              required={field.required}
              value={formMethods.watch(field.id)}
              onChange={(file) => formMethods.setValue(field.id, file, { shouldValidate: true })}
              onBlur={() => formMethods.trigger(field.id)}
            />
            {formMethods.formState.errors[field.id] && (
              <Form.Message 
                className={mergeClasses('', elementClasses.formError)}
                style={styles.field.error}
              >
                {formMethods.formState.errors[field.id]?.message as string}
              </Form.Message>
            )}
          </Form.Field>
        );

      case 'product':
        return (
          <ProductField
            field={field}
            formMethods={formMethods}
            theme={theme}
            appearance={appearance}
          />
        );

      default:
        return (
          <Form.Field name={field.id}>
            <Form.Label 
              className={mergeClasses('', elementClasses.formLabel)}
              style={getLabelStyles()}
            >
              {field.label}
              {field.required && <span style={{ color: 'var(--red-9)' }}>*</span>}
            </Form.Label>
            <Form.Control asChild>
              <input
                id={field.id}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                className={mergeClasses('', elementClasses.formInput)}
                {...formMethods.register(field.id)}
                style={getInputStyles()}
              />
            </Form.Control>
            {formMethods.formState.errors[field.id] && (
              <Form.Message 
                className={mergeClasses('', elementClasses.formError)}
                style={styles.field.error}
              >
                {formMethods.formState.errors[field.id]?.message as string}
              </Form.Message>
            )}
          </Form.Field>
        );
    }
  };

  return (
    <div style={styles.field.container}>
      {renderField()}
    </div>
  );
};