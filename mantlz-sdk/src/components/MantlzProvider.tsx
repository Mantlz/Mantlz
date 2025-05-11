import React, { createContext } from 'react';
import { MantlzClientProvider } from './MantlzClientProvider';

interface MantlzContextType {
  apiKey?: string;
}

export const MantlzContext = createContext<MantlzContextType | null>(null);

interface MantlzProviderProps {
  apiKey?: string;
  children: React.ReactNode;
}

export function MantlzProvider({ apiKey, children }: MantlzProviderProps) {
  return (
    <MantlzContext.Provider value={{ apiKey }}>
      <MantlzClientProvider>
        {children}
      </MantlzClientProvider>
    </MantlzContext.Provider>
  );
} 