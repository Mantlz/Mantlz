import React from 'react';
import { Theme } from '@radix-ui/themes';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    return (
      <Theme>
        <textarea
          ref={ref}
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--gray-6)',
            backgroundColor: 'var(--gray-1)',
            color: 'black',
            fontSize: '14px',
            lineHeight: '1.5',
            transition: 'all 150ms ease',
            outline: 'none',
            resize: 'vertical',
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

Textarea.displayName = 'Textarea';

export { Textarea }; 