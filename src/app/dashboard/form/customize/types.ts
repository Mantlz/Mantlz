// Form field types
export type FieldType = 'text' | 'email' | 'textarea' | 'number' | 'checkbox' | 'select' | 'file'

// Form field interface
export interface FormField {
  id: string
  name: string
  label: string
  type: 'text' | 'email' | 'textarea' | 'checkbox' | 'select' | 'file' | 'number'
  required: boolean
  placeholder?: string
  options?: string[] // For select fields
  accept?: string[] // For file fields to specify accepted file types
  maxSize?: number // For file fields to specify max file size in bytes
} 