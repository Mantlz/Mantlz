import React from 'react';
import { Theme } from '@radix-ui/themes';

interface CardProps {
  variant?: 'default' | 'error' | 'success';
  colorMode?: 'light' | 'dark';
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const getVariantStyles = (variant: CardProps['variant'] = 'default') => {
  switch (variant) {
    case 'error':
      return {
        border: '1px solid var(--red-6)',
        backgroundColor: 'var(--red-2)',
        titleColor: 'var(--red-11)',
        descriptionColor: 'var(--red-11)',
      };
    case 'success':
      return {
        border: '1px solid var(--green-6)',
        backgroundColor: 'var(--green-2)',
        titleColor: 'var(--green-11)',
        descriptionColor: 'var(--green-11)',
      };
    default:
      return {
        border: '1px solid var(--gray-6)',
        backgroundColor: 'var(--gray-2)',
        titleColor: 'black',
        descriptionColor: 'var(--gray-20)',
      };
  }
};

export function Card({
  variant = 'default',
  title,
  description,
  footer,
  children,
  ...props
}: CardProps) {
  const styles = getVariantStyles(variant);

  return (
    <Theme>
      <div
        {...props}
        style={{
          borderRadius: '8px',
          overflow: 'hidden',
          ...styles,
          ...props.style,
        }}
      >
        {(title || description) && (
          <div style={{ padding: '16px' }}>
            {title && (
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 600,
                color: styles.titleColor,
                marginBottom: description ? '8px' : 0,
              }}>
                {title}
              </h3>
            )}
            {description && (
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: styles.descriptionColor,
              }}>
                {description}
              </p>
            )}
          </div>
        )}
        {children && (
          <div style={{ padding: '16px' }}>
            {children}
          </div>
        )}
        {footer && (
          <div style={{
            padding: '16px',
            borderTop: `1px solid ${variant === 'default' ? 'var(--gray-6)' : 'transparent'}`,
          }}>
            {footer}
          </div>
        )}
      </div>
    </Theme>
  );
}

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => (
    <div
      ref={ref}
      style={{
        padding: '16px',
      }}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement> & { 
  variant?: CardProps['variant'];
}>(
  ({ variant = 'default', ...props }, ref) => {
    const styles = getVariantStyles(variant);
    return (
      <h3
        ref={ref}
        style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 600,
          color: styles.titleColor,
          ...props.style,
        }}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement> & { 
  variant?: CardProps['variant'];
}>(
  ({ variant = 'default', ...props }, ref) => {
    const styles = getVariantStyles(variant);
    return (
      <p
        ref={ref}
        style={{
          margin: 0,
          fontSize: '14px',
          color: styles.descriptionColor,
          ...props.style,
        }}
        {...props}
      />
    );
  }
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => (
    <div
      ref={ref}
      style={{
        padding: '16px',
      }}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  variant?: CardProps['variant'];
}>(
  ({ variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      style={{
        padding: '16px',
        borderTop: `1px solid ${variant === 'default' ? 'var(--gray-6)' : 'transparent'}`,
      }}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export {
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
}; 