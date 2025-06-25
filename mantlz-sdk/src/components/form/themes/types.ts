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
    containerDark?: CSSProperties; // Dark mode variant
    title: CSSProperties;
    titleDark?: CSSProperties; // Dark mode variant
    description: CSSProperties;
    descriptionDark?: CSSProperties; // Dark mode variant
    background?: CSSProperties; // Optional additional background styling
  };
  field: {
    container: CSSProperties;
    label: CSSProperties;
    labelDark?: CSSProperties; // Dark mode variant
    input: ExtendedCSSProperties;
    inputDark?: ExtendedCSSProperties; // Dark mode variant
    error: CSSProperties;
  };
  button: ExtendedCSSProperties;
}