'use client'

import React, { useCallback } from 'react'
import { Upload, File as FileIcon, X } from 'lucide-react'

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
    <div className={`mantlz-file-upload ${className || ''}`}>
      <div className={`mantlz-file-upload-area ${disabled ? 'mantlz-disabled' : ''}`}>
        {!value ? (
          <>
            <input
              type="file"
              onChange={handleFileChange}
              accept={accept?.join(',')}
              className="mantlz-file-input"
              disabled={disabled}
              required={required}
              name={name}
            />
            <Upload className="mantlz-upload-icon" />
            <p className="mantlz-upload-text">
              Drag & drop a file here, or click to select
              {accept && (
                <span className="mantlz-upload-info">
                  Accepted formats: {accept.join(', ')}
                </span>
              )}
              {maxSize && (
                <span className="mantlz-upload-info">
                  Max size: {maxSize / (1024 * 1024)}MB
                </span>
              )}
            </p>
          </>
        ) : (
          <div className="mantlz-file-preview">
            <div className="mantlz-file-info">
              <FileIcon className="mantlz-file-icon" />
              <div>
                <span className="mantlz-filename">
                  {typeof value === 'string' ? truncateFileName(value) : truncateFileName(value.name)}
                </span>
                {typeof value !== 'string' && (
                  <span className="mantlz-filesize">
                    {formatFileSize(value.size)}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="mantlz-remove-button"
                disabled={disabled}
              >
                <X className="mantlz-remove-icon" />
              </button>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              accept={accept?.join(',')}
              className="mantlz-hidden-input"
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