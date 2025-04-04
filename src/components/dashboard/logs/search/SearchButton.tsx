"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface SearchButtonProps {
  onClick: () => void
}

export function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9 gap-2 cursor-pointer rounded-full bg-white/80 dark:bg-zinc-800/80 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 backdrop-blur shadow-sm"
      onClick={onClick}
    >
      <Search className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
      <span className="hidden sm:inline-flex text-sm font-normal">Search</span>
      <div className="hidden sm:flex items-center justify-center h-5 px-1.5 ml-1 rounded-md bg-gray-100 dark:bg-zinc-900">
        <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 flex items-center">
          <span className="text-[9px] mr-0.5">⌘</span>K
        </span>
      </div>
    </Button>
  )
} 