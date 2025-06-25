import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { Theme } from '@radix-ui/themes';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ options, onChange, placeholder = 'Select an option...', disabled, name }, ref) => {
    return (
      <Theme appearance="light" accentColor="blue" radius="medium">
        <SelectPrimitive.Root onValueChange={onChange} name={name}>
          <SelectPrimitive.Trigger
            ref={ref}
            disabled={disabled}
            style={{
              width: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid var(--gray-6)',
              backgroundColor: 'white',
              color: 'black',
              fontSize: '14px',
              lineHeight: '1.5',
              gap: '8px',
              outline: 'none',
              transition: 'all 150ms ease',
            }}
          >
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon>
              <ChevronDownIcon />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              style={{
                overflow: 'hidden',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid var(--gray-6)',
                boxShadow: '0 2px 10px var(--gray-7)',
              }}
            >
              <SelectPrimitive.ScrollUpButton
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  backgroundColor: 'white',
                  color: 'var(--gray-20)',
                }}
              >
                <ChevronUpIcon />
              </SelectPrimitive.ScrollUpButton>
              
              <SelectPrimitive.Viewport>
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    style={{
                      padding: '8px 12px',
                      fontSize: '14px',
                      color: 'black',
                      cursor: 'pointer',
                      outline: 'none',
                      userSelect: 'none',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>

              <SelectPrimitive.ScrollDownButton
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  backgroundColor: 'white',
                  color: 'var(--gray-20)',
                }}
              >
                <ChevronDownIcon />
              </SelectPrimitive.ScrollDownButton>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      </Theme>
    );
  }
);

Select.displayName = 'Select';

export { Select };