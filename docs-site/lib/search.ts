import Fuse from 'fuse.js'

export interface SearchResult {
  title: string
  content: string
  url: string
  category?: string
}

let searchIndex: SearchResult[] = []

export async function initSearchIndex() {
  try {
    console.log('Initializing search index...')
    const response = await fetch('/search-index.json')
    if (!response.ok) throw new Error('Failed to load search index')
    searchIndex = await response.json()
    console.log('Search index loaded:', searchIndex.length, 'items')
  } catch (error) {
    console.error('Error loading search index:', error)
    searchIndex = []
  }
}

export function searchContent(query: string): SearchResult[] {
  console.log('Searching for:', query)
  console.log('Current search index size:', searchIndex.length)
  
  if (query.trim() === '') return []
  
  const fuse = new Fuse(searchIndex, {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'content', weight: 1 },
      { name: 'category', weight: 1 }
    ],
    includeScore: true,
    threshold: 0.4,
    ignoreLocation: true
  })

  const results = fuse.search(query).map(result => result.item)
  console.log('Search results:', results.length, 'items found')
  return results
}

// Function to extract text content from the page
export function extractPageContent(): SearchResult[] {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const paragraphs = document.querySelectorAll('p, li')
  const results: SearchResult[] = []

  // Get the current page title and URL
  const pageTitle = document.title
  const pageUrl = window.location.pathname

  // Process headings
  headings.forEach((heading) => {
    const id = heading.getAttribute('id')
    results.push({
      title: heading.textContent || '',
      content: heading.textContent || '',
      url: id ? `${pageUrl}#${id}` : pageUrl
    })
  })

  // Process paragraphs and list items
  paragraphs.forEach((p) => {
    results.push({
      title: pageTitle,
      content: p.textContent || '',
      url: pageUrl
    })
  })

  return results
} 