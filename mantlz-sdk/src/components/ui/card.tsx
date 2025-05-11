import * as React from "react";
import { cn } from "../../utils/cn";
import { cardVariants } from "../../styles/theme";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "error" | "success";
  colorMode?: "light" | "dark";
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

export function Card({
  variant = 'default',
  colorMode = 'light',
  title,
  description,
  footer,
  children,
  className,
  ...props
}: CardProps) {
  const styles = cardVariants[variant][colorMode];

  return (
    <div
      className={cn(styles.container, className)}
      {...props}
    >
      {(title || description) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 sm:p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { 
    variant?: "default" | "error" | "success"; 
    colorMode?: "light" | "dark" 
  }
>(({ className, variant = "default", colorMode = "light", ...props }, ref) => {
  const themeVariant = cardVariants[variant][colorMode].title;
  
  return (
    <h3
      ref={ref}
      className={cn(themeVariant, className)}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { 
    variant?: "default" | "error" | "success"; 
    colorMode?: "light" | "dark" 
  }
>(({ className, variant = "default", colorMode = "light", ...props }, ref) => {
  const themeVariant = cardVariants[variant][colorMode].description;
  
  return (
    <p
      ref={ref}
      className={cn(themeVariant, className)}
      {...props}
    />
  );
});
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 sm:p-6 pt-0", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 sm:p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
}; 