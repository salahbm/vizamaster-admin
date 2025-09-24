import { z } from 'zod';

import { FileType } from '@/generated/prisma';

export const fileDto = z.object({
  id: z.string().optional(),
  applicantId: z.string(),

  fileType: z
    .enum([
      FileType.PASSPORT,
      FileType.VISA,
      FileType.CV,
      FileType.INSURANCE,
      FileType.FLIGHT_DOCUMENT,
      FileType.OTHER,
    ])
    .default(FileType.OTHER),
  fileKey: z.string(),
  fileName: z.string(),
  fileSize: z.number().int().positive().optional(),
  mimeType: z.string().optional(),
});

export type TFileDto = z.infer<typeof fileDto>;

export const uploadRequestSchema = z.object({
  fileKey: z.string(),
  contentType: z.string(),
  applicantId: z.string(),
  fileType: z.enum([
    FileType.PASSPORT,
    FileType.VISA,
    FileType.CV,
    FileType.INSURANCE,
    FileType.FLIGHT_DOCUMENT,
    FileType.OTHER,
  ]),
  fileSize: z.number().int().positive(),
});
