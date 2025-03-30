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

/**
 * Detects country from Cloudflare country code or accept-language header
 * @param cfCountry Cloudflare country code (e.g., "US")
 * @param acceptLanguage Accept-Language header
 * @returns Country name
 */
export function detectCountry(
  cfCountry: string | null | undefined, 
  acceptLanguage: string | null | undefined
): string | undefined {
  // If we have a Cloudflare country code, use that
  if (cfCountry && cfCountry.length === 2) {
    return COUNTRY_MAP[cfCountry] || cfCountry;
  }
  
  // Fall back to browser locale from accept-language
  if (acceptLanguage) {
    const browserLocale = acceptLanguage.split(',')[0]?.split('-')[1];
    if (browserLocale && browserLocale.length === 2) {
      return COUNTRY_MAP[browserLocale] || browserLocale;
    }
  }
  
  return undefined;
}

/**
 * Enhances form submission data with analytics metadata
 * @param data Original form data
 * @param headers Request headers
 * @returns Enhanced data with analytics metadata
 */
export function enhanceDataWithAnalytics(
  data: Record<string, any>, 
  headers: {
    userAgent?: string | null;
    cfCountry?: string | null;
    acceptLanguage?: string | null;
    ip?: string | null;
  }
): Record<string, any> {
  const { userAgent, cfCountry, acceptLanguage, ip } = headers;
  
  const browser = detectBrowser(userAgent);
  const country = detectCountry(cfCountry, acceptLanguage);
  
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

/**
 * Extract browser and location stats from submissions
 * @param submissions Array of form submissions
 * @returns Object containing browser and location stats
 */
export function extractAnalyticsFromSubmissions(submissions: any[]): { 
  browserStats: Array<{ name: string; count: number; percentage: number }>;
  locationStats: Array<{ name: string; count: number; percentage: number }>;
} {
  const browserStats: Array<{ name: string; count: number; percentage: number }> = [];
  const locationStats: Array<{ name: string; count: number; percentage: number }> = [];
  
  // Only process if we have submissions
  if (submissions.length === 0) {
    return { browserStats, locationStats };
  }
  
  const browserCounts: Record<string, number> = {};
  const countryCounts: Record<string, number> = {};
  
  // Process each submission
  submissions.forEach(sub => {
    const data = sub.data as any;
    
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