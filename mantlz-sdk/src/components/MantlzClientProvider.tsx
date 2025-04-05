'use client';

import React, { useContext } from 'react';
import { createMantlzClient } from '../client';
import { MantlzContext } from './MantlzProvider';

export function MantlzClientProvider({ children }: { children: React.ReactNode }) {
  const context = useContext(MantlzContext);
  
  // Context may not be provided if using environment variables
  const apiKey = context?.apiKey;

  React.useEffect(() => {
    // Create client with API key from context or fallback to environment variable
    window.mantlz = createMantlzClient(apiKey);
  }, [apiKey]);

  return <>{children}</>;
} 