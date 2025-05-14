'use client'

import React from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FileUploaderMinimal } from '@uploadcare/react-uploader/next'
import '@uploadcare/react-uploader/core.css'

interface FileUploadProps {
  value?: File | string
  onChange?: (value: File | string) => void
  onBlur?: () => void
  name?: string
  accept?: string[]
  maxSize?: number
  required?: boolean
  disabled?: boolean
  className?: string
}

// You can keep this config outside the component if it's static
export const UPLOADCARE_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || '',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [
    'image/*',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
  locale: 'en',
  localePluralize: true,
  previewStep: true,
  multiple: false,
  tabs: 'file url gdrive dropbox',
  preferredTypes: 'image/*',
  imagePreviewMaxSize: 5 * 1024 * 1024, // 5MB
  imageShrink: {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1920,
  },
}

export function FileUpload({
  value,
  onChange,
  //name,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  //required = false,
  disabled = false,
  className,
}: FileUploadProps) {
  const handleFileChange = (fileInfo: { cdnUrl: string }) => {
    if (fileInfo?.cdnUrl) {
      // Convert the URL to a string for form submission
      onChange?.(fileInfo.cdnUrl)
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
        <FileUploaderMinimal
          pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || ''}
          onFileUploadSuccess={handleFileChange}
          useCloudImageEditor={false}
          sourceList="local, camera"
          classNameUploader="uc-light"
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
