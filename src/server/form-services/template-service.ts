import { FormType } from "@prisma/client";
// import { z } from "zod";
import { formTemplates } from "@/lib/form-templates";
import { db } from "@/lib/db";
import { HTTPException } from "hono/http-exception";

// Define the template service to handle form templates
export class TemplateService {
  // Get a template by ID
  static getTemplateById(id: keyof typeof formTemplates) {
    const template = formTemplates[id];
    if (!template) {
      throw new Error(`Template with ID ${id} not found`);
    }
    return template;
  }

  // Create a form from a template
  static async createFormFromTemplate(
    userId: string,
    templateId: keyof typeof formTemplates,
    name?: string,
    description?: string
  ) {
    try {
      const template = this.getTemplateById(templateId);
      
      // Use the template's form type or fallback to CUSTOM
      const formType = template.formType || FormType.CUSTOM;
      
      // Store form type in settings for backward compatibility
      const settings = {
        formType: templateId
      };
      
      const form = await db.form.create({
        data: {
          name: name || template.name,
          description: description || template.description,
          schema: template.schema.toString(), // Serialize the schema
          userId: userId,
          formType: formType,
          settings,
          emailSettings: {
            create: {
              enabled: false
            }
          }
        },
      });

      return form;
    } catch (error) {
      console.error('Error creating form from template:', error);
      throw new HTTPException(500, { message: "Failed to create form from template" });
    }
  }

  // Get all available templates
  static getAllTemplates() {
    return Object.values(formTemplates);
  }

  // Get template schema by ID
  static getTemplateSchema(id: keyof typeof formTemplates) {
    const template = this.getTemplateById(id);
    return template.schema;
  }

  // Detect form type from schema
  static detectFormType(schema: string): FormType {
    try {
      const schemaLower = schema.toLowerCase();
      
      // 1. First check explicit form type indicators in schema
      if (schemaLower.includes('waitlist')) return FormType.WAITLIST;
      if (schemaLower.includes('feedback')) return FormType.FEEDBACK;
      if (schemaLower.includes('contact')) return FormType.CONTACT;
      if (schemaLower.includes('survey')) return FormType.SURVEY;
      if (schemaLower.includes('application')) return FormType.APPLICATION;
      if (schemaLower.includes('order')) return FormType.ORDER;
      if (schemaLower.includes('analytics')) return FormType.ANALYTICS_OPT_IN;
      if (schemaLower.includes('rsvp')) return FormType.RSVP;
      
      // 2. Check for field combinations
      const hasEmail = schema.includes('"email"') || schema.includes('email:');
      const hasName = schema.includes('"name"') || schema.includes('name:');
      const hasRating = schema.includes('"rating"') || schema.includes('rating:');
      const hasFeedback = schema.includes('"feedback"') || schema.includes('feedback:');
      const hasMessage = schema.includes('"message"') || schema.includes('message:');
      const hasAttending = schema.includes('"attending"') || schema.includes('attending:');
      const hasShipping = schema.includes('shipping') || schema.includes('address');
      const hasProduct = schema.includes('product') || schema.includes('quantity');
      const hasConsent = schema.includes('allow') || schema.includes('consent');
      const hasSatisfaction = schema.includes('satisfaction') || schema.includes('survey');
      
      if (hasRating && hasFeedback) return FormType.FEEDBACK;
      if (hasEmail && hasName && !hasMessage && !hasRating) return FormType.WAITLIST;
      if (hasEmail && hasName && hasMessage) return FormType.CONTACT;
      if (hasAttending || schema.includes('guest')) return FormType.RSVP;
      if (hasShipping && hasProduct) return FormType.ORDER;
      if (hasConsent) return FormType.ANALYTICS_OPT_IN;
      if (hasSatisfaction || schema.includes('occupation')) return FormType.SURVEY;
      if (schema.includes('experience') || schema.includes('education')) return FormType.APPLICATION;
      
      // 3. Default to custom if no patterns match
      return FormType.CUSTOM;
    } catch (error) {
      console.error('Error detecting form type:', error);
      return FormType.CUSTOM;
    }
  }
} 