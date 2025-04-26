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
 * Get the API URL from config or use the default
 */
export function getApiUrl(configUrl?: string): string {
  // Use config if provided, otherwise use default
  const url = configUrl || SDK_CONFIG.DEFAULT_API_URL;
  
  // Ensure the URL has a protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  
  return url;
} 