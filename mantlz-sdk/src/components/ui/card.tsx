import * as React from "react";
import { cn } from "../../utils/cn";
import { cardVariants } from "../../styles/theme";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "error" | "success";
  colorMode?: "light" | "dark";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", colorMode = "light", ...props }, ref) => {
    const themeVariant = cardVariants[variant][colorMode].container;
    
    return (
      <div
        ref={ref}
        className={cn(themeVariant, className)}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "glass" | "error" | "success", colorMode?: "light" | "dark" }
>(({ className, variant = "default", colorMode = "light", ...props }, ref) => {
  const themeVariant = cardVariants[variant][colorMode].header;
  
  return (
    <div
      ref={ref}
      className={cn(themeVariant, className)}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { variant?: "default" | "glass" | "error" | "success", colorMode?: "light" | "dark" }
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
  React.HTMLAttributes<HTMLParagraphElement> & { variant?: "default" | "glass" | "error" | "success", colorMode?: "light" | "dark" }
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
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "glass" | "error" | "success", colorMode?: "light" | "dark" }
>(({ className, variant = "default", colorMode = "light", ...props }, ref) => {
  const themeVariant = cardVariants[variant][colorMode].content;
  
  return (
    <div ref={ref} className={cn(themeVariant, className)} {...props} />
  );
});
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "glass" | "error" | "success", colorMode?: "light" | "dark" }
>(({ className, variant = "default", colorMode = "light", ...props }, ref) => {
  const themeVariant = cardVariants[variant][colorMode].footer;
  
  return (
    <div
      ref={ref}
      className={cn(themeVariant, className)}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}; 