import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mantlz.app'
  
  // Add all your static routes here
  const routes = [
    '/',
    '/pricing',
    '/privacy-policy',
    '/terms-of-service',
    '/thank-you',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }))
} 