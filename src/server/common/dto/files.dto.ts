import { z } from 'zod';

import { FileType } from '@/generated/prisma';

export const fileDto = z.object({
  id: z.string(),
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
  fileSize: z.number().int().positive(),
  mimeType: z.string(),

  preview: z.string(), // only for before upload
});

export type TFileDto = z.infer<typeof fileDto>;

export const uploadRequestSchema = z.object({
  applicantId: z.string(),
  fileType: z.enum([
    FileType.PASSPORT,
    FileType.VISA,
    FileType.CV,
    FileType.INSURANCE,
    FileType.FLIGHT_DOCUMENT,
    FileType.OTHER,
  ]),
  fileName: z.string(),
  fileSize: z.number().int().positive(),
  mimeType: z.string(),
});

export type TUploadRequestDto = z.infer<typeof uploadRequestSchema>;
