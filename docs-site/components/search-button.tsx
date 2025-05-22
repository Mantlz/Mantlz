'use client'

import { Search } from "lucide-react"
import { Button } from "./ui/button"

export function SearchButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="hidden md:flex items-center gap-2"
      onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
    >
      <Search className="h-4 w-4" />
      <span>Search</span>
      <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  )
} 