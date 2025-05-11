interface Window {
  grecaptcha: {
    ready: number;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
  };
} 