import { createTheme } from '../utils/theme';

export const lightTheme = createTheme({
  card: {
    // Base card styling
    default: {
      container: "relative rounded-xl border border-zinc-200 bg-white shadow-sm transition-all",
      header: "px-6 pt-5 pb-3",
      title: "text-base font-semibold leading-tight text-zinc-900",
      description: "mt-1 text-sm leading-normal text-zinc-500",
      content: "px-6 pb-5",
      footer: "px-6 pt-1 pb-5 mt-auto flex items-center"
    },
    // Glass effect variant
    glass: {
      container: "relative rounded-xl border border-zinc-200/50 bg-white/90 backdrop-blur-sm shadow-sm transition-all",
      header: "px-6 pt-5 pb-3",
      title: "text-base font-semibold leading-tight text-zinc-900",
      description: "mt-1 text-sm leading-normal text-zinc-500",
      content: "px-6 pb-5",
      footer: "px-6 pt-1 pb-5 mt-auto flex items-center"
    },
    // Error state
    error: {
      container: "relative rounded-xl border border-red-200 bg-red-50 shadow-sm transition-all",
      header: "px-6 pt-5 pb-3",
      title: "text-base font-semibold leading-tight text-red-700",
      description: "mt-1 text-sm leading-normal text-red-600",
      content: "px-6 pb-5",
      footer: "px-6 pt-1 pb-5 mt-auto flex items-center"
    },
    // Success state
    success: {
      container: "relative rounded-xl border border-green-200 bg-green-50 shadow-sm transition-all",
      header: "px-6 pt-5 pb-3",
      title: "text-base font-semibold leading-tight text-green-700",
      description: "mt-1 text-sm leading-normal text-green-600",
      content: "px-6 pb-5",
      footer: "px-6 pt-1 pb-5 mt-auto flex items-center"
    }
  }
});

export const darkTheme = createTheme({
  card: {
    // Base card styling for dark mode
    default: {
      container: "relative rounded-xl border border-zinc-800 bg-zinc-900 shadow-md transition-all",
      header: "px-6 pt-5 pb-3",
      title: "text-base font-semibold leading-tight text-white",
      description: "mt-1 text-sm leading-normal text-zinc-400",
      content: "px-6 pb-5",
      footer: "px-6 pt-1 pb-5 mt-auto flex items-center"
    },
    // Glass effect variant
    glass: {
      container: "relative rounded-xl border border-zinc-800/50 bg-zinc-900/80 backdrop-blur-sm shadow-md transition-all",
      header: "px-6 pt-5 pb-3",
      title: "text-base font-semibold leading-tight text-white",
      description: "mt-1 text-sm leading-normal text-zinc-400",
      content: "px-6 pb-5",
      footer: "px-6 pt-1 pb-5 mt-auto flex items-center"
    },
    // Error state
    error: {
      container: "relative rounded-xl border border-red-900 bg-red-950/50 shadow-md transition-all",
      header: "px-6 pt-5 pb-3",
      title: "text-base font-semibold leading-tight text-red-300",
      description: "mt-1 text-sm leading-normal text-red-400",
      content: "px-6 pb-5",
      footer: "px-6 pt-1 pb-5 mt-auto flex items-center"
    },
    // Success state
    success: {
      container: "relative rounded-xl border border-green-900 bg-green-950/50 shadow-md transition-all",
      header: "px-6 pt-5 pb-3",
      title: "text-base font-semibold leading-tight text-green-300",
      description: "mt-1 text-sm leading-normal text-green-400",
      content: "px-6 pb-5",
      footer: "px-6 pt-1 pb-5 mt-auto flex items-center"
    }
  }
});

// This would typically be in a different file
// Updated Card component to use these themes
export const cardVariants = {
  default: {
    light: lightTheme.card!.default,
    dark: darkTheme.card!.default
  },
  glass: {
    light: lightTheme.card!.glass,
    dark: darkTheme.card!.glass
  },
  error: {
    light: lightTheme.card!.error,
    dark: darkTheme.card!.error
  },
  success: {
    light: lightTheme.card!.success,
    dark: darkTheme.card!.success
  }
};

// Button variants with color mode support
export const buttonVariants = ({ 
  variant = "default", 
  size = "default",
  colorMode = "light"
}: { 
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  colorMode?: "light" | "dark";
} = {}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50";
  
  const variantStyles = {
    default: colorMode === "light" 
      ? "bg-zinc-900 text-white hover:bg-zinc-800" 
      : "bg-zinc-50 text-zinc-900 hover:bg-zinc-200",
    secondary: colorMode === "light"
      ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200" 
      : "bg-zinc-800 text-zinc-50 hover:bg-zinc-700",
    outline: colorMode === "light"
      ? "border border-zinc-200 bg-transparent hover:bg-zinc-100" 
      : "border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-100",
    ghost: colorMode === "light"
      ? "bg-transparent hover:bg-zinc-100 text-zinc-900" 
      : "bg-transparent hover:bg-zinc-800 text-zinc-50",
    link: colorMode === "light"
      ? "bg-transparent underline-offset-4 hover:underline text-zinc-900" 
      : "bg-transparent underline-offset-4 hover:underline text-zinc-50"
  };
  
  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10"
  };
  
  return [baseStyles, variantStyles[variant], sizeStyles[size]].join(" ");
};

// Textarea variants with color mode support
export const textareaVariants = ({ 
  variant = "default",
  colorMode = "light"
}: { 
  variant?: "default" | "error";
  colorMode?: "light" | "dark";
} = {}) => {
  const baseStyles = "flex min-h-20 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  
  const variantStyles = {
    default: colorMode === "light"
      ? "border-zinc-200 bg-white placeholder:text-zinc-500 focus-visible:ring-zinc-400" 
      : "border-zinc-800 bg-zinc-950 placeholder:text-zinc-400 text-zinc-100 focus-visible:ring-zinc-700",
    error: colorMode === "light"
      ? "border-red-300 bg-red-50 placeholder:text-red-400 text-red-900 focus-visible:ring-red-500" 
      : "border-red-800 bg-red-950/50 placeholder:text-red-300 text-red-400 focus-visible:ring-red-800"
  };
  
  return [baseStyles, variantStyles[variant]].join(" ");
};

// Input variants with color mode support
export const inputVariants = ({ 
  variant = "default",
  colorMode = "light"
}: { 
  variant?: "default" | "error";
  colorMode?: "light" | "dark";
} = {}) => {
  const baseStyles = "flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  
  const variantStyles = {
    default: colorMode === "light"
      ? "border-zinc-200 bg-white placeholder:text-zinc-500 focus-visible:ring-zinc-400" 
      : "border-zinc-800 bg-zinc-950 placeholder:text-zinc-400 text-zinc-100 focus-visible:ring-zinc-700",
    error: colorMode === "light"
      ? "border-red-300 bg-red-50 placeholder:text-red-400 text-red-900 focus-visible:ring-red-500" 
      : "border-red-800 bg-red-950/50 placeholder:text-red-300 text-red-400 focus-visible:ring-red-800"
  };
  
  return [baseStyles, variantStyles[variant]].join(" ");
};