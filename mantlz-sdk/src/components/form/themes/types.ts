import { CSSProperties } from 'react';

type ExtendedCSSProperties = CSSProperties & {
  '&:hover'?: CSSProperties;
  '&:disabled'?: CSSProperties;
  '&:active'?: CSSProperties;
  '&:focus'?: CSSProperties;
  '&::placeholder'?: CSSProperties;
  '&.order'?: ExtendedCSSProperties;
};

export interface Theme {
  form: {
    container: CSSProperties;
    title: CSSProperties;
    description: CSSProperties;
  };
  field: {
    container: CSSProperties;
    label: CSSProperties;
    input: ExtendedCSSProperties;
    error: CSSProperties;
  };
  button: ExtendedCSSProperties;
} 