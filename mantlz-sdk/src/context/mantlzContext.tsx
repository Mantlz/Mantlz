'use client';

import React, { createContext, useContext } from 'react';
import { createMantlzClient } from '../client';

interface MantlzContextType {
  apiKey: string;
}

const MantlzContext = createContext<MantlzContextType | null>(null);

export function useMantlz() {
  const context = useContext(MantlzContext);
  if (!context) {
    throw new Error('useMantlz must be used within a MantlzProvider');
  }
  return context;
}

export function MantlzProvider({ apiKey, children }: { apiKey: string; children: React.ReactNode }) {
  // Initialize the client on the client-side
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.mantlz = createMantlzClient(apiKey);
      console.log('Mantlz client initialized with API key:', apiKey);
    }
  }, [apiKey]);

  return (
    <MantlzContext.Provider value={{ apiKey }}>
      {children}
    </MantlzContext.Provider>
  );
} 