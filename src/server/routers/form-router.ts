import { z } from "zod";
import { j } from "../jstack";

export const formRouter = j.router({
  create: j.procedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      schema: z.string(), // Serialized Zod schema
    }))
    .mutation(({ c, input }) => {
      // TODO: Implement form creation logic
      return c.superjson({
        id: "temp-id",
        name: input.name,
        description: input.description,
        schema: input.schema,
      });
    }),

  submit: j.procedure
    .input(z.object({
      formId: z.string(),
      data: z.record(z.any()),
    }))
    .mutation(({ c, input }) => {
      // TODO: Implement form submission logic
      return c.superjson({
        success: true,
        submissionId: "temp-submission-id",
      });
    }),
});
