// /Users/dalyjean/Desktop/formsQuay/src/sdk/core/index.ts
import { createClient } from "jstack";
import type { AppRouter } from "@/server";
import { z } from "zod";

export class FormsQuay {
  private client: ReturnType<typeof createClient<AppRouter>>;
  
  constructor(config: { baseUrl: string }) {
    this.client = createClient<AppRouter>({
      baseUrl: config.baseUrl,
    });
  }
  
  /**
   * Create a new form with schema validation
   */
  async createForm<T extends z.ZodType>(options: {
    name: string;
    description?: string;
    schema: T;
  }) {
    // This is a simplified version - expand as needed
    const response = await this.client.form.create.$post({
      name: options.name,
      description: options.description,
      schema: JSON.stringify(options.schema),
    });
    
    return response.json();
  }
  
  /**
   * Submit data to a form
   */
  async submitForm(formId: string, data: Record<string, any>) {
    const response = await this.client.form.submit.$post({
      formId,
      data,
    });
    
    return response.json();
  }
}

export default FormsQuay;