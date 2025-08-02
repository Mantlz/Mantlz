"use client"

import { FileSearch } from "lucide-react"

export function NoSubmissionsView() {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center text-center py-12 sm:py-16 border border-dashed border-zinc-200 dark:border-zinc-800">
      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6  flex items-center justify-center">
        <FileSearch className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
      </div>
      <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">No Submissions Found</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-xs mx-auto px-4">
        Submissions will appear here once your form receives responses
      </p>
    </div>
  )
} 




