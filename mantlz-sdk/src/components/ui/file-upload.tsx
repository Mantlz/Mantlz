'use client'

import React, { useCallback } from 'react'
import { Upload, File as FileIcon, X } from 'lucide-react'
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
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size
      if (maxSize && file.size > maxSize) {
        alert(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      
      // Validate file type
      if (accept && accept.length > 0) {
        const isValidType = accept.some(type => 
          type.startsWith('.') ? file.name.toLowerCase().endsWith(type.toLowerCase()) : file.type.includes(type)
        );
        if (!isValidType) {
          alert(`File type must be one of: ${accept.join(', ')}`);
          return;
        }
      }
      
      onChange?.(file);
    }
  }, [onChange, maxSize, accept]);

  const handleRemoveFile = useCallback(() => {
    onChange?.(undefined as any);
  }, [onChange]);

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const truncateFileName = (fileName: string, maxLength: number = 20) => {
    if (fileName.length <= maxLength) return fileName;
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.substring(0, maxLength - 3) + '...';
    return extension ? `${truncatedName}.${extension}` : truncatedName;
  };

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'flex flex-col items-center justify-center w-full min-h-[8rem] border-2 border-dashed rounded-lg p-4',
          'bg-white dark:bg-zinc-900',
          'border-zinc-200 dark:border-zinc-800',
          'hover:border-zinc-300 dark:hover:border-zinc-700',
          'transition-colors duration-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {!value ? (
          <>
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
            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400">
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
          </>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <div className="flex items-center space-x-3 min-w-0">
                <FileIcon className="w-6 h-6 shrink-0 text-blue-500" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate" title={typeof value === 'string' ? value : value.name}>
                    {typeof value === 'string' ? truncateFileName(value) : truncateFileName(value.name)}
                  </span>
                  {typeof value !== 'string' && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatFileSize(value.size)}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors shrink-0 ml-2"
                disabled={disabled}
              >
                <X className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              </button>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              accept={accept?.join(',')}
              className="hidden"
              disabled={disabled}
              required={required}
              name={name}
            />
          </div>
        )}
      </div>
    </div>
  )
} 