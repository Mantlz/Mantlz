'use client'

import * as React from 'react'
import { DialogProps } from '@radix-ui/react-dialog'
import { Search, FileText, Book, Hash, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { searchContent, initSearchIndex, type SearchResult } from '@/lib/search'
import { cn } from '@/lib/utils'

export function CommandMenu({ ...props }: DialogProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isIndexInitialized, setIsIndexInitialized] = React.useState(false)

  // Initialize search index when component mounts
  React.useEffect(() => {
    async function init() {
      try {
        console.log('Initializing search index in CommandMenu...')
        await initSearchIndex()
        setIsIndexInitialized(true)
        console.log('Search index initialized successfully')
      } catch (error) {
        console.error('Failed to initialize search index:', error)
      }
    }

    if (!isIndexInitialized) {
      init()
    }
  }, [isIndexInitialized])

  // Handle search when query changes
  React.useEffect(() => {
    // console.log('Query changed:', query)
    if (query.length > 0 && isIndexInitialized) {
      console.log('Performing search...')
      const searchResults = searchContent(query)
      // console.log('Search completed, results:', searchResults)
      setResults(searchResults)
    } else {
      setResults([])
    }
  }, [query, isIndexInitialized])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl md:max-w-2xl">
        <DialogTitle className="sr-only">Search documentation</DialogTitle>
        <div className="flex flex-col">
          <div className="relative">
            <div className="flex items-center gap-3 border-b p-4">
              <Search className="h-5 w-5 text-muted-foreground/70" />
              <input
                className="flex h-10 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={isIndexInitialized ? "Search documentation..." : "Loading search index..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={!isIndexInitialized}
              />
              {query && (
                <kbd className="pointer-events-none hidden h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">⏎</span>
                </kbd>
              )}
            </div>
            {isIndexInitialized && query && (
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
            )}
          </div>
          <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent">
            {!isIndexInitialized ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="relative mx-auto h-12 w-12">
                    <Search className="absolute inset-0 h-12 w-12 animate-ping text-muted-foreground/30" />
                    <Search className="absolute inset-0 h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">Loading search index...</p>
                </div>
              </div>
            ) : query.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Book className="mx-auto h-12 w-12 text-muted-foreground/30" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Search the documentation...
                  </p>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground/30" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col py-2">
                {results.map((result, index) => {
                  const isHeading = result.url.includes('#')
                  return (
                    <button
                      key={`${result.url}-${index}`}
                      className={cn(
                        "group relative flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent",
                        isHeading && "pl-8"
                      )}
                      onClick={() => {
                        window.location.href = result.url
                        setOpen(false)
                      }}
                    >
                      {isHeading ? (
                        <Hash className="h-4 w-4 flex-shrink-0 text-muted-foreground/70" />
                      ) : (
                        <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground/70" />
                      )}
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <div className="line-clamp-1 font-medium">{result.title}</div>
                        <div className="flex items-center gap-2 text-xs">
                          {result.category && (
                            <>
                              <span className="font-medium text-muted-foreground/70">
                                {result.category}
                              </span>
                              <span className="text-muted-foreground/30">•</span>
                            </>
                          )}
                          {!isHeading && result.content && (
                            <span className="line-clamp-1 flex-1 text-muted-foreground/70">
                              {result.content.substring(0, 150).trim()}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="absolute right-4 h-4 w-4 flex-shrink-0 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 