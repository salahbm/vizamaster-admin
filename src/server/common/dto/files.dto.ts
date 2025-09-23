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
  fileUrl: z.url(),
  fileName: z.string(),
  fileSize: z.number().int().positive().optional(),
  mimeType: z.string().optional(),
});

export type TFileDto = z.infer<typeof fileDto>;
