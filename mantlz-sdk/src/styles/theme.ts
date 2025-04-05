/**
 * Basic theme configuration for UI components
 */

export const theme = {
  colors: {
    primary: '#3B82F6', // blue-500
    secondary: '#6366F1', // indigo-500
    success: '#10B981', // emerald-500
    danger: '#EF4444', // red-500
    warning: '#F59E0B', // amber-500
    
    // Light mode
    light: {
      background: '#FFFFFF',
      foreground: '#1F2937', // gray-800
      muted: '#6B7280', // gray-500
      border: '#E5E7EB', // gray-200
    },
    
    // Dark mode
    dark: {
      background: '#1F2937', // gray-800
      foreground: '#F9FAFB', // gray-50
      muted: '#9CA3AF', // gray-400 
      border: '#374151', // gray-700
    }
  },
  
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};

// Input variants for styling inputs
export const inputVariants = ({ 
  variant = 'default',
  colorMode = 'light'
}: { 
  variant?: 'default' | 'error',
  colorMode?: 'light' | 'dark'
} = {}) => {
  // Base classes for all inputs
  const baseClasses = 'block w-full px-4 py-3 rounded-md text-sm focus:outline-none transition-all duration-200';
  
  // Variant classes based on color mode
  const variantClasses = {
    default: colorMode === 'dark'
      ? 'bg-gray-800 border border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/70 shadow-sm'
      : 'bg-white border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 shadow-sm',
      
    error: colorMode === 'dark'
      ? 'bg-gray-800 border-2 border-red-500/70 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/70 shadow-sm'
      : 'bg-white border-2 border-red-500/70 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 shadow-sm',
  };
  
  return `${baseClasses} ${variantClasses[variant]}`;
};

// Textarea variants for styling textareas
export const textareaVariants = ({ 
  variant = 'default',
  colorMode = 'light'
}: { 
  variant?: 'default' | 'error',
  colorMode?: 'light' | 'dark'
} = {}) => {
  // Base classes for all textareas
  const baseClasses = 'block w-full px-4 py-3 rounded-md text-sm focus:outline-none min-h-[120px] resize-y transition-all duration-200';
  
  // Variant classes based on color mode
  const variantClasses = {
    default: colorMode === 'dark'
      ? 'bg-gray-800 border border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/70 shadow-sm'
      : 'bg-white border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 shadow-sm',
      
    error: colorMode === 'dark'
      ? 'bg-gray-800 border-2 border-red-500/70 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/70 shadow-sm'
      : 'bg-white border-2 border-red-500/70 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 shadow-sm',
  };
  
  return `${baseClasses} ${variantClasses[variant]}`;
};

