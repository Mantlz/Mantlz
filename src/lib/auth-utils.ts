import { db } from './db';

/**
 * Validates an API key
 * @param apiKey - The API key to validate
 * @returns True if valid, false otherwise
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    if (!apiKey) return false;
    
    const apiKeyRecord = await db.apiKey.findUnique({
      where: {
        key: apiKey,
        isActive: true,
      }
    });

    if (!apiKeyRecord) return false;

    // Update last used timestamp
    await db.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() },
    });

    return true;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
} 