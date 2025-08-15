import { z } from "zod";
import { j, privateProcedure } from "../jstack";
import { db } from "@/lib/db";
import { HTTPException } from "hono/http-exception";
import { FormService } from "@/server/form-services/form-service";
import { SubmissionService } from "@/server/form-services/submission-service";

// Helper function to parse natural language queries
function parseQuery(message: string, formSlug: string) {
  const lowerMessage = message.toLowerCase();
  
  // Time-based patterns
  const timePatterns: Record<string, { hours?: number; days?: number; offset?: number }> = {
    '24 hours': { hours: 24 },
    'today': { hours: 24 },
    'last day': { hours: 24 },
    'yesterday': { hours: 48, offset: 24 },
    'this week': { days: 7 },
    'last week': { days: 14, offset: 7 },
    'this month': { days: 30 },
    'last month': { days: 60, offset: 30 },
    'last 7 days': { days: 7 },
    'last 30 days': { days: 30 },
    'past week': { days: 7 },
    'past month': { days: 30 }
  };

  // Find time pattern
  let timeframe: { hours?: number; days?: number; offset?: number } | null = null;
  let timeframeText = '';
  
  for (const [pattern, config] of Object.entries(timePatterns)) {
    if (lowerMessage.includes(pattern)) {
      timeframe = config;
      timeframeText = pattern;
      break;
    }
  }

  // Default to last 24 hours if no timeframe specified
  if (!timeframe) {
    timeframe = { hours: 24 };
    timeframeText = 'last 24 hours';
  }

  // Calculate date range
  const now = new Date();
  let startDate: Date;
  let endDate: Date = now;

  if (timeframe.hours) {
    startDate = new Date(now.getTime() - (timeframe.hours * 60 * 60 * 1000));
    if (timeframe.offset) {
      endDate = new Date(now.getTime() - (timeframe.offset * 60 * 60 * 1000));
    }
  } else if (timeframe.days) {
    startDate = new Date(now.getTime() - (timeframe.days * 24 * 60 * 60 * 1000));
    if (timeframe.offset) {
      endDate = new Date(now.getTime() - (timeframe.offset * 24 * 60 * 60 * 1000));
    }
  } else {
    // Fallback
    startDate = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  }

  // Determine query type
  let queryType = 'count'; // default
  if (lowerMessage.includes('show') || lowerMessage.includes('list') || lowerMessage.includes('display')) {
    queryType = 'list';
  } else if (lowerMessage.includes('how many') || lowerMessage.includes('count') || lowerMessage.includes('number')) {
    queryType = 'count';
  }

  return {
    queryType,
    startDate,
    endDate,
    timeframeText,
    formSlug
  };
}

// Helper function to generate response text
function generateResponse(queryType: string, count: number, formName: string, timeframeText: string, submissions?: any[]) {
  if (queryType === 'count') {
    if (count === 0) {
      return `No submissions found for **${formName}** in the ${timeframeText}.`;
    } else if (count === 1) {
      return `There has been **1 submission** to **${formName}** in the ${timeframeText}.`;
    } else {
      return `There have been **${count} submissions** to **${formName}** in the ${timeframeText}.`;
    }
  } else if (queryType === 'list') {
    if (count === 0) {
      return `No submissions found for **${formName}** in the ${timeframeText}.`;
    } else {
      return `Found **${count} submissions** for **${formName}** in the ${timeframeText}. Here's the summary:`;
    }
  }
  
  return `Found ${count} results for **${formName}** in the ${timeframeText}.`;
}

