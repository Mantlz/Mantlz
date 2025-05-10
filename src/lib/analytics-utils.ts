/**
 * Utility functions for analytics tracking
 */

/**
 * Map of country codes to full country names
 */
export const COUNTRY_MAP: Record<string, string> = {
  "US": "United States", 
  "GB": "United Kingdom", 
  "CA": "Canada", 
  "AU": "Australia", 
  "FR": "France", 
  "DE": "Germany", 
  "JP": "Japan",
  "CN": "China", 
  "ES": "Spain", 
  "IT": "Italy", 
  "RU": "Russia",
  "PT": "Portugal", 
  "NL": "Netherlands", 
  "KR": "South Korea",
  "BR": "Brazil",
  "MX": "Mexico",
  "IN": "India",
  "ZA": "South Africa",
  "AR": "Argentina",
  "ID": "Indonesia",
  "PL": "Poland",
  "SE": "Sweden",
  "TR": "Turkey",
  "EG": "Egypt",
  "SA": "Saudi Arabia",
  "NG": "Nigeria",
  "KE": "Kenya",
  "TH": "Thailand",
  "VN": "Vietnam",
  "IE": "Ireland",
  "SG": "Singapore",
  "NZ": "New Zealand",
  "MY": "Malaysia",
  "PH": "Philippines",
  "CL": "Chile",
  "CO": "Colombia",
  "PE": "Peru"
};

/**
 * Detects browser name from user agent string
 * @param userAgent User agent string
 * @returns Browser name
 */
export function detectBrowser(userAgent: string | null | undefined): string {
  if (!userAgent) return "Unknown";
  
  if (/Chrome/i.test(userAgent) && !/Chromium|OPR|Edge/i.test(userAgent)) {
    return "Chrome";
  } else if (/Firefox/i.test(userAgent)) {
    return "Firefox";
  } else if (/Safari/i.test(userAgent) && !/Chrome|Chromium/i.test(userAgent)) {
    return "Safari";
  } else if (/Edge|Edg/i.test(userAgent)) {
    return "Edge";
  } else if (/MSIE|Trident/i.test(userAgent)) {
    return "Internet Explorer";
  } else if (/OPR/i.test(userAgent)) {
    return "Opera";
  } else if (/Mobile/i.test(userAgent)) {
    return "Mobile Browser";
  }
  
  return "Unknown";
}

// Cache for IP geolocation results to avoid hitting rate limits
const ipCache: Record<string, { country: string; timestamp: number }> = {};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

/**
 * Detects country from various sources in order of reliability:
 * 1. Cloudflare headers (most reliable)
 * 2. IP geolocation
 * 3. Browser locale (least reliable)
 */
export async function detectCountry(
  cfCountry: string | null | undefined, 
  acceptLanguage: string | null | undefined,
  ip: string | null | undefined
): Promise<string | undefined> {

  // 1. Try Cloudflare country code (most reliable)
  if (cfCountry && cfCountry.length === 2) {
    const countryName = COUNTRY_MAP[cfCountry.toUpperCase()];
    return countryName || cfCountry;
  }
  
  // 2. Try IP geolocation (second most reliable, especially with VPN)
  if (ip) {
    const ipCountry = await getCountryFromIP(ip);
    if (ipCountry) {
      return ipCountry;
    }
  } else {
  }
  
  // 3. Last resort: browser locale (least reliable with VPN)
  if (acceptLanguage) {
    const browserLocale = acceptLanguage.split(',')[0]?.split('-')[1];
    if (browserLocale && browserLocale.length === 2) {
      const countryName = COUNTRY_MAP[browserLocale.toUpperCase()];
      return countryName || browserLocale;
    }
  }
  
  return undefined;
}

/**
 * Get country from IP address using ipapi.co service
 * @param ip IP address
 * @returns Promise<string | undefined>
 */
