import React from 'react';
import { cn } from '../../../utils/cn';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  colorMode?: 'light' | 'dark';
}

export const Checkbox = ({ 
  colorMode, 
  ...props 
}: CheckboxProps) => (
  <input 
    type="checkbox" 
    className={cn(
      "h-4 w-4 rounded border-zinc-300", 
      colorMode === 'dark' ? "bg-zinc-700 border-zinc-600" : "bg-white",
    )}
    {...props} 
  />
); 