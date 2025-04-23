import { db } from "@/lib/db";
import { z } from "zod";
import { format } from "date-fns";
import { Parser } from "json2csv";

// Define the schema for export options validation
const exportSchema = z.object({
  formId: z.string(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

type ExportOptions = z.infer<typeof exportSchema>;
type SubmissionData = Record<string, string | number | boolean | object>;

export async function exportFormSubmissions(options: ExportOptions) {
  // Validate options against schema
  const validatedOptions = exportSchema.parse(options);
  const { formId, startDate, endDate } = validatedOptions;

  // Get form details to include in export
  const form = await db.form.findUnique({
    where: { id: formId },
    select: { name: true, schema: true },
  });

  if (!form) {
    throw new Error("Form not found");
  }

  // Build query for submissions
  const where = {
    formId,
    ...(startDate && endDate
      ? {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }
      : {}),
  };

  // Get submissions with pagination to handle large datasets
  const submissions = await db.submission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      data: true,
      createdAt: true,
      email: true,
    },
  });

  // Transform submissions into a flat structure for export
  const exportData = submissions.map((submission) => {
    const baseData = {
      "Submission Date": format(submission.createdAt, "MMM d, yyyy 'at' h:mm a"),
    };

    // Flatten the nested data object and filter out metadata
    const flattenedData = Object.entries(submission.data as SubmissionData).reduce(
      (acc, [key, value]) => {
        // Skip metadata fields and email (since it's handled separately)
        if (key.startsWith('_') || key === 'email') return acc;
        
        if (typeof value === "object") {
          // Handle nested objects by stringifying them
          acc[key] = JSON.stringify(value);
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string | number | boolean>
    );

    // Add email only if it exists and isn't already in the data
    if (submission.email && !flattenedData.email) {
      flattenedData.email = submission.email;
    }

    return { ...baseData, ...flattenedData };
  });

  // Generate CSV with custom styling
  const parser = new Parser({
    fields: Object.keys(exportData[0] || {}),
    delimiter: ",",
    quote: '"',
    excelStrings: true,
    header: true,
    includeEmptyRows: false,
    withBOM: true, // Add BOM for proper Excel encoding
  });

  // Add custom styling to CSV
  const csvContent = parser.parse(exportData);
  
  // Add a title row and metadata
  const styledCsv = [
    `"${form.name} - Form Submissions"`,
    `"Generated on: ${format(new Date(), "MMM d, yyyy 'at' h:mm a")}"`,
    `"Total Submissions: ${submissions.length}"`,
    `"Date Range: ${startDate ? format(startDate, "MMM d, yyyy") : "All time"} - ${endDate ? format(endDate, "MMM d, yyyy") : "Present"}"`,
    "", // Empty line for spacing
    csvContent
  ].join("\n");

  return {
    data: `\ufeff${styledCsv}`, // Add BOM for Excel
    filename: `${form.name.toLowerCase().replace(/\s+/g, "-")}-submissions.csv`,
    contentType: "text/csv;charset=utf-8",
  };
} 