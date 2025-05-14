import { uploadFile as uploadcareUpload } from '@uploadcare/upload-client';

export async function uploadFile(file: File): Promise<string> {
  const publicKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;
  
  if (!publicKey) {
    console.error('Uploadcare public key is not configured');
    throw new Error('File upload service is not configured');
  }

  if (!file || !(file instanceof File)) {
    throw new Error('Invalid file provided');
  }

  try {
    console.log(`Attempting to upload file: ${file.name} (${file.size} bytes)`);
    
    const result = await uploadcareUpload(file, {
      publicKey,
      store: true // Store the file permanently
    });
    
    if (!result.cdnUrl) {
      console.error('Upload failed: No CDN URL returned');
      throw new Error('Upload failed: No CDN URL returned');
    }
    
    console.log(`File uploaded successfully: ${result.cdnUrl}`);
    return result.cdnUrl;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error(error instanceof Error ? error.message : 'File upload failed');
  }
} 