import { LRUCache } from 'lru-cache'
import { Redis } from '@upstash/redis'
import { db } from "../lib/db"
import { User, Form, ApiKey } from "@prisma/client"

/**
 * Cache key prefixes
 */
export const CACHE_KEYS = {
  USER: 'user:',
  FORM: 'form:',
  API_KEY: 'api_key:',
  CAMPAIGN: 'campaign:',
  QUOTA: 'quota:',
  STRIPE: 'stripe:',
  EMAIL: 'email:',
  NOTIFICATION: 'notification:',
  EXPORT: 'export:',
  PAYMENT: 'payment:',
} as const;

/**
 * TTL configurations (in seconds)
 */
export const CACHE_TTL = {
  [CACHE_KEYS.USER]: 60 * 15, // 15 minutes
  [CACHE_KEYS.FORM]: 60 * 5, // 5 minutes
  [CACHE_KEYS.API_KEY]: 60 * 30, // 30 minutes
  [CACHE_KEYS.CAMPAIGN]: 60 * 10, // 10 minutes
  [CACHE_KEYS.QUOTA]: 60 * 5, // 5 minutes
  [CACHE_KEYS.STRIPE]: 60 * 60, // 1 hour
  [CACHE_KEYS.EMAIL]: 60 * 15, // 15 minutes
  [CACHE_KEYS.NOTIFICATION]: 60 * 5, // 5 minutes
  [CACHE_KEYS.EXPORT]: 60 * 60 * 24, // 24 hours
  [CACHE_KEYS.PAYMENT]: 60 * 30, // 30 minutes
} as const;

/**
 * Types for the cache system
 */
type CacheableValuePrimitive = string | number | boolean | null;

// Wrapper for primitive values to satisfy LRUCache object constraint
interface PrimitiveWrapper {
  type: 'primitive';
  value: CacheableValuePrimitive;
}

// Type guard for primitive wrapper
function isPrimitiveWrapper(value: unknown): value is PrimitiveWrapper {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    'value' in value &&
    (value as PrimitiveWrapper).type === 'primitive'
  );
}

// Union type for all possible cache values
type CacheableValue = 
  | User 
  | Form 
  | ApiKey 
  | Record<string, unknown>
  | PrimitiveWrapper;

/**
 * Initialize Redis client if environment variables are available
 */
const redis = process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    })
  : null;

/**
 * In-memory LRU cache
 */
const lruCache = new LRUCache<string, CacheableValue>({
  max: 1000, // Maximum number of items
  ttl: 1000 * 60 * 5, // 5 minutes default TTL
  updateAgeOnGet: true, // Reset TTL when item is accessed
  maxSize: 50 * 1024 * 1024, // 50MB max size
  sizeCalculation: (value) => {
    // Handle primitive wrapper
    if (isPrimitiveWrapper(value)) {
      const primitiveValue = value.value;
      if (typeof primitiveValue === 'string') {
        return Buffer.byteLength(primitiveValue, 'utf8');
      }
      if (typeof primitiveValue === 'number') {
        return 8; // 64-bit number
      }
      if (typeof primitiveValue === 'boolean') {
        return 1;
      }
      return 0; // null
    }
    
    // For objects/arrays, use JSON stringification to estimate size
    return Buffer.byteLength(JSON.stringify(value), 'utf8');
  }
});

/**
 * Wrap primitive values to satisfy LRUCache object constraint
 */
function wrapPrimitive(value: unknown): CacheableValue {
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) {
    return { type: 'primitive', value: value as CacheableValuePrimitive };
  }
  return value as CacheableValue;
}

/**
 * Unwrap primitive values for external use
 */
function unwrapValue<T>(value: CacheableValue): T {
  if (isPrimitiveWrapper(value)) {
    return value.value as unknown as T;
  }
  return value as unknown as T;
}

/**
 * Get TTL for a specific key
 */
function getTTL(key: string): number {
  const prefix = Object.keys(CACHE_KEYS).find(
    k => key.startsWith(CACHE_KEYS[k as keyof typeof CACHE_KEYS])
  );
  
  return prefix 
    ? CACHE_TTL[CACHE_KEYS[prefix as keyof typeof CACHE_KEYS]] 
    : 300; // 5 minutes default
}

/**
 * Cache implementation
 */
