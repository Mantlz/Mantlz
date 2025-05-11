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
}; 