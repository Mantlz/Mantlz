'use client';

// Import only essential styles instead of the entire Radix UI Theme
import '@radix-ui/themes/styles.css';

// Core functionality exports - always loaded
export { MantlzProvider, useMantlz } from './context/mantlzContext';
export { createMantlzClient } from './client';

// Main form component
export { default as Mantlz } from './components/form/mantlz';

// Core utilities
export { toast } from './utils/toast';
export { createSonnerToastAdapter } from './adapters/sonner-toast';
export { SDK_CONFIG } from './config';
// ThemeProvider removed - now handled at individual UI component level
export { themes } from './components/form/themes';

// Re-export types for better tree-shaking
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
  FeedbackFormProps,
  Appearance,
  AppearanceVariables,
  AppearanceElements
} from './components/form/types';

export type { ToastHandler, ToastOptions, ToastType } from './utils/toast';
export type { Theme } from './components/form/themes/types';
export type { ThemeContextType } from './components/form/context/ThemeContext';

// UI Components - these will be code-split by bundler when using tree-shaking
export { Input } from './components/ui/input';
export { Button } from './components/ui/button';
export { Select } from './components/ui/select';
export { Textarea } from './components/ui/textarea';
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from './components/ui/card';




