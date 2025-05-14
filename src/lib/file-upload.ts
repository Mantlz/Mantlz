import { uploadFile as uploadcareUpload } from '@uploadcare/upload-client';

export async function uploadFile(file: File): Promise<string> {
  try {
    // Check if we have the required API key
    const publicKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;
    if (!publicKey) {
      console.error('Uploadcare public key is not configured');
      throw new Error('File upload configuration is missing');
    }

    // Log file details for debugging
    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });

    const result = await uploadcareUpload(file, {
      publicKey,
      store: true // Store the file permanently
    });
    
    if (!result.cdnUrl) {
      console.error('Upload failed: No CDN URL returned', result);
      throw new Error('Upload failed: No CDN URL returned');
    }
    
    console.log('File uploaded successfully:', result.cdnUrl);
    return result.cdnUrl;
  } catch (error) {
    console.error('File upload error:', error);
    if (error instanceof Error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
    throw new Error('File upload failed: Unknown error');
  }
} 