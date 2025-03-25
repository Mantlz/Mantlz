import { createMantlzClient } from '@mantlz/nextjs';
import { useEffect, useState } from 'react';

export function useMantlz() {
  const [client, setClient] = useState<ReturnType<typeof createMantlzClient> | null>(null);

  useEffect(() => {
    // Get API key from localStorage or environment
    const apiKey = localStorage.getItem('mantlz_api_key') || process.env.NEXT_PUBLIC_MANTLZ_API_KEY;
    
    if (apiKey) {
      const client = createMantlzClient(apiKey);
      setClient(client);
    }
  }, []);

  return { client };
} 