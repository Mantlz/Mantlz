import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitConfig = {
  enabled: boolean;
  ratelimit: Ratelimit | null;
};

// Default rate limit values
const DEFAULT_REQUESTS = 30; 
// requests per window
const DEFAULT_WINDOW = 60; 
// 60 seconds window
const DEFAULT_TIMEOUT = 5000;
 // 5 seconds timeout

let ratelimitConfig: RateLimitConfig = {
  enabled: false,
  ratelimit: null,
};

if (process.env.UPSTASH_REDIS_REST_URL) {
  try {
    const redis = Redis.fromEnv();

    // Get rate limit configuration from environment variables
    const requests = parseInt(process.env.RATE_LIMIT_REQUESTS || DEFAULT_REQUESTS.toString(), 10);
    const window = parseInt(process.env.RATE_LIMIT_WINDOW || DEFAULT_WINDOW.toString(), 10);
    const timeout = parseInt(process.env.RATE_LIMIT_TIMEOUT || DEFAULT_TIMEOUT.toString(), 10);

    // Create a new ratelimiter with production settings
    const ratelimitFunction = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(requests, `${window} s`),
      analytics: true,
      enableProtection: true,
      prefix: "mantlz_rate_limit",
      timeout: timeout,
      ephemeralCache: new Map(),
    });

    (`Rate limiter initialized with ${requests} requests per ${window} seconds`);
    
    ratelimitConfig = {
      enabled: true,
      ratelimit: ratelimitFunction,
    };
  } catch (error) {
    console.error("Failed to initialize rate limiter:", error);
    ratelimitConfig = {
      enabled: false,
      ratelimit: null,
    };
  }
} else {
  console.error("Rate limiter disabled - Redis URL not configured");
  ratelimitConfig = {
    enabled: false,
    ratelimit: null,
  };
}

export { ratelimitConfig };