"use client"

import { Mail } from "lucide-react"

export function NoSubmissionsView() {
  return (
    <div className="text-center py-12 sm:py-16 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
        <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">No submissions yet</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-sm mx-auto px-4">
        Submissions will appear here once your form receives responses
      </p>
    </div>
  )
} 