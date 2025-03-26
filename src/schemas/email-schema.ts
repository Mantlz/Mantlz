import { z } from 'zod';
import { CampaignStatus } from '@prisma/client';

export const emailSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  fromName: z.string().min(1, "Sender name is required"),
  subject: z.string().min(1, "Subject is required"),
  previewText: z.string().optional(),
  content: z.any(), // For EditorJS content
  templateId: z.string().optional(),
  listId: z.string().optional(),
  scheduledFor: z.date().optional(),
  status: z.nativeEnum(CampaignStatus).default(CampaignStatus.DRAFT),
  replyTo: z.string().email("Invalid reply-to email").optional(),
});

export type CreateCampaignSchema = z.infer<typeof emailSchema> & {
  userId: string;
  fromEmail: string; // This is set automatically when creating a campaign
}; 