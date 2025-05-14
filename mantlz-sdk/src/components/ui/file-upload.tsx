'use client'

import React from 'react'
import { Upload } from 'lucide-react'
import { cn } from '../../utils/cn'

interface FileUploadProps {
  value?: File | string
  onChange?: (file: File) => void
  onBlur?: () => void
  name?: string
  accept?: string[]
  maxSize?: number
  required?: boolean
  disabled?: boolean
  className?: string
}

export function FileUpload({
  value,
  onChange,
  name,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  required = false,
  disabled = false,
  className,
}: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onChange?.(file)
    }
  }

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg',
          'bg-white dark:bg-zinc-900',
          'border-zinc-200 dark:border-zinc-800',
          'hover:border-zinc-300 dark:hover:border-zinc-700',
          'transition-colors duration-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          type="file"
          onChange={handleFileChange}
          accept={accept?.join(',')}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
          required={required}
          name={name}
        />
        <Upload className="w-8 h-8 mb-2 text-zinc-400" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Drag & drop a file here, or click to select
          {accept && (
            <span className="block text-xs mt-1">
              Accepted formats: {accept.join(', ')}
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
        <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Current file: {typeof value === 'string' ? value : value.name}
        </div>
      )}
    </div>
  )
} 