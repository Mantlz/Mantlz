'use client'

import { cn } from '@/lib/utils'
import '@uploadcare/react-uploader/core.css'
import { Upload } from 'lucide-react'

interface FileUploadProps {
  className?: string
  disabled?: boolean
  accept?: string
  maxSize?: number
  value?: string
}

export function FileUpload({
  className,
  disabled = false,
  accept,
  maxSize,
  value
}: FileUploadProps) {
  return (
    <div className={cn('relative w-full max-w-2xl mx-auto', className)}>
      <div
        className={cn(
          'flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg',
          'bg-white dark:bg-zinc-900',
          'border-zinc-200 dark:border-zinc-800',
          'hover:border-zinc-300 dark:hover:border-zinc-700',
          'transition-colors duration-200',
          'shadow-sm',
          'p-6',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Upload className="w-10 h-10 mb-3 text-zinc-400" />
        <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">
          Drag & drop a file here, or click to select
          {accept && (
            <span className="block text-xs mt-2">
              Accepted formats: {accept}
            </span>
          )}
          {maxSize && (
            <span className="block text-xs mt-1">
              Max size: {maxSize / (1024 * 1024)}MB
            </span>
          )}
        </p>
      </div>

      {value && (
        <div className="mt-3 text-sm text-center text-zinc-600 dark:text-zinc-400">
          Selected file: {value}
        </div>
      )}
    </div>
  )
}
