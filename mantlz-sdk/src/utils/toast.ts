'use client';

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

// Fallback DOM toast implementation for when no handler is set
const createDOMToast = (message: string, type: ToastType, options?: ToastOptions) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.log(`[${type.toUpperCase()}] ${message}${options?.description ? `: ${options.description}` : ''}`);
    return;
  }
  
  // Set default position to bottom-right if not specified
  const position = options?.position || 'bottom-right';
  
  // Create toast container if it doesn't exist
  const containerId = `mantlz-toast-container-${position}`;
  let toastContainer = document.getElementById(containerId);
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = containerId;
    toastContainer.style.position = 'fixed';
    toastContainer.style.zIndex = '9999';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '8px';
    
    // Position the container based on the requested position
    if (position.includes('top')) {
      toastContainer.style.top = '16px';
    } else {
      toastContainer.style.bottom = '16px';
    }
    
    if (position.includes('right')) {
      toastContainer.style.right = '16px';
    } else if (position.includes('left')) {
      toastContainer.style.left = '16px';
    } else {
      // Center horizontally if just 'top' or 'bottom'
      toastContainer.style.left = '50%';
      toastContainer.style.transform = 'translateX(-50%)';
    }
    
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.style.padding = '14px 18px';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)';
  toast.style.marginBottom = '10px';
  toast.style.width = '320px';
  toast.style.transition = 'all 0.3s ease';
  toast.style.opacity = '0';
  
  // Add animation keyframes
  const animationInName = `toastIn${Date.now()}`;
  const animationOutName = `toastOut${Date.now()}`;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ${animationInName} {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes ${animationOutName} {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(20px); }
    }
  `;
  document.head.appendChild(style);
  
  // Set toast content and styles based on type
  switch (type) {
    case 'success':
      toast.style.backgroundColor = '#10B981';
      toast.style.color = 'white';
      break;
    case 'error':
      toast.style.backgroundColor = '#EF4444';
      toast.style.color = 'white';
      break;
    case 'info':
      toast.style.backgroundColor = '#3B82F6';
      toast.style.color = 'white';
      break;
    case 'warning':
      toast.style.backgroundColor = '#F59E0B';
      toast.style.color = 'white';
      break;
  }
  
  // Add message
  const messageElement = document.createElement('div');
  messageElement.style.fontWeight = '600';
  messageElement.textContent = message;
  toast.appendChild(messageElement);
  
  // Add description if provided
  if (options?.description) {
    const descriptionElement = document.createElement('div');
    descriptionElement.style.fontSize = '14px';
    descriptionElement.style.marginTop = '4px';
    descriptionElement.style.opacity = '0.9';
    descriptionElement.textContent = options.description;
    toast.appendChild(descriptionElement);
  }
  
  // Add toast to container
  toastContainer.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.animation = `${animationInName} 0.3s forwards`;
  }, 10);
  
  // Set duration (default 3 seconds)
  const duration = options?.duration || 3000;
  
  // Remove toast after duration
  setTimeout(() => {
    toast.style.animation = `${animationOutName} 0.3s forwards`;
    setTimeout(() => {
      if (toast.parentNode === toastContainer) {
        toastContainer.removeChild(toast);
      }
      
      // Remove container if empty
      if (toastContainer.children.length === 0) {
        document.body.removeChild(toastContainer);
      }
      
      // Remove animation keyframes
      document.head.removeChild(style);
    }, 300);
  }, duration);
};

// Default implementation that uses DOM fallback
export const defaultToastHandler: ToastHandler = {
  show: (message, type, options) => {
    createDOMToast(message, type, options);
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