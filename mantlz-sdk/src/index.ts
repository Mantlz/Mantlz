'use client';

// Import and inject CSS

// Import Radix UI Theme styles
import '@radix-ui/themes/styles.css';

// CSS is now automatically injected - no need for manual imports

export { MantlzProvider, useMantlz } from './context/mantlzContext';

export { default as Mantlz } from './components/form/mantlz';
export { createMantlzClient } from './client';

// UI Components
export { Input } from './components/ui/input';
export { Button } from './components/ui/button';
export { Select } from './components/ui/select';
export { Textarea } from './components/ui/textarea';
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from './components/ui/card';
export { ApiKeyErrorCard } from './components/ui/ApiKeyErrorCard';

// Toast system exports
export { toast } from './utils/toast';
export { createSonnerToastAdapter } from './adapters/sonner-toast';

// Export types
export type { 
  MantlzClient, 
  MantlzClientConfig, 
  MantlzError, 
  FormSubmitOptions, 
  FormSubmitResponse 
} from './types';

export type { 
  MantlzProps,
  FormSchema,
  FormField,
  FormType,
  BaseFormProps,
  WaitlistFormProps,
  ContactFormProps,
  FeedbackFormProps
} from './components/form/types';

export type { ToastHandler, ToastOptions, ToastType } from './utils/toast';

// Export Config
export { SDK_CONFIG } from './config';

// Constants
// export { FORM_THEMES } from './components/form/types';

export { ThemeProvider } from './components/form/context/ThemeContext';
export { themes } from './components/form/themes';
export type { Theme } from './components/form/themes/types';
export type { ThemeContextType } from './components/form/context/ThemeContext';



