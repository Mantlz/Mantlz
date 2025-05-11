'use client'

import React, { useEffect, useRef } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UPLOADCARE_CONFIG } from '@/config/uploadcare'

interface FileUploadProps {
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  name?: string
  accept?: string
  maxSize?: number
  required?: boolean
  disabled?: boolean
  className?: string
}

declare global {
  interface Window {
    uploadcare: {
      Widget: any
    }
  }
}

export function FileUpload({
  value,
  onChange,
  onBlur,
  name,
  accept,
  maxSize = UPLOADCARE_CONFIG.maxFileSize,
  required = false,
  disabled = false,
  className,
}: FileUploadProps) {
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.uploadcare) {
      const widget = window.uploadcare.Widget('[role=uploadcare-uploader]')
      widgetRef.current = widget

      widget.onUploadComplete((fileInfo: any) => {
        if (fileInfo && fileInfo.cdnUrl) {
          onChange?.(fileInfo.cdnUrl)
        }
      })

      return () => {
        widget.off('uploadComplete')
      }
    }
  }, [onChange])

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
          type="hidden"
          role="uploadcare-uploader"
          data-public-key={UPLOADCARE_CONFIG.publicKey}
          data-max-size={maxSize}
          data-locale={UPLOADCARE_CONFIG.locale}
          data-locale-pluralize={UPLOADCARE_CONFIG.localePluralize}
          data-preview-step={UPLOADCARE_CONFIG.previewStep}
          data-multiple={UPLOADCARE_CONFIG.multiple}
          data-tabs={UPLOADCARE_CONFIG.tabs}
          data-preferred-types={accept || UPLOADCARE_CONFIG.preferredTypes}
          data-image-preview-max-size={UPLOADCARE_CONFIG.imagePreviewMaxSize}
          data-image-shrink={JSON.stringify(UPLOADCARE_CONFIG.imageShrink)}
          name={name}
          required={required}
          disabled={disabled}
        />
        <Upload className="w-8 h-8 mb-2 text-zinc-400" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Drag & drop a file here, or click to select
          {accept && (
            <span className="block text-xs mt-1">
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
        <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Current file: {value}
        </div>
      )}
    </div>
  )
} 