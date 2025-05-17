'use client'

import React, { useCallback } from 'react'
import { Upload, File as FileIcon, X } from 'lucide-react'
import * as Tooltip from '@radix-ui/react-tooltip'

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

  const handleRemoveFile = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const containerStyle: React.CSSProperties = {
    border: '2px dashed var(--gray-6)',
    borderRadius: '2px',
    padding: '8px',
    textAlign: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    backgroundColor: disabled ? 'var(--gray-3)' : 'var(--gray-1)',
    opacity: disabled ? 0.7 : 1,
    transition: 'all 0.2s',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '42px'
  };

  return (
    <Tooltip.Provider>
      <div 
        className={`${className || ''}`}
        style={{
          width: '100%',
          position: 'relative'
        }}
      >
        <div 
          className={`${disabled ? 'mantlz-disabled' : ''}`}
          style={containerStyle}
        >
          {!value ? (
            <>
              <input
                type="file"
                onChange={handleFileChange}
                accept={accept?.join(',')}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  zIndex: 2
                }}
                disabled={disabled}
                required={required}
                name={name}
              />
              <Upload 
                size={20} 
                style={{
                  color: 'var(--gray-9)',
                  marginBottom: '6px'
                }}
              />
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%'
              }}>
                <span style={{
                  margin: 0,
                  color: 'var(--gray-11)',
                  fontSize: '12px',
                  fontWeight: 500
                }}>
                  Drag & drop a file here, or click to select
                </span>
                {(accept || maxSize) && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    marginTop: '2px',
                    fontSize: '8px',
                    color: 'var(--gray-10)',
                    alignItems: 'center'
                  }}>
                    {accept && accept.length > 0 && (
                      <span>
                        Accepted formats: {accept.join(', ')}
                      </span>
                    )}
                    {maxSize && (
                      <span>
                        Max size: {maxSize / (1024 * 1024)}MB
                      </span>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <input
                type="file"
                onChange={handleFileChange}
                accept={accept?.join(',')}
                style={{
                  position: 'absolute',
                  width: '1px',
                  height: '1px',
                  padding: 0,
                  margin: '-1px',
                  overflow: 'hidden',
                  clip: 'rect(0, 0, 0, 0)',
                  border: 0
                }}
                disabled={disabled}
                required={required}
                name={name}
              />
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '4px 4px',
                gap: '8px',
                height: '24px'
              }}>
                {/* File Icon */}
                <div style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: 'var(--blue-3)',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileIcon style={{
                    color: 'var(--blue-9)',
                    width: '10px',
                    height: '10px'
                  }} />
                </div>

                {/* Filename */}
                <span style={{
                  fontWeight: 500,
                  fontSize: '12px',
                  color: 'var(--gray-12)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flexGrow: 1
                }}>
                  {typeof value === 'string' 
                    ? truncateFileName(value.split('/').pop() || value) 
                    : truncateFileName(value.name)}
                  {typeof value !== 'string' && (
                    <span style={{
                      color: 'var(--gray-10)',
                      fontSize: '10px',
                      marginLeft: '6px'
                    }}>
                      ({formatFileSize(value.size)})
                    </span>
                  )}
                </span>
                
                {/* X Button */}
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '16px',
                    height: '16px',
                    borderRadius: '2px',
                    border: 'none',
                    backgroundColor: 'var(--gray-4)',
                    color: 'var(--gray-11)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = 'var(--gray-5)';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = 'var(--gray-4)';
                  }}
                  disabled={disabled}
                >
                  <X size={10} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Tooltip.Provider>
  )
} 