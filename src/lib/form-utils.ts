import { FormType } from '@prisma/client';

/**
 * Detects the form type based on schema content
 * 
 * @param schema The form schema as a string
 * @returns The detected FormType enum value
 */
export const detectFormType = (schema: string): FormType => {
  try {
    const schemaLower = schema.toLowerCase();
    
    // 1. First check explicit form type indicators in schema
    if (schemaLower.includes('waitlist')) return FormType.WAITLIST;
    if (schemaLower.includes('feedback')) return FormType.FEEDBACK;
    if (schemaLower.includes('contact')) return FormType.CONTACT;
    
    // 2. Check for field combinations
    const hasEmail = schema.includes('"email"') || schema.includes('email:');
    const hasName = schema.includes('"name"') || schema.includes('name:');
    const hasRating = schema.includes('"rating"') || schema.includes('rating:');
    const hasFeedback = schema.includes('"feedback"') || schema.includes('feedback:');
    const hasMessage = schema.includes('"message"') || schema.includes('message:');
    
    if (hasRating && hasFeedback) return FormType.FEEDBACK;
    if (hasEmail && hasName && !hasMessage && !hasRating) return FormType.WAITLIST;
    if (hasEmail && hasName && hasMessage) return FormType.CONTACT;
    
    // 3. Default to custom if no patterns match
    return FormType.CUSTOM;
  } catch (error) {
    console.error('Error detecting form type:', error);
    return FormType.CUSTOM;
  }
}; 