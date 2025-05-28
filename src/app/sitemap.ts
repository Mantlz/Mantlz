import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mantlz.app'
  
  // Define routes with their priorities
  const routes = [
    { path: '/', priority: 1.0 }, // Homepage
    { path: '/forms/contact', priority: 0.9 }, // Contact form template
    { path: '/forms/rsvp', priority: 0.9 }, // RSVP form template
    { path: '/forms/waitlist', priority: 0.9 }, // Waitlist form template
    { path: '/forms/order', priority: 0.9 }, // Order form template
    { path: '/forms/application', priority: 0.9 }, // Application form template
    { path: '/templates', priority: 0.8 }, // Form templates page
    { path: '/features', priority: 0.8 }, // Features page
    { path: '/pricing', priority: 0.8 },
    { path: '/blog', priority: 0.7 },
    { path: '/privacy-policy', priority: 0.6 },
    { path: '/terms-of-service', priority: 0.6 },
    { path: '/thank-you', priority: 0.5 },
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route.priority,
  }))
} 