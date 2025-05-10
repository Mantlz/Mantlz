'use client';

import { ToastHandler, ToastOptions } from '../utils/toast';

/**
 * Creates a toast adapter for the Sonner toast library
 * This allows the SDK to use Sonner toasts in React applications
 */
export function createSonnerToastAdapter(sonnerToast: any): ToastHandler {
  return {
    show: (message: string, type: string, options?: ToastOptions) => {
      const { description, duration } = options || {};
      
      if (typeof sonnerToast === 'object' && sonnerToast !== null) {
        switch (type) {
          case 'success':
            sonnerToast.success(message, {
              description,
              duration,
            });
            break;
          case 'error':
            sonnerToast.error(message, {
              description,
              duration,
            });
            break;
          case 'info':
            sonnerToast.info(message, {
              description,
              duration,
            });
            break;
          case 'warning':
            sonnerToast.warning(message, {
              description,
              duration,
            });
            break;
          default:
            sonnerToast.message(message, {
              description,
              duration,
            });
        }
      } else {
        // Fallback to console if sonnerToast is not available
        (`[Toast ${type}] ${message}${description ? `: ${description}` : ''}`);
      }
    }
  };
}