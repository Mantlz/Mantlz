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
  toast.style.fontFamily = '"SF Mono", "Roboto Mono", Menlo, Monaco, Consolas, monospace';
  toast.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  toast.style.backdropFilter = 'blur(6px)';
  
  // Set transform based on position
  if (position.includes('top')) {
    toast.style.transform = 'translateY(-10px)';
  } else {
    toast.style.transform = 'translateY(10px)';
  }
  
  toast.style.animation = 'fadeIn 0.3s forwards';
  
  // Add animation with position-specific transforms
  const animationName = position.includes('top') ? 'fadeInDown' : 'fadeInUp';
  const animationOutName = position.includes('top') ? 'fadeOutUp' : 'fadeOutDown';
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInDown {
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOutUp {
      to { opacity: 0; transform: translateY(-10px); }
    }
    @keyframes fadeInUp {
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOutDown {
      to { opacity: 0; transform: translateY(10px); }
    }
  `;
  document.head.appendChild(style);
  
  toast.style.animation = `${animationName} 0.3s forwards`;
  
  // Create icon container
  const iconContainer = document.createElement('div');
  iconContainer.style.display = 'flex';
  iconContainer.style.alignItems = 'center';
  iconContainer.style.marginBottom = '8px';
  
  // Create icon element
  const icon = document.createElement('div');
  icon.style.width = '16px';
  icon.style.height = '16px';
  icon.style.borderRadius = '50%';
  icon.style.marginRight = '10px';
  icon.style.display = 'flex';
  icon.style.alignItems = 'center';
  icon.style.justifyContent = 'center';
  icon.style.flexShrink = '0';
  
  // Set colors and icons based on type
  let iconContent = '';
  switch (type) {
    case 'success':
      toast.style.background = 'linear-gradient(to right, #1f8a70, #10B981)';
      toast.style.color = 'white';
      icon.style.background = 'rgba(255, 255, 255, 0.2)';
      iconContent = '✓';
      break;
    case 'error':
      toast.style.background = 'linear-gradient(to right, #d03050, #EF4444)';
      toast.style.color = 'white';
      icon.style.background = 'rgba(255, 255, 255, 0.2)';
      iconContent = '✕';
      break;
    case 'warning':
      toast.style.background = 'linear-gradient(to right, #d97706, #F59E0B)';
      toast.style.color = 'white';
      icon.style.background = 'rgba(255, 255, 255, 0.2)';
      iconContent = '!';
      break;
    case 'info':
      toast.style.background = 'linear-gradient(to right, #2563eb, #3B82F6)';
      toast.style.color = 'white';
      icon.style.background = 'rgba(255, 255, 255, 0.2)';
      iconContent = 'i';
      break;
  }
  
  icon.textContent = iconContent;
  icon.style.fontSize = '10px';
  icon.style.fontWeight = 'bold';
  
  // Create title
  const title = document.createElement('div');
  title.style.fontWeight = 'bold';
  title.style.fontSize = '14px';
  title.style.letterSpacing = '0.5px';
  title.textContent = message;
  
  // Add icon and title to the container
  iconContainer.appendChild(icon);
  iconContainer.appendChild(title);
  toast.appendChild(iconContainer);
  
  // Add description if provided
  if (options?.description) {
    const description = document.createElement('div');
    description.style.fontSize = '12px';
    description.style.opacity = '0.9';
    description.style.marginLeft = '26px'; // Align with title after icon
    description.style.lineHeight = '1.4';
    description.textContent = options.description;
    toast.appendChild(description);
  }
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Remove after duration
  const duration = options?.duration || 5000;
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