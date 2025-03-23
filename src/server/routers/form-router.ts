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

  // Get form analytics data
  getFormAnalytics: privateProcedure
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
        }
      });
      
      if (!form) {
        throw new Error('Form not found');
      }
      
      // Get all submissions for this form
      const submissions = await db.submission.findMany({
        where: { formId },
        orderBy: { createdAt: 'asc' }
      });
      
      // Count unique emails (if available in submissions)
      const uniqueEmails = new Set();
      submissions.forEach(sub => {
        if (sub.email) uniqueEmails.add(sub.email);
      });
      
      // Get submission metrics for various time periods
      const now = new Date();
      
      // Last 24 hours
      const oneDayAgo = new Date(now);
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const last24HoursSubmissions = submissions.filter(sub => 
        new Date(sub.createdAt) >= oneDayAgo
      );
      
      // Last 7 days
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const lastWeekSubmissions = submissions.filter(sub => 
        new Date(sub.createdAt) >= oneWeekAgo
      );
      
      // Last 30 days
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
      const lastMonthSubmissions = submissions.filter(sub => 
        new Date(sub.createdAt) >= oneMonthAgo
      );
      
      // Create time series data (hourly for the last 24 hours)
      const timeSeriesData = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(now);
        hour.setHours(now.getHours() - 23 + i);
        hour.setMinutes(0, 0, 0);
        
        const nextHour = new Date(hour);
        nextHour.setHours(hour.getHours() + 1);
        
        // Filter submissions for this hour
        const hourSubmissions = submissions.filter(sub => {
          const subDate = new Date(sub.createdAt);
          return subDate >= hour && subDate < nextHour;
        });
        
        // Count unique emails in this hour if available
        const hourUniqueEmails = new Set();
        hourSubmissions.forEach(sub => {
          if (sub.email) hourUniqueEmails.add(sub.email);
        });
        
        return {
          time: `${hour.getHours()}:00`,
          submissions: hourSubmissions.length || 0,       // Total submissions in this hour
          uniqueEmails: hourUniqueEmails.size || 0,       // Unique emails in this hour (if available)
        };
      });
      
      // Return analytics data that matches our actual schema
      return c.superjson({
        totalSubmissions: submissions.length,
        uniqueSubmitters: uniqueEmails.size,
        last24Hours: last24HoursSubmissions.length,
        lastWeek: lastWeekSubmissions.length,
        lastMonth: lastMonthSubmissions.length,
        timeSeriesData,
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


