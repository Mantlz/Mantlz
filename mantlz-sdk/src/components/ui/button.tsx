import React from 'react';
import { Theme } from '@radix-ui/themes';
import { ReloadIcon } from '@radix-ui/react-icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, disabled, ...props }, ref) => {
    return (

      <Theme>

        <button
          ref={ref}
          disabled={disabled || loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            backgroundColor: disabled || loading ? 'var(--gray-8)' : 'var(--blue-9)',
            color: 'white',
            fontSize: '14px',
            fontWeight: 500,
            border: 'none',
            cursor: disabled || loading ? 'not-allowed' : 'pointer',
            transition: 'all 150ms ease',
          }}
          {...props}
        >
          {loading && (
            <ReloadIcon
              style={{
                animation: 'spin 1s linear infinite',
                transform: 'rotate(0deg)',
              }}
            />
          )}
          {children}
        </button>
        {loading && (
          <style>
            {`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}
          </style>
        )}
      </Theme>
    );
  }
);

Button.displayName = 'Button';

export { Button }; 