import { z } from 'zod';

export interface ServerActionOptions<T> {
  schema?: z.ZodSchema<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function createServerAction<T>(
  action: (data: T) => Promise<any>,
  options: ServerActionOptions<T> = {}
) {
  return async (data: T) => {
    try {
      if (options.schema) {
        data = options.schema.parse(data);
      }
      
      const result = await action(data);
      options.onSuccess?.(result);
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message);
      }
      options.onError?.(error as Error);
      throw error;
    }
  };
} 