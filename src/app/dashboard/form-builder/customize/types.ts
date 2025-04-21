// Form field types
export type FieldType = 'text' | 'email' | 'textarea' | 'number' | 'checkbox' | 'select'

// Form field interface
export interface FormField {
  id: string
  name: string
  label: string
  type: FieldType
  required: boolean
  placeholder?: string
  options?: string[] // For select fields
} 