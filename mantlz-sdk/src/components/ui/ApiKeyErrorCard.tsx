import React from 'react';
import { Theme } from '@radix-ui/themes';

export const ApiKeyErrorCard = () => {
  return (
    <Theme>
      <div style={{ 
        padding: '16px', 
        borderRadius: '8px', 
        border: '1px solid var(--red-6)',
        backgroundColor: 'var(--red-2)'
      }}>
        <h2 style={{ 
          color: 'var(--red-11)',
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '8px'
        }}>
          API Key Error
        </h2>
        <p style={{ 
          color: 'var(--red-11)',
          fontSize: '14px',
          margin: 0
        }}>
          Please provide a valid API key to use the Mantlz form. You can set it in your environment variables as MANTLZ_KEY or pass it directly to the MantlzProvider.
        </p>
      </div>
    </Theme>
  );
}; 