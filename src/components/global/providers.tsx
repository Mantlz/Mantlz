"use client"

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { HTTPException } from "hono/http-exception"
import { PropsWithChildren, useState } from "react"

export const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // Always consider data stale to ensure fresh data on navigation
            gcTime: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime)
            refetchOnWindowFocus: true, // Refetch when tab gets focus
            refetchOnMount: true, // Refetch when component mounts
            refetchOnReconnect: true, // Refetch when network reconnects
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            retry: 1,
            onError: (err) => {
              if (err instanceof HTTPException) {
                // Handle mutation errors
                console.error('Mutation failed:', err);
              }
            },
          },
        },
        queryCache: new QueryCache({
          onError: (err) => {
            if (err instanceof HTTPException) {
              // global error handling, e.g. toast notification ...
              console.error('Query failed:', err);
            }
          },
        }),
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}