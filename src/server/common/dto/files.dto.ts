import { z } from 'zod';

export const fileDto = z.object({
  id: z.string().optional(),
  applicantId: z.string(),
  visaId: z.string().nullable().optional(),
  workId: z.string().nullable().optional(),

  fileType: z
    .enum(['PASSPORT', 'VISA', 'CV', 'INSURANCE', 'FLIGHT_DOCUMENT', 'OTHER'])
    .default('OTHER'),
  fileUrl: z.url(),
  fileName: z.string(),
  fileSize: z.number().int().positive().optional(),
  mimeType: z.string().optional(),

  preview: z.string().optional(), // For previewing the file in the UI

  createdBy: z.string().default('System'),
  updatedBy: z.string().default('System'),
});

export type TFileDto = z.infer<typeof fileDto>;
