import React from 'react';
import { Theme } from '@radix-ui/themes';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, ...props }, ref) => {
    return (
      <Theme>
        <input
          type={type}
          ref={ref}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--gray-6)',
            backgroundColor: 'var(--gray-1)',
            color: 'black',
            fontSize: '14px',
            lineHeight: '1.5',
            transition: 'all 150ms ease',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--blue-8)';
            e.currentTarget.style.boxShadow = '0 0 0 2px var(--blue-6)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--gray-6)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          {...props}
        />
      </Theme>
    );
  }
);

Input.displayName = 'Input';

export { Input }; 