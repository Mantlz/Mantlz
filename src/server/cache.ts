import { LRUCache } from 'lru-cache'
import { Redis } from '@upstash/redis'
import { db } from "../lib/db"

// Initialize Redis client if UPSTASH_REDIS_URL is available
const redis = process.env.UPSTASH_REDIS_URL 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN!,
    })
  : null;

// In-memory LRU cache for faster access
const lruCache = new LRUCache<string, any>({
  max: 1000, // Increased maximum items
  ttl: 1000 * 60 * 5, // 5 minutes default
  updateAgeOnGet: true,
  maxSize: 50 * 1024 * 1024, // 50MB max size
  sizeCalculation: (value) => {
    // Estimate size in bytes for different types of values
    if (typeof value === 'string') {
      return Buffer.byteLength(value, 'utf8')
    }
    if (typeof value === 'number') {
      return 8 // 64-bit number
    }
    if (typeof value === 'boolean') {
      return 1
    }
    // For objects/arrays, use JSON stringification to estimate size
    return Buffer.byteLength(JSON.stringify(value), 'utf8')
  }
})

// Cache key prefixes with TTLs
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

// TTL configurations (in seconds)
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

export const cache = {
  async get(key: string) {
    // Try LRU cache first
    const lruResult = lruCache.get(key)
    if (lruResult) return lruResult

    // Try Redis if available
    if (redis) {
      const redisResult = await redis.get(key)
      if (redisResult) {
        // Update LRU cache
        lruCache.set(key, redisResult)
        return redisResult
      }
    }

    return null
  },

  async set(key: string, value: any, ttl?: number) {
    // Get TTL based on key prefix
    const prefix = Object.keys(CACHE_KEYS).find(k => key.startsWith(CACHE_KEYS[k as keyof typeof CACHE_KEYS]))
    const defaultTTL = prefix ? CACHE_TTL[CACHE_KEYS[prefix as keyof typeof CACHE_KEYS]] : 300

    // Set in LRU cache
    lruCache.set(key, value, { ttl: (ttl || defaultTTL) * 1000 })

    // Set in Redis if available
    if (redis) {
      await redis.set(key, value, {
        ex: ttl || defaultTTL
      })
    }
  },

  async invalidate(key: string) {
    lruCache.delete(key)
    if (redis) {
      await redis.del(key)
    }
  },

  async mget(keys: string[]) {
    const results: Record<string, any> = {}

    // Try LRU cache first for all keys
    for (const key of keys) {
      const lruResult = lruCache.get(key)
      if (lruResult) {
        results[key] = lruResult
      }
    }

    // Get missing keys from Redis
    const missingKeys = keys.filter(key => !(key in results))
    if (redis && missingKeys.length > 0) {
      const redisResults = await redis.mget(...missingKeys)
      missingKeys.forEach((key, index) => {
        if (redisResults[index]) {
          results[key] = redisResults[index]
          lruCache.set(key, redisResults[index])
        }
      })
    }

    return results
  },

  async mset(items: { key: string; value: any; ttl?: number }[]) {
    // Batch set in LRU cache
    items.forEach(({ key, value, ttl }) => {
      const prefix = Object.keys(CACHE_KEYS).find(k => key.startsWith(CACHE_KEYS[k as keyof typeof CACHE_KEYS]))
      const defaultTTL = prefix ? CACHE_TTL[CACHE_KEYS[prefix as keyof typeof CACHE_KEYS]] : 300
      lruCache.set(key, value, { ttl: (ttl || defaultTTL) * 1000 })
    })

    // Batch set in Redis if available
    if (redis) {
      const multi = redis.pipeline()
      items.forEach(({ key, value, ttl }) => {
        const prefix = Object.keys(CACHE_KEYS).find(k => key.startsWith(CACHE_KEYS[k as keyof typeof CACHE_KEYS]))
        const defaultTTL = prefix ? CACHE_TTL[CACHE_KEYS[prefix as keyof typeof CACHE_KEYS]] : 300
        multi.set(key, value, { ex: ttl || defaultTTL })
      })
      await multi.exec()
    }
  },

  // Cache user data
  async getUser(id: string) {
    const cacheKey = `${CACHE_KEYS.USER}${id}`
    const cached = await this.get(cacheKey)
    if (cached) return cached

    const user = await db.user.findUnique({
      where: { id }
    })

    if (user) {
      await this.set(cacheKey, user)
    }

    return user
  },

  // Cache form data
  async getForm(id: string) {
    const cacheKey = `${CACHE_KEYS.FORM}${id}`
    const cached = await this.get(cacheKey)
    if (cached) return cached

    const form = await db.form.findUnique({
      where: { id }
    })

    if (form) {
      await this.set(cacheKey, form)
    }

    return form
  },

  // Cache API key data
  async getApiKey(key: string) {
    const cacheKey = `${CACHE_KEYS.API_KEY}${key}`
    const cached = await this.get(cacheKey)
    if (cached) return cached

    const apiKey = await db.apiKey.findUnique({
      where: { key },
      include: { user: true }
    })

    if (apiKey) {
      await this.set(cacheKey, apiKey)
    }

    return apiKey
  },

  // Batch invalidation for related cache entries
  async invalidateUserData(userId: string) {
    const keys = [
      `${CACHE_KEYS.USER}${userId}`,
      `${CACHE_KEYS.QUOTA}${userId}`,
      `${CACHE_KEYS.PAYMENT}${userId}`,
    ]
    
    await Promise.all(keys.map(key => this.invalidate(key)))
  }
} 