// Card variants for styling cards
export const cardVariants = {
  default: {
    light: {
      container: 'bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden',
      header: 'p-6 border-b border-gray-50',
      title: 'text-xl font-semibold text-gray-800 tracking-tight',
      description: 'text-sm text-gray-500 mt-2',
      content: 'p-6',
      footer: 'p-6 border-t border-gray-50'
    },
    dark: {
      container: 'bg-gray-900 border border-gray-800 rounded-xl shadow-md overflow-hidden',
      header: 'p-6 border-b border-gray-800',
      title: 'text-xl font-semibold text-white tracking-tight',
      description: 'text-sm text-gray-400 mt-2',
      content: 'p-6',
      footer: 'p-6 border-t border-gray-800'
    }
  },
  glass: {
    light: {
      container: 'bg-white/90 backdrop-blur-lg border border-gray-200/30 rounded-xl shadow-md overflow-hidden',
      header: 'p-6 border-b border-gray-100/30',
      title: 'text-xl font-semibold text-gray-800 tracking-tight',
      description: 'text-sm text-gray-500 mt-2',
      content: 'p-6',
      footer: 'p-6 border-t border-gray-100/30'
    },
    dark: {
      container: 'bg-gray-900/90 backdrop-blur-lg border border-gray-800/30 rounded-xl shadow-md overflow-hidden',
      header: 'p-6 border-b border-gray-800/30',
      title: 'text-xl font-semibold text-white tracking-tight',
      description: 'text-sm text-gray-400 mt-2',
      content: 'p-6',
      footer: 'p-6 border-t border-gray-800/30'
    }
  },
  error: {
    light: {
      container: 'bg-red-50 border border-red-100 rounded-xl shadow-sm overflow-hidden',
      header: 'p-6 border-b border-red-100/50',
      title: 'text-xl font-semibold text-red-900 tracking-tight',
      description: 'text-sm text-red-500 mt-2',
      content: 'p-6',
      footer: 'p-6 border-t border-red-100/50'
    },
    dark: {
      container: 'bg-red-950/30 border border-red-900/50 rounded-xl shadow-md overflow-hidden',
      header: 'p-6 border-b border-red-900/30',
      title: 'text-xl font-semibold text-red-200 tracking-tight',
      description: 'text-sm text-red-300 mt-2',
      content: 'p-6',
      footer: 'p-6 border-t border-red-900/30'
    }
  },
  success: {
    light: {
      container: 'bg-green-50 border border-green-100 rounded-xl shadow-sm overflow-hidden',
      header: 'p-6 border-b border-green-100/50',
      title: 'text-xl font-semibold text-green-900 tracking-tight',
      description: 'text-sm text-green-500 mt-2',
      content: 'p-6',
      footer: 'p-6 border-t border-green-100/50'
    },
    dark: {
      container: 'bg-green-950/30 border border-green-900/50 rounded-xl shadow-md overflow-hidden',
      header: 'p-6 border-b border-green-900/30',
      title: 'text-xl font-semibold text-green-200 tracking-tight',
      description: 'text-sm text-green-300 mt-2',
      content: 'p-6',
      footer: 'p-6 border-t border-green-900/30'
    }
  }
};

// Button variants for styling buttons
export const buttonVariants = ({ 
  variant = 'default', 
  size = 'default',
  colorMode = 'light'
}: { 
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link',
  size?: 'default' | 'sm' | 'lg' | 'icon',
  colorMode?: 'light' | 'dark'
} = {}) => {
  // Base classes that apply to all buttons
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  // Size classes
  const sizeClasses = {
    default: 'h-11 py-2 px-5 text-sm',
    sm: 'h-9 px-3 text-xs',
    lg: 'h-12 px-6 text-base',
    icon: 'h-10 w-10',
  };
  
  // Variant classes based on color mode
  const variantClasses = {
    default: colorMode === 'dark' 
      ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow focus-visible:ring-blue-500' 
      : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow focus-visible:ring-blue-500',
    
    secondary: colorMode === 'dark'
      ? 'bg-gray-700 text-white hover:bg-gray-800 active:bg-gray-900 shadow-sm hover:shadow focus-visible:ring-gray-600'
      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 shadow-sm hover:shadow focus-visible:ring-gray-300',
    
    outline: colorMode === 'dark'
      ? 'border border-gray-700 bg-transparent text-gray-200 hover:bg-gray-800/50 focus-visible:ring-gray-600 active:bg-gray-800'
      : 'border border-gray-200 bg-transparent text-gray-800 hover:bg-gray-50 focus-visible:ring-gray-400 active:bg-gray-100',
    
    ghost: colorMode === 'dark'
      ? 'bg-transparent text-gray-200 hover:bg-gray-800 hover:text-gray-100 focus-visible:ring-gray-600 active:bg-gray-900'
      : 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-400 active:bg-gray-200',
    
    link: colorMode === 'dark'
      ? 'bg-transparent text-blue-400 underline-offset-4 hover:underline focus-visible:ring-blue-600 hover:text-blue-300'
      : 'bg-transparent text-blue-600 underline-offset-4 hover:underline focus-visible:ring-blue-500 hover:text-blue-700',
  };
  
  return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
};

export default theme; 