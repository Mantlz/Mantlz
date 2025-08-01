import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (message: string) => void;
  renderSkeleton: (type: 'card' | 'list' | 'form' | 'custom', count?: number) => React.ReactNode;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

type LoadingProviderProps = {
  children: ReactNode;
};

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  // Function to render different skeleton types
  const renderSkeleton = (type: 'card' | 'list' | 'form' | 'custom', count: number = 1) => {
    switch (type) {
      case 'card':
        return (
          <div className="space-y-4 w-full">
            {Array(count).fill(0).map((_, i) => (
              <div key={i} className="border border-zinc-200 dark:border-zinc-900 rounded-lg p-5">
                <Skeleton className="h-6 w-1/3 mb-4 dark:bg-zinc-900" />
                <Skeleton className="h-4 w-full mb-2 dark:bg-zinc-900" />
                <Skeleton className="h-4 w-2/3 dark:bg-zinc-900" />
              </div>
            ))}
          </div>
        );
      case 'list':
        return (
          <div className="space-y-2 w-full">
            {Array(count).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded-full dark:bg-background" />
                <Skeleton className="h-4 flex-1 dark:bg-background" />
              </div>
            ))}
          </div>
        );
      case 'form':
        return (
          <div className="space-y-4 w-full">
            <Skeleton className="h-5 w-1/4 mb-1 dark:bg-background" />
            <Skeleton className="h-10 w-full mb-4 dark:bg-background" />
            <Skeleton className="h-5 w-1/4 mb-1 dark:bg-background" />
            <Skeleton className="h-10 w-full mb-4 dark:bg-background" />
            <Skeleton className="h-10 w-1/4 dark:bg-background" />
          </div>
        );
      case 'custom':
      default:
        return (
          <div className="grid grid-cols-3 gap-4 w-full ">
            <Skeleton className="h-50 w-full dark:bg-background" />
            <Skeleton className="h-50 w-full dark:bg-background" />
            <Skeleton className="h-50 w-full dark:bg-background" />
          </div>
        );
    }
  };

  return (
    <LoadingContext.Provider value={{ 
      isLoading, 
      setIsLoading, 
      loadingMessage, 
      setLoadingMessage,
      renderSkeleton 
    }}>
      {children}
    </LoadingContext.Provider>
  );
}