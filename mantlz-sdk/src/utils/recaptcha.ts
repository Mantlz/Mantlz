// Default reCAPTCHA site key for the SDK
const RECAPTCHA_SITE_KEY = '6Ld3OgIrAAAAANfjHiT09GOxmWUtFBDl551j-3QD';

/**
 * Generates a reCAPTCHA token for testing purposes
 * This function should only be used in development/testing environments
 * @returns Promise<string> The reCAPTCHA token
 */
export async function generateTestRecaptchaToken(): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be used in browser environments');
  }

  // Load reCAPTCHA script if not already loaded
  if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  }

  // Wait for grecaptcha to be ready
  let attempts = 0;
  const maxAttempts = 50; // 5 seconds with 100ms interval
  while (attempts < maxAttempts) {
    if (window.grecaptcha && typeof window.grecaptcha.execute === 'function') {
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }

  if (!window.grecaptcha || typeof window.grecaptcha.execute !== 'function') {
    throw new Error('reCAPTCHA failed to initialize');
  }

  // Generate token
  const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' });
  return token;
}

// Type declaration for window.grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: number;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}