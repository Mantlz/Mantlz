/**
 * Centralized configuration for the Mantlz SDK
 */

export const SDK_CONFIG = {
  /**
   * The default API URL to use when no specific URL is provided
   */
  DEFAULT_API_URL: 'https://form-quay.vercel.app',

  /**
   * Default timeout for API requests in milliseconds
   */
  DEFAULT_TIMEOUT: 30000,

  /**
   * Version of the SDK
   */
  VERSION: '1.0.0',
}

/**
 * Get the API URL from various possible sources
 * with a guaranteed fallback to the default
 */
export function getApiUrl(configUrl?: string): string {
  // First priority: explicitly passed config
  if (configUrl) return configUrl;
  
  // Second priority: environment variable if available
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_MANTLZ_API_URL) {
    return process.env.NEXT_PUBLIC_MANTLZ_API_URL;
  }
  
  // Final fallback: always use our default
  return SDK_CONFIG.DEFAULT_API_URL;
} 