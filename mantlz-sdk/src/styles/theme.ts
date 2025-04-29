import { cn } from "../utils/cn";

// Input variants for styling inputs
export const inputVariants = ({ 
  variant = 'default',
  colorMode = 'light'
}: { 
  variant?: 'default' | 'error',
  colorMode?: 'light' | 'dark'
} = {}) => {
  const baseClasses = 'block w-full rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2';
  
  const variantClasses = {
    default: colorMode === 'dark'
      ? 'bg-zinc-800 border border-zinc-700 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/70'
      : 'bg-white border border-zinc-200 text-gray-800 placeholder:text-gray-400 focus:ring-blue-500/30 focus:border-blue-500/50',
    error: colorMode === 'dark'
      ? 'bg-zinc-800 border-2 border-red-500/70 text-white placeholder:text-gray-400 focus:ring-red-500/50 focus:border-red-500/70'
      : 'bg-white border-2 border-red-500/70 text-gray-800 placeholder:text-gray-400 focus:ring-red-500/30 focus:border-red-500/50'
  };

  return cn(
    baseClasses,
    'px-3 py-2 sm:px-4 sm:py-2.5',
    variantClasses[variant]
  );
};

// Textarea variants for styling textareas
export const textareaVariants = ({ 
  variant = 'default',
  colorMode = 'light'
}: { 
  variant?: 'default' | 'error',
  colorMode?: 'light' | 'dark'
} = {}) => {
  const baseClasses = 'block w-full rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 min-h-[80px] sm:min-h-[100px] resize-y';
  
  const variantClasses = {
    default: colorMode === 'dark'
      ? 'bg-zinc-800 border border-zinc-700 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/70'
      : 'bg-white border border-zinc-200 text-gray-800 placeholder:text-gray-400 focus:ring-blue-500/30 focus:border-blue-500/50',
    error: colorMode === 'dark'
      ? 'bg-zinc-800 border-2 border-red-500/70 text-white placeholder:text-gray-400 focus:ring-red-500/50 focus:border-red-500/70'
      : 'bg-white border-2 border-red-500/70 text-gray-800 placeholder:text-gray-400 focus:ring-red-500/30 focus:border-red-500/50'
  };

  return cn(
    baseClasses,
    'px-3 py-2 sm:px-4 sm:py-2.5',
    variantClasses[variant]
  );
};

