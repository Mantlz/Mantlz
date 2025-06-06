import { Metadata } from 'next'
import { MetadataRoute } from 'next'

// Base SEO configuration types
export interface SeoConfig {
  title: string
  description: string
  baseUrl: string
  defaultLocale?: string
  siteName: string
  twitterHandle?: string
  googleSiteVerification?: string
}

// OpenGraph specific types
export interface OpenGraphImage {
  url: string
  width: number
  height: number
  alt: string
}

export interface OpenGraphConfig {
  type?: 'website' | 'article' | 'profile'
  locale?: string
  url?: string
  siteName?: string
  title?: string
  description?: string
  images?: OpenGraphImage[]
}

// Twitter specific types
export interface TwitterConfig {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player'
  title?: string
  description?: string
  images?: string[]
  creator?: string
}

// Robots.txt configuration
export interface RobotsConfig {
  allowedPaths: string[]
  disallowedPaths: string[]
  sitemapUrl: string
  crawlDelay?: number
}

// Sitemap configuration
export interface SitemapRoute {
  path: string
  priority: number
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  lastModified?: Date
}

export interface SitemapConfig {
  baseUrl: string
  routes: SitemapRoute[]
}

// Helper function to generate metadata from config
export function generateMetadata(config: SeoConfig): Metadata {
  return {
    title: config.title,
    description: config.description,
    metadataBase: new URL(config.baseUrl),
    openGraph: {
      type: 'website',
      locale: config.defaultLocale || 'en_US',
      url: config.baseUrl,
      siteName: config.siteName,
      title: config.title,
      description: config.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      creator: config.twitterHandle,
    },
    verification: config.googleSiteVerification 
      ? { google: config.googleSiteVerification }
      : undefined,
  }
}

// Helper function to generate robots.txt content
export function generateRobotsTxt(config: RobotsConfig): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: config.allowedPaths,
      disallow: config.disallowedPaths,
    },
    sitemap: config.sitemapUrl,
    host: new URL(config.sitemapUrl).origin,
  }
}

// Helper function to generate sitemap
export function generateSitemap(config: SitemapConfig): MetadataRoute.Sitemap {
  return config.routes.map((route) => ({
    url: `${config.baseUrl}${route.path}`,
    lastModified: route.lastModified || new Date(),
    changeFrequency: route.changeFrequency || 'daily',
    priority: route.priority,
  }))
}