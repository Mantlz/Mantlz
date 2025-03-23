'use client';

import React, { createContext, useContext } from 'react';
import { createMantlzClient } from '../client';
import { MantlzClient } from '../types';

interface MantlzContextType {
  apiKey: string | undefined;
  client: MantlzClient | null;
}

const MantlzContext = createContext<MantlzContextType | null>(null);

export function useMantlz() {
  const context = useContext(MantlzContext);
  if (!context) {
    throw new Error('useMantlz must be used within a MantlzProvider');
  }
  return context;
}

export function MantlzProvider({ apiKey, children }: { apiKey?: string; children: React.ReactNode }) {
  // Create client inside the provider using useMemo for performance
  const client = React.useMemo(() => 
    apiKey ? createMantlzClient(apiKey) : null, 
    [apiKey]
  );
  
  // Keep backward compatibility with window.mantlz
  React.useEffect(() => {
    if (typeof window !== 'undefined' && client) {
      window.mantlz = client;
      console.log('Mantlz client initialized with API key:', apiKey);
    }
  }, [apiKey, client]);

  return (
    <MantlzContext.Provider value={{ apiKey, client }}>
      {children}
    </MantlzContext.Provider>
  );
}

// Add this to global window type
declare global {
  interface Window {
    mantlz: MantlzClient;
  }
} 