export const chatRouter = j.router({
  // Main chat query endpoint
  query: privateProcedure
    .input(z.object({
      message: z.string(),
      formSlug: z.string(),
    }))
    .mutation(async ({ c, input, ctx }) => {
      if (!ctx.user) {
        throw new HTTPException(401, { message: "User not authenticated" });
      }

      try {
        const { message, formSlug } = input;
        
        // Parse the natural language query
        const parsedQuery = parseQuery(message, formSlug);
        
        // Find the form by name/slug (search by name since we don't have slugs)
        const forms = await db.form.findMany({
          where: {
            userId: ctx.user.id,
            OR: [
              { name: { contains: formSlug, mode: 'insensitive' } },
              { id: formSlug } // Also try by ID
            ]
          },
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                submissions: true
              }
            }
          }
        });

        if (forms.length === 0) {
          return c.superjson({
            response: `I couldn't find a form matching "${formSlug}". Please check the form name and try again. You can reference forms using their exact name like @waitlist or @contact-form.`,
            formData: null
          });
        }

        // Use the first matching form
        const form = forms[0];
        if (!form) {
          return c.superjson({
            response: `I couldn't find a form matching "${formSlug}". Please check the form name and try again.`,
            formData: null
          });
        }
        
        // Get submissions within the specified timeframe
        const submissions = await db.submission.findMany({
          where: {
            formId: form.id,
            createdAt: {
              gte: parsedQuery.startDate,
              lte: parsedQuery.endDate
            }
          },
          select: {
            id: true,
            createdAt: true,
            data: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        const count = submissions.length;
        const response = generateResponse(
          parsedQuery.queryType,
          count,
          form.name,
          parsedQuery.timeframeText,
          submissions
        );

        return c.superjson({
          response,
          formData: {
            formName: form.name,
            count,
            timeframe: parsedQuery.timeframeText
          },
          submissions: parsedQuery.queryType === 'list' ? submissions.slice(0, 10) : undefined // Limit to 10 for display
        });

      } catch (error) {
        console.error('Chat query error:', error);
        throw new HTTPException(500, { message: "Failed to process chat query" });
      }
    }),

  // Get available forms for suggestions
  getForms: privateProcedure
    .query(async ({ c, ctx }) => {
      if (!ctx.user) {
        throw new HTTPException(401, { message: "User not authenticated" });
      }

      try {
        const forms = await db.form.findMany({
          where: {
            userId: ctx.user.id
          },
          select: {
            id: true,
            name: true,
            formType: true,
            _count: {
              select: {
                submissions: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        return c.superjson({
          forms: forms.map(form => ({
            id: form.id,
            name: form.name,
            slug: form.name.toLowerCase().replace(/\s+/g, '-'),
            type: form.formType,
            submissionCount: form._count.submissions
          }))
        });

      } catch (error) {
        console.error('Get forms error:', error);
        throw new HTTPException(500, { message: "Failed to fetch forms" });
      }
    }),

  // Get form analytics for chat responses
  getFormAnalytics: privateProcedure
    .input(z.object({
      formId: z.string(),
      timeRange: z.enum(['hour', 'day', 'week', 'month']).default('day'),
    }))
    .query(async ({ c, input, ctx }) => {
      if (!ctx.user) {
        throw new HTTPException(401, { message: "User not authenticated" });
      }

      try {
        const { formId, timeRange } = input;
        
        // Verify form ownership
        const form = await db.form.findFirst({
          where: {
            id: formId,
            userId: ctx.user.id
          }
        });

        if (!form) {
          throw new HTTPException(404, { message: "Form not found" });
        }

        // Calculate time ranges
        const now = new Date();
        let startDate: Date;
        
        switch (timeRange) {
          case 'hour':
            startDate = new Date(now.getTime() - (60 * 60 * 1000));
            break;
          case 'day':
            startDate = new Date(now.getTime() - (24 * 60 * 60 * 1000));
            break;
          case 'week':
            startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
            break;
          case 'month':
            startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
            break;
        }

        // Get submissions count
        const submissionsCount = await db.submission.count({
          where: {
            formId: formId,
            createdAt: {
              gte: startDate
            }
          }
        });

        // Get recent submissions for additional context
        const recentSubmissions = await db.submission.findMany({
          where: {
            formId: formId,
            createdAt: {
              gte: startDate
            }
          },
          select: {
            createdAt: true,
            data: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        });

        return c.superjson({
          formName: form.name,
          timeRange,
          submissionsCount,
          recentSubmissions,
          startDate,
          endDate: now
        });

      } catch (error) {
        console.error('Get form analytics error:', error);
        throw new HTTPException(500, { message: "Failed to fetch form analytics" });
      }
    })
});