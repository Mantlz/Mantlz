"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface SearchButtonProps {
  onClick: () => void
}

export function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 gap-2 cursor-pointer bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"
      onClick={onClick}
    >
      <Search className="h-3.5 w-3.5 text-gray-500" />
      <span className="hidden sm:inline-flex">Quick Search</span>
      <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-gray-600 dark:text-gray-400 ml-2">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  )
} 