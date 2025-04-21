'use client';

export { MantlzProvider, useMantlz } from './context/mantlzContext';
export { WaitlistForm } from './components/waitlist/WaitlistForm';
export { FeedbackForm } from './components/feedback/FeedbackForm';
export { ContactForm } from './components/contact/ContactForm';
export { default as DynamicForm } from './components/shared/DynamicForm';
export { createMantlzClient } from './client';

// Base themes and styling
export { BASE_THEMES } from './components/shared/baseThemes';
export type { SimpleAppearance } from './components/shared/types';

// Toast system exports
export { toast } from './utils/toast';
export { createSonnerToastAdapter } from './adapters/sonner-toast';

// Export types
export type { MantlzClient, MantlzClientConfig, MantlzError, FormSubmitOptions, FormSubmitResponse } from './types';
export type { WaitlistFormProps } from './components/waitlist/WaitlistForm';
export type { ContactFormProps } from './components/contact/ContactForm';
export type { FeedbackFormProps } from './components/feedback/FeedbackForm';
export type { DynamicFormProps, FormSchema } from './components/shared/DynamicForm';
export type { ToastHandler, ToastOptions, ToastType } from './utils/toast';
export type { BaseTheme } from './components/shared/types';