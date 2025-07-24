"use client";

import React, { useEffect, useState } from 'react';

interface C15TComponents {
  ConsentManagerProvider: React.ComponentType<any>;
  CookieBanner: React.ComponentType<any>;
  ConsentManagerDialog: React.ComponentType<any>;
}

interface C15TWrapperProps {
  children: React.ReactNode;
}

export default function C15TWrapper({ children }: C15TWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const [c15tComponents, setC15tComponents] = useState<C15TComponents | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run on client-side after mount
    if (typeof window !== 'undefined') {
      setMounted(true);
      
      // Dynamically import c15t components
      import('@c15t/nextjs')
        .then((module) => {
          setC15tComponents({
            ConsentManagerProvider: module.ConsentManagerProvider,
            CookieBanner: module.CookieBanner,
            ConsentManagerDialog: module.ConsentManagerDialog,
          });
        })
        .catch((err) => {
          console.error('Failed to load c15t components:', err);
          setError('Failed to load consent management components');
        });
    }
  }, []);

  // Don't render anything until mounted on client
  if (!mounted) {
    return <>{children}</>;
  }

  // If there's an error loading c15t, just render children
  if (error) {
    console.warn('C15T components failed to load, continuing without consent management');
    return <>{children}</>;
  }

  // If c15t components haven't loaded yet, render children
  if (!c15tComponents) {
    return <>{children}</>;
  }

  const { ConsentManagerProvider, CookieBanner, ConsentManagerDialog } = c15tComponents;

  const backendURL = process.env.NEXT_PUBLIC_C15T_URL

  return (
    <ConsentManagerProvider
      options={{
        backendURL,
      }}
    >
      {children}
      <CookieBanner />
      <ConsentManagerDialog />
    </ConsentManagerProvider>
  );
}