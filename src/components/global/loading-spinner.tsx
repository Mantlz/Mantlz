import { cva, VariantProps } from "class-variance-authority"

const spinnerVariants = cva(
  "border-2 rounded-full animate-spin",
  {
    variants: {
      size: {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
}

export const LoadingSpinner = ({ size, className }: LoadingSpinnerProps) => {
  return (
    <div className="flex justify-center items-center">
      <div className={spinnerVariants({ size, className: `border-t-current border-current/20 ${className || ''}` })} />
    </div>
  )
}