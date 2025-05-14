import { uploadFile as uploadcareUpload } from '@uploadcare/upload-client';

export async function uploadFile(file: File): Promise<string> {
  try {
    const result = await uploadcareUpload(file, {
      publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || '',
    });
    return result.cdnUrl;
  } catch (error) {
    throw new Error('File upload failed');
  }
} 