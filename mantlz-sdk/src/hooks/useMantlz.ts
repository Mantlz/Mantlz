'use client';

import { useContext } from 'react';
import { MantlzContext } from '../components/MantlzProvider';

interface MantlzContextType {
  apiKey: string;
}

export function useMantlz(): MantlzContextType {
  const context = useContext(MantlzContext);
  if (!context) {
    throw new Error('useMantlz must be used within a MantlzProvider');
  }
  return context;
} 