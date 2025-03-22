import { cva } from "class-variance-authority"

export const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border/50 bg-white dark:bg-zinc-950",
        glass: "border-border/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export const inputVariants = cva(
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600",
        error: "border-red-500 dark:border-red-500/50 focus:border-red-500 dark:focus:border-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90",
        secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export const selectVariants = cva(
  "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600",
        error: "border-red-500 dark:border-red-500/50 focus:border-red-500 dark:focus:border-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600",
        error: "border-red-500 dark:border-red-500/50 focus:border-red-500 dark:focus:border-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
) 