// Form field types
export type FieldType = 'text' | 'email' | 'textarea' | 'number' | 'checkbox' | 'select' | 'file' | 'product'

// Form types
export type FormType = 'waitlist' | 'contact' | 'feedback' | 'custom' | 'survey' | 'application' | 'order' | 'analytics-opt-in' | 'rsvp'

// Product display modes
export type ProductDisplayMode = 'grid' | 'list' | 'single'

// Form field interface
export interface FormField {
  id: string
  name: string
  label: string
  type: 'text' | 'email' | 'textarea' | 'checkbox' | 'select' | 'file' | 'number' | 'product'
  required: boolean
  placeholder?: string
  options?: string[] // For select fields
  accept?: string[] // For file fields to specify accepted file types
  maxSize?: number // For file fields to specify max file size in bytes
  premium?: boolean // Whether this field is only available for premium users
  displayMode?: ProductDisplayMode // For product fields to specify display mode
  productIds?: string[] // For product fields to specify which products to display
} 