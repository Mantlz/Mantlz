"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface SearchButtonProps {
  onClick: () => void
}

export function SearchButton({ onClick }: SearchButtonProps) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(window.navigator.userAgent.includes('Mac'));
  }, []);

  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="h-9 gap-2 cursor-pointer rounded-lg bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-zinc-200 dark:border-zinc-700 backdrop-blur shadow-sm"
    >
      <Search className="h-4 w-4" />
      <span className="text-sm font-normal hidden sm:inline-block">Search submissions...</span>
      <div className="hidden sm:flex items-center justify-center h-5 px-1.5 ml-1 rounded-md bg-zinc-100 dark:bg-zinc-800">
        <kbd className="text-xs font-mono tracking-wider text-gray-500 dark:text-gray-400">
          {isMac ? '⌘K' : 'Ctrl+K'}
        </kbd>
      </div>
    </Button>
  )
} 