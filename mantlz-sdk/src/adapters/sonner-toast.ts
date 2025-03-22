import { ToastHandler, ToastOptions, ToastType } from '../utils/toast';

// Interface for Sonner toast functions
interface SonnerToast {
  success: (message: string, options?: any) => void;
  error: (message: string, options?: any) => void;
  info: (message: string, options?: any) => void;
  warning: (message: string, options?: any) => void;
}

export function createSonnerToastAdapter(sonnerToast: SonnerToast): ToastHandler {
  return {
    show: (message: string, type: ToastType, options?: ToastOptions) => {
      const sonnerOptions = options ? {
        duration: options.duration,
        description: options.description,
        position: options.position,
      } : {};
      
      switch (type) {
        case 'success':
          sonnerToast.success(message, sonnerOptions);
          break;
        case 'error':
          sonnerToast.error(message, sonnerOptions);
          break;
        case 'info':
          sonnerToast.info(message, sonnerOptions);
          break;
        case 'warning':
          sonnerToast.warning(message, sonnerOptions);
          break;
      }
    }
  };
}