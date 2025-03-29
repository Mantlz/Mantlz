import * as React from 'react';
import { cn } from '../../utils/cn';
import { inputVariants } from '../../styles/theme';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error';
  error?: string;
  colorMode?: 'light' | 'dark';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', error, type, colorMode = 'light', ...props }, ref) => {
    return (
      <div className="space-y-1">
        <input
          type={type}
          className={cn(
            inputVariants({ variant, colorMode }),
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className={cn(
            "text-sm", 
            colorMode === 'light' ? "text-red-500" : "text-red-400"
          )}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input }; 