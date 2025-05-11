'use client';

import { useEffect } from 'react';
import { type FontFamily } from '@/lib/fonts';

export function FontInitializer() {
  useEffect(() => {
    // Get saved font preference
    const savedFont = localStorage.getItem('font-family') as FontFamily;
    
    // Apply the saved font if it exists
    if (savedFont) {
      document.documentElement.setAttribute('data-font', savedFont);
    }
  }, []);

  return null;
} 