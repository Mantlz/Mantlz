export interface Theme {
  form: {
    container: React.CSSProperties;
    title: React.CSSProperties;
    description: React.CSSProperties;
  };
  field: {
    container: React.CSSProperties;
    label: React.CSSProperties;
    input: React.CSSProperties & {
      '&:focus'?: React.CSSProperties;
      '&:hover'?: React.CSSProperties;
    };
    error: React.CSSProperties;
  };
  button: React.CSSProperties & {
    '&:hover'?: React.CSSProperties;
    '&:disabled'?: React.CSSProperties;
  };
} 