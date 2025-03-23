import { z } from "zod";
import { j, privateProcedure } from "../jstack";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { HTTPException } from "hono/http-exception";
import { User } from "@prisma/client";

// Define available form templates
const formTemplates = {
  feedback: {
    name: "Feedback Form",
    description: "Collect user feedback",
    schema: z.object({
      rating: z.number().min(1).max(5),
      feedback: z.string().min(10),
      email: z.string().email().optional(),
    }),
  },
  waitlist: {
    name: "Waitlist Form",
    description: "Collect waitlist signups",
    schema: z.object({
      email: z.string().email(),
      name: z.string().min(2),
      referralSource: z.string().optional(),
    }),
  },
  // Add more templates as needed
} as const;

type FormTemplateType = keyof typeof formTemplates;

export const formRouter = j.router({
  // Get all forms created by the authenticated user
  getUserForms: privateProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.string().optional(),
    }).optional())
    .query(async ({ c, input, ctx }) => {
      if (!ctx.user) {
        throw new HTTPException(401, { message: "User not authenticated" });
      }
      
      // Get forms with pagination
      const take = input?.limit ?? 10;
      const cursor = input?.cursor;
      
      const forms = await db.form.findMany({
        where: { userId: ctx.user.id },
        take: take + 1, // Get one extra to determine if there's a next page
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { submissions: true }
          }
        }
      });
      
      // Check if we have more results
      const hasMore = forms.length > take;
      const data = hasMore ? forms.slice(0, take) : forms;
      
      return c.superjson({
        forms: data.map(form => ({
          id: form.id,
          name: form.name,
          description: form.description,
          submissionCount: form._count.submissions,
          createdAt: form.createdAt,
          updatedAt: form.updatedAt,
        })),
        nextCursor: hasMore && data.length > 0 ? data[data.length - 1]?.id : undefined,
      });
    }),

  // Get available templates
  getTemplates: j.procedure.query(({ c }) => {
    return c.superjson(
      Object.entries(formTemplates).map(([id, template]) => ({
        id,
        name: template.name,
        description: template.description,
      }))
    );
  }),

  // Create form from template
  createFromTemplate: j.procedure
    .input(z.object({
      templateId: z.enum(['feedback', 'waitlist'] as const),
      name: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ c, input }) => {
      const auth = await currentUser();
      if (!auth) throw new HTTPException(401, { message: "Unauthorized" });

      const user = await db.user.findUnique({
        where: { clerkId: auth.id },
        include: { forms: true }
      });

      if (!user) throw new HTTPException(404, { message: "User not found" });

      // Check form limits based on plan
      const formLimit = user.plan === 'FREE' ? 1 : 
                       user.plan === 'STANDARD' ? 10 : Infinity;
      
      if (user.forms.length >= formLimit) {
        throw new HTTPException(403, { message: "Form limit reached for your plan" });
      }

      const template = formTemplates[input.templateId];
      
      const form = await db.form.create({
        data: {
          name: input.name || template.name,
          description: input.description || template.description,
          schema: template.schema.toString(), // Serialize the schema
          userId: user.id,
        },
      });

      return c.superjson({
        id: form.id,
        name: form.name,
        description: form.description,
      });
    }),

  // Create custom form (existing create endpoint)
  create: j.procedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      schema: z.string(),
    }))
    .mutation(async ({ c, input }) => {
      // TODO: Implement form creation logic
      return c.superjson({
        id: "temp-id",
        name: input.name,
        description: input.description,
        schema: input.schema,
      });
    }),

  // Get form by ID
  getFormById: privateProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ c, ctx, input }) => {
      const { id } = input;
      const userId = ctx.user.id;
      
      const form = await db.form.findUnique({
        where: {
          id,
          userId,
        },
        include: {
          _count: {
            select: {
              submissions: true,
            },
          },
        },
      });
      
      if (!form) {
        throw new Error('Form not found');
      }
      
      return c.superjson({
        id: form.id,
        name: form.name,
        description: form.description,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
        submissionCount: form._count.submissions,
      });
    }),
    
  // Get form submissions
  getFormSubmissions: privateProcedure
    .input(z.object({
      formId: z.string(),
    }))
    .query(async ({ c, ctx, input }) => {
      const { formId } = input;
      const userId = ctx.user.id;
      
      // Verify form ownership
      const form = await db.form.findUnique({
        where: {
          id: formId,
          userId,
        },
      });
      
      if (!form) {
        throw new Error('Form not found');
      }
      
      const submissions = await db.submission.findMany({
        where: {
          formId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          createdAt: true,
          data: true,
        },
      });
      
      return c.superjson({
        submissions,
      });
    }),

  // Get public form
  getPublicForm: j.procedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ c, input }) => {
      const { id } = input;
      
      const form = await db.form.findUnique({
        where: { id },
      });
      
      if (!form) {
        throw new Error('Form not found');
      }
      
      // Parse the schema to get form fields
      const schemaObj = JSON.parse(form.schema);
      const fields = Object.entries(schemaObj).map(([name, fieldSchema]: [string, any]) => {
        return {
          name,
          label: name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1'),
          type: fieldSchema.type === 'string' && fieldSchema.format === 'email' ? 'email' : 
                fieldSchema.type === 'string' ? 'text' : 
                'textarea',
          required: !fieldSchema.optional
        };
      });
      
      return c.superjson({
        id: form.id,
        name: form.name,
        description: form.description,
        fields
      });
    }),

  // Submit form
  submitForm: j.procedure
    .input(z.object({
      formId: z.string(),
      data: z.record(z.any())
    }))
    .mutation(async ({ c, input }) => {
      const { formId, data } = input;
      
      // Get the form to validate the submission
      const form = await db.form.findUnique({
        where: { id: formId },
      });
      
      if (!form) {
        throw new Error('Form not found');
      }
      
      // Create the submission
      const submission = await db.submission.create({
        data: {
          formId,
          data: data,
        },
      });
      
      return c.superjson({
        id: submission.id,
        message: 'Form submitted successfully'
      });
    })
});