export const cache = {
  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    // Try LRU cache first
    const lruResult = lruCache.get(key);
    if (lruResult) {
      return unwrapValue<T>(lruResult);
    }

    // Try Redis if available
    if (redis) {
      const redisResult = await redis.get(key);
      if (redisResult) {
        const wrappedResult = wrapPrimitive(redisResult);
        lruCache.set(key, wrappedResult);
        return unwrapValue<T>(wrappedResult);
      }
    }

    return null;
  },

  /**
   * Set a value in cache
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const effectiveTTL = ttl || getTTL(key);
    const wrappedValue = wrapPrimitive(value);
    
    // Set in LRU cache
    lruCache.set(key, wrappedValue, { ttl: effectiveTTL * 1000 });

    // Set in Redis if available
    if (redis) {
      await redis.set(key, value, { ex: effectiveTTL });
    }
  },

  /**
   * Remove a value from cache
   */
  async invalidate(key: string): Promise<void> {
    lruCache.delete(key);
    if (redis) {
      await redis.del(key);
    }
  },

  /**
   * Get multiple values from cache
   */
  async mget<T>(keys: string[]): Promise<Record<string, T>> {
    const results: Record<string, T> = {};

    // Try LRU cache first for all keys
    for (const key of keys) {
      const lruResult = lruCache.get(key);
      if (lruResult) {
        results[key] = unwrapValue<T>(lruResult);
      }
    }

    // Get missing keys from Redis
    const missingKeys = keys.filter(key => !(key in results));
    if (redis && missingKeys.length > 0) {
      const redisResults = await redis.mget(...missingKeys);
      missingKeys.forEach((key, index) => {
        if (redisResults[index]) {
          const wrappedResult = wrapPrimitive(redisResults[index]);
          lruCache.set(key, wrappedResult);
          results[key] = unwrapValue<T>(wrappedResult);
        }
      });
    }

    return results;
  },

  /**
   * Set multiple values in cache
   */
  async mset<T>(items: Array<{ key: string; value: T; ttl?: number }>): Promise<void> {
    // Set in LRU cache
    items.forEach(({ key, value, ttl }) => {
      const effectiveTTL = ttl || getTTL(key);
      const wrappedValue = wrapPrimitive(value);
      lruCache.set(key, wrappedValue, { ttl: effectiveTTL * 1000 });
    });

    // Set in Redis if available
    if (redis && items.length > 0) {
      const multi = redis.pipeline();
      items.forEach(({ key, value, ttl }) => {
        const effectiveTTL = ttl || getTTL(key);
        multi.set(key, value, { ex: effectiveTTL });
      });
      await multi.exec();
    }
  },

  /**
   * Cache user data
   */
  async getUser(id: string): Promise<User | null> {
    const cacheKey = `${CACHE_KEYS.USER}${id}`;
    const cached = await this.get<User>(cacheKey);
    if (cached) return cached;

    const user = await db.user.findUnique({
      where: { id }
    });

    if (user) {
      await this.set(cacheKey, user);
    }

    return user;
  },

  /**
   * Cache form data
   */
  async getForm(id: string): Promise<Form | null> {
    const cacheKey = `${CACHE_KEYS.FORM}${id}`;
    const cached = await this.get<Form>(cacheKey);
    if (cached) return cached;

    const form = await db.form.findUnique({
      where: { id }
    });

    if (form) {
      await this.set(cacheKey, form);
    }

    return form;
  },

  /**
   * Cache API key data
   */
  async getApiKey(key: string): Promise<(ApiKey & { user: User }) | null> {
    const cacheKey = `${CACHE_KEYS.API_KEY}${key}`;
    const cached = await this.get<ApiKey & { user: User }>(cacheKey);
    if (cached) return cached;

    const apiKey = await db.apiKey.findUnique({
      where: { key },
      include: { user: true }
    });

    if (apiKey) {
      await this.set(cacheKey, apiKey);
    }

    return apiKey;
  },

  /**
   * Batch invalidation for related cache entries
   */
  async invalidateUserData(userId: string): Promise<void> {
    const keys = [
      `${CACHE_KEYS.USER}${userId}`,
      `${CACHE_KEYS.QUOTA}${userId}`,
      `${CACHE_KEYS.PAYMENT}${userId}`,
    ];
    
    await Promise.all(keys.map(key => this.invalidate(key)));
  }
}; 