import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import * as Form from '@radix-ui/react-form';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { FormField as FormFieldType } from '../types';
import { themes } from '../themes';
import { useTheme } from '../hooks/useTheme';
import { FileUpload } from '../../ui/file-upload';

interface FormFieldProps {
  field: FormFieldType;
  formMethods: UseFormReturn<any>;
}

export const FormField = ({
  field,
  formMethods,
}: FormFieldProps) => {
  const { theme: selectedTheme } = useTheme();
  const styles = themes[selectedTheme || 'default'];

  const renderField = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <Form.Field name={field.id}>
            <Form.Label style={styles.field.label}>
              {field.label}
              {field.required && <span style={{ color: 'var(--red-9)' }}>*</span>}
            </Form.Label>
            <Form.Control asChild>
              <textarea
                id={field.id}
                placeholder={field.placeholder}
                {...formMethods.register(field.id)}
                style={{
                  ...styles.field.input,
                  minHeight: '100px',
                }}
              />
            </Form.Control>
            {formMethods.formState.errors[field.id] && (
              <Form.Message style={styles.field.error}>
                {formMethods.formState.errors[field.id]?.message as string}
              </Form.Message>
            )}
          </Form.Field>
        );

      case 'checkbox':
        return (
          <Form.Field name={field.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Checkbox.Root
                id={field.id}
                {...formMethods.register(field.id)}
                style={{
                  ...styles.field.input,
                  width: '20px',
                  height: '20px',
                }}
              >
                <Checkbox.Indicator>
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <Form.Label style={{ ...styles.field.label, cursor: 'pointer' }}>
                {field.placeholder || field.label}
                {field.required && <span style={{ color: 'var(--red-9)', marginLeft: '4px' }}>*</span>}
              </Form.Label>
            </div>
            {formMethods.formState.errors[field.id] && (
              <Form.Message style={styles.field.error}>
                {formMethods.formState.errors[field.id]?.message as string}
              </Form.Message>
            )}
          </Form.Field>
        );

      case 'select':
        if (!Array.isArray(field.options)) return null;
        return (
          <Form.Field name={field.id}>
            <Form.Label style={styles.field.label}>
              {field.label}
              {field.required && <span style={{ color: 'var(--red-9)' }}>*</span>}
            </Form.Label>
            <Select.Root onValueChange={(value) => formMethods.setValue(field.id, value)}>
              <Select.Trigger style={styles.field.input}>
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
              <Form.Message style={styles.field.error}>
                {formMethods.formState.errors[field.id]?.message as string}
              </Form.Message>
            )}
          </Form.Field>
        );

      case 'file':
        return (
          <Form.Field name={field.id}>
            <Form.Label style={styles.field.label}>
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
              <Form.Message style={styles.field.error}>
                {formMethods.formState.errors[field.id]?.message as string}
              </Form.Message>
            )}
          </Form.Field>
        );

      default:
        return (
          <Form.Field name={field.id}>
            <Form.Label style={styles.field.label}>
              {field.label}
              {field.required && <span style={{ color: 'var(--red-9)' }}>*</span>}
            </Form.Label>
            <Form.Control asChild>
              <input
                id={field.id}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                {...formMethods.register(field.id)}
                style={styles.field.input}
              />
            </Form.Control>
            {formMethods.formState.errors[field.id] && (
              <Form.Message style={styles.field.error}>
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