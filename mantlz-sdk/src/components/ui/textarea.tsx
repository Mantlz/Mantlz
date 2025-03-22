import * as React from "react"
import { cn } from "../../utils/cn"
import { textareaVariants } from "../../styles/theme"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "error";
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "default", error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <textarea
          className={cn(
            textareaVariants({ variant }),
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea } 