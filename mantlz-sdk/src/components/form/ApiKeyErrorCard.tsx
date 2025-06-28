import React from 'react';

interface ApiKeyErrorCardProps {
  theme?: string;
  appearance?: {
    baseTheme?: string;
    variables?: {
      colorText?: string;
      fontWeight?: string;
      colorPrimary?: string;
    };
  };
}

export function ApiKeyErrorCard({}: ApiKeyErrorCardProps) {
  return (

      <div
        style={{
          padding: '16px',
          maxWidth: '400px',
        width: 'fit-content',
          border: '2px solid var(--red-6)',
          borderRadius: '8px',
          backgroundColor: 'var(--red-2)',
          textAlign: 'center' as const
        }}
      >
        <p
          style={{
            color: 'var(--red-10)',
            fontSize: '14px',
            margin: '0',
            lineHeight: '1.4'
          }}
        >
          Please provide a valid API key to use the Mantlz form. You can set it in your environment variables as MANTLZ_KEY or pass it directly to the MantlzProvider.
        </p>
      </div>

  );
}

export default ApiKeyErrorCard;