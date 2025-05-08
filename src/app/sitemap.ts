import { MetadataRoute } from 'next'

type RouteConfig = {
  route: string
  priority: number
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
}

// Add all your public routes here with their configurations
const publicRoutes: RouteConfig[] = [
  // High priority pages
  { route: '', priority: 1.0, changeFrequency: 'daily' }, // Landing page
  { route: '/pricing', priority: 0.9, changeFrequency: 'weekly' },
  
  // Medium priority pages
  { route: '/feedback', priority: 0.8, changeFrequency: 'weekly' },
  { route: '/unsubscribe', priority: 0.7, changeFrequency: 'monthly' },
  
  // Legal and information pages
  { route: '/terms-of-service', priority: 0.6, changeFrequency: 'monthly' },
  { route: '/privacy-policy', priority: 0.6, changeFrequency: 'monthly' },
  { route: '/gdpr', priority: 0.6, changeFrequency: 'monthly' },
  
  // Other pages
  { route: '/thank-you', priority: 0.5, changeFrequency: 'monthly' },
  { route: '/payment', priority: 0.5, changeFrequency: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  // Map all public routes to sitemap entries
  const routes = publicRoutes.map((routeConfig) => ({
    url: `${baseUrl}${routeConfig.route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: routeConfig.changeFrequency,
    priority: routeConfig.priority,
  }))

  return routes
} 