async function getCountryFromIP(ip: string | null | undefined): Promise<string | undefined> {
  if (!ip) {
    ('No IP provided for geolocation');
    return undefined;
  }

  // Check cache first
  const now = Date.now();
  const cached = ipCache[ip];
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.country;
  }
  
  try {
    ('Making request to IP geolocation service...');
    // Add a small delay to avoid hitting rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Format the URL properly with https and no trailing slash
    const response = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json`, {
      headers: {
        'User-Agent': 'Mantlz/1.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('✗ IP geolocation API error:', { 
        status: response.status,
        statusText: response.statusText 
      });
      return undefined;
    }
    
    const data = await response.json() as { 
      country_name?: string;
      country_code?: string;
      error?: boolean;
      reason?: string;
    };
    
    if (data.error) {
      console.error('✗ IP geolocation API error:', data.reason);
      return undefined;
    }
    
    // Prefer country_name if available, fall back to country_code
    let countryName = data.country_name;
    if (!countryName && data.country_code) {
      const countryCode = data.country_code.toUpperCase();
      countryName = COUNTRY_MAP[countryCode] || countryCode;
    }

    if (countryName) {
      // Cache the result
      ipCache[ip] = { 
        country: countryName,
        timestamp: now
      };
      
     
      
      return countryName;
    }
    
    ('✗ IP geolocation returned no country information');
    return undefined;
  } catch (error) {
    console.error('✗ Failed to get country from IP:', error);
    return undefined;
  }
}

// Define a type for form data
export interface FormData extends Record<string, unknown> {
  [key: string]: unknown;
}

// Define a type for analytics metadata
export interface AnalyticsMetadata {
  userAgent?: string | null;
  browser?: string;
  country?: string;
  timestamp: string;
  ip: string;
}

/**
 * Enhances form submission data with analytics metadata
 * @param data Original form data
 * @param headers Request headers
 * @returns Promise<FormData & { _meta: AnalyticsMetadata }>
 */
export async function enhanceDataWithAnalytics(
  data: FormData, 
  headers: {
    userAgent?: string | null;
    cfCountry?: string | null;
    acceptLanguage?: string | null;
    ip?: string | null;
  }
): Promise<FormData & { _meta: AnalyticsMetadata }> {
  const { userAgent, cfCountry, acceptLanguage, ip } = headers;
  
  const browser = detectBrowser(userAgent);
  const country = await detectCountry(cfCountry, acceptLanguage, ip);
  
  return {
    ...data,
    _meta: {
      userAgent,
      browser,
      country,
      timestamp: new Date().toISOString(),
      ip: ip || 'unknown'
    }
  };
}

// Define a type for submission data
export interface Submission {
  data: {
    _meta?: {
      userAgent?: string | null;
      browser?: string;
      country?: string;
    };
    userAgent?: string;
    country?: string;
    location?: {
      country?: string;
    };
    ipInfo?: {
      country?: string;
    };
    geo?: {
      country?: string;
    };
    [key: string]: unknown;
  };
}

// Define types for stats
export interface StatItem {
  name: string;
  count: number;
  percentage: number;
}

/**
 * Extract browser and location stats from submissions
 * @param submissions Array of form submissions
 * @returns Object containing browser and location stats
 */
export function extractAnalyticsFromSubmissions(submissions: Submission[]): { 
  browserStats: Array<StatItem>;
  locationStats: Array<StatItem>;
} {
  const browserStats: Array<StatItem> = [];
  const locationStats: Array<StatItem> = [];
  
  // Only process if we have submissions
  if (submissions.length === 0) {
    return { browserStats, locationStats };
  }
  
  const browserCounts: Record<string, number> = {};
  const countryCounts: Record<string, number> = {};
  
  // Process each submission
  submissions.forEach(sub => {
    const data = sub.data;
    
    // Extract browser info from legacy or new format
    let browser = "Unknown";
    
    if (data?._meta?.browser) {
      // New format with pre-computed browser
      browser = data._meta.browser;
    } else if (data?._meta?.userAgent) {
      // New format with user agent
      browser = detectBrowser(data._meta.userAgent);
    } else if (data?.userAgent) {
      // Legacy format
      browser = detectBrowser(data.userAgent);
    }
    
    browserCounts[browser] = (browserCounts[browser] || 0) + 1;
    
    // Extract country info from submissions
    let country = "Unknown";
    if (data?._meta?.country) {
      country = data._meta.country;
    } else if (data?.country) {
      country = data.country;
    } else if (data?.location?.country) {
      country = data.location.country;
    } else if (data?.ipInfo?.country) {
      country = data.ipInfo.country;
    } else if (data?.geo?.country) {
      country = data.geo.country;
    }
    
    if (country !== "Unknown") {
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    }
  });
  
  // Convert counts to statistics
  Object.entries(browserCounts).forEach(([name, count]) => {
    browserStats.push({
      name,
      count,
      percentage: count / submissions.length
    });
  });
  
  Object.entries(countryCounts).forEach(([name, count]) => {
    locationStats.push({
      name,
      count,
      percentage: count / submissions.length
    });
  });
  
  // Sort by count (highest first)
  browserStats.sort((a, b) => b.count - a.count);
  locationStats.sort((a, b) => b.count - a.count);
  
  return { browserStats, locationStats };
} 