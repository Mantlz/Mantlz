// Toast handler abstraction that can be used with different toast libraries

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  duration?: number;
  description?: string;
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface ToastHandler {
  show: (message: string, type: ToastType, options?: ToastOptions) => void;
}

// Default implementation that just logs to console
export const defaultToastHandler: ToastHandler = {
  show: (message, type, options) => {
    console.log(`[${type.toUpperCase()}] ${message}${options?.description ? `: ${options.description}` : ''}`);
  }
};

// In-memory singleton instance
let toastInstance: ToastHandler = defaultToastHandler;

export const toast = {
  setHandler: (handler: ToastHandler) => {
    toastInstance = handler;
  },
  
  success: (message: string, options?: ToastOptions) => {
    toastInstance.show(message, 'success', options);
  },
  
  error: (message: string, options?: ToastOptions) => {
    toastInstance.show(message, 'error', options);
  },
  
  info: (message: string, options?: ToastOptions) => {
    toastInstance.show(message, 'info', options);
  },
  
  warning: (message: string, options?: ToastOptions) => {
    toastInstance.show(message, 'warning', options);
  }
};