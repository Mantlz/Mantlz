'use client';

import React from 'react';
import { MantlzProvider } from '@mantlz/nextjs';

export default function MantlzWrapper({ 
  apiKey, 
  children 
}: { 
  apiKey: string; 
  children: React.ReactNode 
}) {
  return (
    <MantlzProvider apiKey={apiKey}>
      {children}
    </MantlzProvider>
  );
} 