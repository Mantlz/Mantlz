'use client';

import React, { useContext } from 'react';
import { createMantlzClient } from '../client';
import { MantlzContext } from './MantlzProvider';

export function MantlzClientProvider({ children }: { children: React.ReactNode }) {
  const context = useContext(MantlzContext);
  if (!context) {
    throw new Error('MantlzClientProvider must be used within a MantlzProvider');
  }

  React.useEffect(() => {
    window.mantlz = createMantlzClient(context.apiKey);
  }, [context.apiKey]);

  return <>{children}</>;
} 