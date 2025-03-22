'use client';

import React from 'react';
import { MantlzProvider } from '@mantlz/nextjs';

export default function MantlzWrapper({ 
  apiKey, 
  children 
}: { 
  apiKey: string | undefined; 
  children: React.ReactNode 
}) {
  // If no API key is provided, show an error message
  if (!apiKey) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 my-4">
        <h3 className="font-medium">Mantlz Configuration Error</h3>
        <p>Please add a valid MANTLZ_KEY to your environment variables.</p>
      </div>
    );
  }

  return (
    <MantlzProvider apiKey={apiKey}>
      {children}
    </MantlzProvider>
  );
} 

