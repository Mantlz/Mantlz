import * as React from "react"
import { cn } from "../../utils/cn"
import { textareaVariants } from "../../styles/theme"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "error";
  error?: string;
  colorMode?: "light" | "dark";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "default", error, colorMode = "light", ...props }, ref) => {
    return (
      <div className="space-y-1">
        <textarea
          className={cn(
            textareaVariants({ variant, colorMode }),
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className={cn(
            "text-sm", 
            colorMode === 'light' ? "text-red-500" : "text-red-400"
          )}>
            {error}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea } 