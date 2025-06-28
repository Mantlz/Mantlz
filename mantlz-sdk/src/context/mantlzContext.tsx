"use client";

import React, {
  createContext,
  useContext,
  type PropsWithChildren,
} from "react";
import { createMantlzClient } from "../client";
import { MantlzClient } from "../types";
import { injectStyles } from "../utils/styles";

interface MantlzContextType {
  apiKey: string | undefined;
  client: MantlzClient | null;
}

const MantlzContext = createContext<MantlzContextType | null>(null);

export function useMantlz() {
  const context = useContext(MantlzContext);
  if (!context) {
    throw new Error("useMantlz must be used within a MantlzProvider");
  }
  return context;
}

interface MantlzProviderProps extends PropsWithChildren {
  apiKey?: string;
}

export function MantlzProvider({ apiKey, children }: MantlzProviderProps) {
  // Inject styles on mount - works in both dev and prod
  React.useEffect(() => {
    injectStyles();
  }, []);

  // Create client inside the provider using useMemo for performance
  const client = React.useMemo(
    () => (apiKey ? createMantlzClient(apiKey) : null),
    [apiKey]
  );

  // Keep backward compatibility with window.mantlz
  React.useEffect(() => {
    if (typeof window !== "undefined" && client) {
      window.mantlz = client;
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
