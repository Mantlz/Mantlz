'use client';

// CSS is now automatically injected - no need for manual imports

export { MantlzProvider, useMantlz } from './context/mantlzContext';

export { default as Mantlz } from './components/form/mantlz';
export { createMantlzClient } from './client';

// Base themes and styling
export { BASE_THEMES } from './components/form/baseThemes';
export type { SimpleAppearance } from './components/form/types';

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
  FormFieldConfig,
  BaseFormTheme,
  FormType,
  FormAppearance,
} from './components/form/types';

export type { ToastHandler, ToastOptions, ToastType } from './utils/toast';
export type { BaseTheme } from './components/form/types';

// Export Config
export { SDK_CONFIG } from './config';

// Constants
export { FORM_THEMES } from './components/form/types';

// Utils
export { processAppearance } from './components/form/themeUtils';