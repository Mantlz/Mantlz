'use client';

import React from 'react';

/**
 * Injects the CSS styles into the document head
 * Works in both development and production environments
 */
export const injectStyles = (): void => {
  // Early return if not in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  
  // Only inject once
  if (document.querySelector('style[data-mantlz="true"]')) return;
  
  // Try the direct approach first - read from a global variable set by the build process
  if ((window as any).__MANTLZ_CSS__) {
    const style = document.createElement('style');
    style.setAttribute('data-mantlz', 'true');
    style.textContent = (window as any).__MANTLZ_CSS__;
    document.head.appendChild(style);
  }
};

/**
 * Safe version of injectStyles that can be used in components
 */
export const useInjectStyles = () => {
  React.useEffect(() => {
    injectStyles();
  }, []);
}; 