// Card variants for styling cards
export const cardVariants = {
  default: {
    light: {
      container: 'bg-white border border-zinc-100 rounded-xl shadow-sm overflow-hidden',
      header: 'p-4 sm:p-6',
      title: 'text-lg sm:text-xl font-semibold text-gray-800 tracking-tight',
      description: 'text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2',
      content: 'p-4 sm:p-6',
      footer: 'p-4 sm:p-6'
    },
    dark: {
      container: 'bg-zinc-900 border border-zinc-800 rounded-xl shadow-md overflow-hidden',
      header: 'p-4 sm:p-6',
      title: 'text-lg sm:text-xl font-semibold text-white tracking-tight',
      description: 'text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2',
      content: 'p-4 sm:p-6',
      footer: 'p-4 sm:p-6'
    }
  },
  error: {
    light: {
      container: 'bg-red-50 border border-red-100 rounded-xl shadow-sm overflow-hidden',
      header: 'p-4 sm:p-6',
      title: 'text-lg sm:text-xl font-semibold text-red-900 tracking-tight',
      description: 'text-xs sm:text-sm text-red-500 mt-1 sm:mt-2',
      content: 'p-4 sm:p-6',
      footer: 'p-4 sm:p-6'
    },
    dark: {
      container: 'bg-red-950/30 border border-red-900/50 rounded-xl shadow-md overflow-hidden',
      header: 'p-4 sm:p-6',
      title: 'text-lg sm:text-xl font-semibold text-red-200 tracking-tight',
      description: 'text-xs sm:text-sm text-red-300 mt-1 sm:mt-2',
      content: 'p-4 sm:p-6',
      footer: 'p-4 sm:p-6'
    }
  },
  success: {
    light: {
      container: 'bg-green-50 border border-green-100 rounded-xl shadow-sm overflow-hidden',
      header: 'p-4 sm:p-6',
      title: 'text-lg sm:text-xl font-semibold text-green-900 tracking-tight',
      description: 'text-xs sm:text-sm text-green-500 mt-1 sm:mt-2',
      content: 'p-4 sm:p-6',
      footer: 'p-4 sm:p-6'
    },
    dark: {
      container: 'bg-green-950/30 border border-green-900/50 rounded-xl shadow-md overflow-hidden',
      header: 'p-4 sm:p-6',
      title: 'text-lg sm:text-xl font-semibold text-green-200 tracking-tight',
      description: 'text-xs sm:text-sm text-green-300 mt-1 sm:mt-2',
      content: 'p-4 sm:p-6',
      footer: 'p-4 sm:p-6'
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
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const sizeClasses = {
    default: 'h-11 py-2 px-5 text-sm',
    sm: 'h-9 px-3 text-xs',
    lg: 'h-12 px-6 text-base',
    icon: 'h-10 w-10',
  };
  
  const variantClasses = {
    default: colorMode === 'dark' 
      ? 'bg-zinc-600 text-white hover:bg-zinc-700 active:bg-zinc-800 shadow-sm hover:shadow focus-visible:ring-blue-500' 
      : 'bg-zinc-600 text-white hover:bg-zinc-700 active:bg-zinc-800 shadow-sm hover:shadow focus-visible:ring-blue-500',
    
    secondary: colorMode === 'dark'
      ? 'bg-zinc-700 text-white hover:bg-zinc-800 active:bg-zinc-900 shadow-sm hover:shadow focus-visible:ring-gray-600'
      : 'bg-zinc-100 text-gray-800 hover:bg-zinc-200 active:bg-zinc-300 shadow-sm hover:shadow focus-visible:ring-gray-300',
    
    outline: colorMode === 'dark'
      ? 'border border-zinc-700 bg-transparent text-gray-200 hover:bg-zinc-800/50 focus-visible:ring-gray-600 active:bg-zinc-800'
      : 'border border-zinc-200 bg-transparent text-gray-800 hover:bg-zinc-50 focus-visible:ring-gray-400 active:bg-zinc-100',
    
    ghost: colorMode === 'dark'
      ? 'bg-transparent text-gray-200 hover:bg-zinc-800 hover:text-gray-100 focus-visible:ring-gray-600 active:bg-zinc-900'
      : 'bg-transparent text-gray-700 hover:bg-zinc-100 hover:text-gray-900 focus-visible:ring-gray-400 active:bg-zinc-200',
    
    link: colorMode === 'dark'
      ? 'bg-transparent text-blue-400 underline-offset-4 hover:underline focus-visible:ring-blue-600 hover:text-blue-300'
      : 'bg-transparent text-blue-600 underline-offset-4 hover:underline focus-visible:ring-blue-500 hover:text-blue-700',
  };
  
  return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
};

export const selectVariants = ({ 
  variant = 'default',
  colorMode = 'light'
}: { 
  variant?: 'default' | 'error',
  colorMode?: 'light' | 'dark'
} = {}) => {
  const baseClasses = 'block w-full rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 appearance-none';
  
  const variantClasses = {
    default: colorMode === 'dark'
      ? 'bg-zinc-800 border border-zinc-700 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/70'
      : 'bg-white border border-zinc-200 text-gray-800 placeholder:text-gray-400 focus:ring-blue-500/30 focus:border-blue-500/50',
    error: colorMode === 'dark'
      ? 'bg-zinc-800 border-2 border-red-500/70 text-white placeholder:text-gray-400 focus:ring-red-500/50 focus:border-red-500/70'
      : 'bg-white border-2 border-red-500/70 text-gray-800 placeholder:text-gray-400 focus:ring-red-500/30 focus:border-red-500/50'
  };

  return cn(
    baseClasses,
    'px-3 py-2 sm:px-4 sm:py-2.5 pr-8 sm:pr-10',
    variantClasses[variant]
  );
}; 