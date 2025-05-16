import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = (props: CheckboxProps) => (
  <input 
    type="checkbox" 
    className="mantlz-checkbox"
    {...props} 
  />
); 