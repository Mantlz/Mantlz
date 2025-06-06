import { MetadataRoute } from 'next'
import { SitemapConfig, generateSitemap } from '@/types/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapConfig: SitemapConfig = {
    baseUrl: 'https://mantlz.app',
    routes: [
      { path: '/', priority: 1.0, changeFrequency: 'weekly' },
      { path: '/forms/contact', priority: 0.9, changeFrequency: 'monthly' },
      { path: '/forms/rsvp', priority: 0.9, changeFrequency: 'monthly' },
      { path: '/forms/waitlist', priority: 0.9, changeFrequency: 'monthly' },
      { path: '/forms/order', priority: 0.9, changeFrequency: 'monthly' },
      { path: '/forms/application', priority: 0.9, changeFrequency: 'monthly' },
      { path: '/templates', priority: 0.8, changeFrequency: 'weekly' },
      { path: '/features', priority: 0.8, changeFrequency: 'monthly' },
      { path: '/pricing', priority: 0.8, changeFrequency: 'monthly' },
      { path: '/blog', priority: 0.7, changeFrequency: 'daily' },
      { path: '/privacy-policy', priority: 0.6, changeFrequency: 'yearly' },
      { path: '/terms-of-service', priority: 0.6, changeFrequency: 'yearly' },
      { path: '/thank-you', priority: 0.5, changeFrequency: 'yearly' },
    ]
  }

  return generateSitemap(sitemapConfig)
}